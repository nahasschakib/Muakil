import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getAgent } from '@/lib/agents'
import { getAgentPrompt } from '@/lib/agents/prompts'
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

    const systemPrompt = getAgentPrompt(
      agent.slug,
      agent.prenom,
      agent.role,
      agent.description,
      bk
    )

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
