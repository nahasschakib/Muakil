'use server'

import { redirect } from 'next/navigation'
import { getCurrentOrg } from '@/lib/clerk'
import { db } from '@/lib/db'

export type OnboardingData = {
  // Étape 1
  brandName: string
  sector: string
  city: string
  formeJuridique: string
  // Étape 2 (optionnel)
  ice?: string
  ifFiscal?: string
  rc?: string
  cnss?: string
  capitalSocial?: string
  siegeSocial?: string
  // Étape 3 (optionnel)
  rib?: string
  banque?: string
  // Étape 4
  language: 'FR' | 'AR' | 'MIX'
  tone?: string
  forbiddenWords?: string[]
  icpProfile?: string
  cguAccepted?: boolean
}

export async function saveOnboarding(data: OnboardingData) {
  const { org, orgId } = await getCurrentOrg()

  if (!org) {
    throw new Error(`Organisation ${orgId} non trouvée en base`)
  }

  await db.brandKit.upsert({
    where: { organizationId: org.id },
    create: {
      organizationId: org.id,
      brandName: data.brandName,
      sector: data.sector,
      city: data.city,
      formeJuridique: data.formeJuridique,
      ice: data.ice || null,
      ifFiscal: data.ifFiscal || null,
      rc: data.rc || null,
      cnss: data.cnss || null,
      capitalSocial: data.capitalSocial || null,
      siegeSocial: data.siegeSocial || null,
      rib: data.rib || null,
      banque: data.banque || null,
      language: data.language,
      tone: data.tone || null,
      forbiddenWords: data.forbiddenWords || [],
      icpProfile: data.icpProfile || null,
    },
    update: {
      brandName: data.brandName,
      sector: data.sector,
      city: data.city,
      formeJuridique: data.formeJuridique,
      ice: data.ice || null,
      ifFiscal: data.ifFiscal || null,
      rc: data.rc || null,
      cnss: data.cnss || null,
      capitalSocial: data.capitalSocial || null,
      siegeSocial: data.siegeSocial || null,
      rib: data.rib || null,
      banque: data.banque || null,
      language: data.language,
      tone: data.tone || null,
      forbiddenWords: data.forbiddenWords || [],
      icpProfile: data.icpProfile || null,
    },
  })

  redirect('/agents')
}
