'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { Plan } from '@prisma/client'
import { revalidatePath } from 'next/cache'

async function requireAdmin() {
  const { userId } = await auth()
  if (userId !== process.env.ADMIN_USER_ID) {
    throw new Error('Accès refusé')
  }
}

export async function updateOrgPlan(orgId: string, plan: Plan) {
  await requireAdmin()
  await db.organization.update({
    where: { id: orgId },
    data: { plan },
  })
  revalidatePath('/admin')
}