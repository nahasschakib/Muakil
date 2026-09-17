import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getAgent } from '@/lib/agents'
import { getAgentPrompt } from '@/lib/agents/prompts'
import { anthropic } from '@/lib/anthropic'
import { db } from '@/lib/db'
import { braveSearch, formatSearchResults } from '@/lib/tools/braveSearch'
import type Anthropic from '@anthropic-ai/sdk'

const webSearchTool = {
  name: 'web_search',
  description:
    'Recherche des informations réelles sur internet — entreprises marocaines, contacts, actualités, prix du marché, réglementations, concurrents, prospects. Utilise cet outil dès que la question nécessite des données réelles, actualisées ou spécifiques à une entreprise, une ville, un secteur ou une personne au Maroc.',
  input_schema: {
    type: 'object' as const,
    properties: {
      query: {
        type: 'string',
        description:
          'La requête de recherche en français ou en anglais. Sois précis : inclure ville, secteur, type d\'entreprise si pertinent. Ex: "cabinets comptables Casablanca contact" ou "promoteurs immobiliers Marrakech LinkedIn"',
      },
      count: {
        type: 'number',
        description: 'Nombre de résultats souhaités (entre 3 et 10). Par défaut 5.',
      },
    },
    required: ['query'],
  },
}

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

    const anthropicMessages = messages.map(
      (m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })
    )

    // Premier appel — avec tool_use activé
    let response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      system: systemPrompt,
      tools: [webSearchTool],
      messages: anthropicMessages,
    })

    // Boucle tool_use — l'agent peut faire plusieurs recherches
    const toolMessages: Anthropic.MessageParam[] = []

    while (response.stop_reason === 'tool_use') {
      const toolUseBlocks = response.content.filter(
        (block) => block.type === 'tool_use'
      )

      const toolResults = await Promise.all(
        toolUseBlocks.map(async (block) => {
          if (block.type !== 'tool_use') return null
          if (block.name !== 'web_search') return null

          const input = block.input as { query: string; count?: number }

          try {
            const searchResponse = await braveSearch(
              input.query,
              input.count ?? 5
            )
            const formatted = formatSearchResults(searchResponse)

            return {
              type: 'tool_result' as const,
              tool_use_id: block.id,
              content: formatted,
            }
          } catch (err) {
            return {
              type: 'tool_result' as const,
              tool_use_id: block.id,
              content: `Erreur de recherche: ${String(err)}`,
              is_error: true,
            }
          }
        })
      )

      const validResults = toolResults.filter(Boolean)

      // Ajouter la réponse de l'agent + les résultats de recherche
      toolMessages.push({
        role: 'assistant' as const,
        content: response.content,
      })
      toolMessages.push({
        role: 'user' as const,
        content: validResults.filter(Boolean) as NonNullable<typeof validResults[number]>[],
      })

      // Nouvel appel avec les résultats de recherche
      response = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 4096,
        system: systemPrompt,
        tools: [webSearchTool],
        messages: [...anthropicMessages, ...toolMessages],
      })
    }

    // Extraire la réponse texte finale
    const textBlock = response.content.find((block) => block.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json({ error: 'Réponse inattendue' }, { status: 500 })
    }

    return NextResponse.json({ content: textBlock.text })
  } catch (error) {
    console.error('[chat/route]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
