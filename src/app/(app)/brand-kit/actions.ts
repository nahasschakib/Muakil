'use server'

import { revalidatePath } from 'next/cache'
import { getCurrentOrg } from '@/lib/clerk'
import { db } from '@/lib/db'

export type BrandKitData = {
  brandName: string
  sector: string
  city: string
  formeJuridique: string
  language: 'FR' | 'AR' | 'MIX'
  tone?: string
  icpProfile?: string
  forbiddenWords?: string[]
  ice?: string
  ifFiscal?: string
  rc?: string
  cnss?: string
  capitalSocial?: string
  siegeSocial?: string
  rib?: string
  banque?: string
}

export async function updateBrandKit(data: BrandKitData) {
  const { org } = await getCurrentOrg()

  if (!org) {
    throw new Error('Organisation non trouvée')
  }

  await db.brandKit.upsert({
    where: { organizationId: org.id },
    create: {
      organizationId: org.id,
      brandName: data.brandName,
      sector: data.sector,
      city: data.city,
      formeJuridique: data.formeJuridique,
      language: data.language,
      tone: data.tone || null,
      icpProfile: data.icpProfile || null,
      forbiddenWords: data.forbiddenWords || [],
      ice: data.ice || null,
      ifFiscal: data.ifFiscal || null,
      rc: data.rc || null,
      cnss: data.cnss || null,
      capitalSocial: data.capitalSocial || null,
      siegeSocial: data.siegeSocial || null,
      rib: data.rib || null,
      banque: data.banque || null,
    },
    update: {
      brandName: data.brandName,
      sector: data.sector,
      city: data.city,
      formeJuridique: data.formeJuridique,
      language: data.language,
      tone: data.tone || null,
      icpProfile: data.icpProfile || null,
      forbiddenWords: data.forbiddenWords || [],
      ice: data.ice || null,
      ifFiscal: data.ifFiscal || null,
      rc: data.rc || null,
      cnss: data.cnss || null,
      capitalSocial: data.capitalSocial || null,
      siegeSocial: data.siegeSocial || null,
      rib: data.rib || null,
      banque: data.banque || null,
    },
  })

  revalidatePath('/brand-kit')
}
