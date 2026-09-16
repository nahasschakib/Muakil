'use server'

import { getCurrentOrg } from '@/lib/clerk'
import { db } from '@/lib/db'
import type { AgentSlug } from '@prisma/client'

export async function saveLivrable({
  agentSlug,
  title,
  content,
}: {
  agentSlug: string
  title: string
  content: string
}) {
  const { org } = await getCurrentOrg()

  if (!org) {
    throw new Error('Organisation non trouvée')
  }

  const livrable = await db.deliverable.create({
    data: {
      organizationId: org.id,
      agentSlug: agentSlug.toUpperCase() as AgentSlug,
      title,
      content,
      format: 'markdown',
    },
  })

  return livrable
}
