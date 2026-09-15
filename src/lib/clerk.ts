import { auth, currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function getCurrentOrg() {
  const { userId, orgId } = await auth()

  if (!userId || !orgId) {
    throw new Error('Non authentifié ou sans organisation')
  }

  const org = await db.organization.findUnique({
    where: { clerkOrgId: orgId },
    include: { brandKit: true },
  })

  return { userId, orgId, org }
}

export async function requireOrg() {
  const { org, orgId } = await getCurrentOrg()

  if (!org) {
    throw new Error(`Organisation ${orgId} non trouvée en base`)
  }

  return org
}
