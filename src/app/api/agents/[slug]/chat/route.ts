import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getAgent } from '@/lib/agents'
import { anthropic } from '@/lib/anthropic'
import { db } from '@/lib/db'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { userId, orgId } = await auth()
    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { slug } = await params
    const agent = getAgent(slug)
    if (!agent) {
      return NextResponse.json({ error: 'Agent introuvable' }, { status: 404 })
    }

    const body = await req.json()
    const { messages } = body

    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages invalides' }, { status: 400 })
    }

    // Récupérer l'org + BrandKit depuis Neon
    const org = await db.organization.findUnique({
      where: { clerkOrgId: orgId },
      include: { brandKit: true },
    })

    const bk = org?.brandKit

    // Bloc contexte entreprise — injecté uniquement si BrandKit existe
    const contextEntreprise = bk
      ? `
## Contexte entreprise
Tu travailles pour "${bk.brandName}", une entreprise marocaine du secteur "${bk.sector}", basée à ${bk.city}.
- Forme juridique : ${bk.formeJuridique ?? 'non renseignée'}
- Langue de travail : ${bk.language}
- Ton de communication : ${bk.tone ?? 'professionnel'}
${bk.icpProfile ? `- Profil client cible : ${bk.icpProfile}` : ''}
${bk.forbiddenWords?.length ? `- Mots à éviter absolument : ${bk.forbiddenWords.join(', ')}` : ''}
${bk.ice ? `- ICE : ${bk.ice}` : ''}
${bk.rc ? `- RC : ${bk.rc}` : ''}
${bk.siegeSocial ? `- Siège social : ${bk.siegeSocial}` : ''}

Utilise toujours ces informations pour personnaliser tes réponses. Ne demande jamais des informations déjà présentes ici.`
      : ''

    const systemPrompt = `Tu es ${agent.prenom}, un agent IA spécialisé en "${agent.role}" pour le marché marocain.
${agent.description}
${contextEntreprise}

## Règles
- Tu réponds toujours en français sauf si l'utilisateur écrit en arabe ou darija
- Tu es professionnel, direct et utile
- Tu connais le contexte marocain : réglementations, culture business, spécificités locales
- Tu ne sors jamais de ton rôle de ${agent.prenom}
- Tu personnalises toujours tes réponses avec le contexte de l'entreprise ci-dessus`

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      return NextResponse.json({ error: 'Réponse inattendue' }, { status: 500 })
    }

    return NextResponse.json({ content: content.text })
  } catch (error) {
    console.error('[chat/route]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
