import { redirect } from 'next/navigation'
import { getCurrentOrg } from '@/lib/clerk'
import OnboardingWizard from './OnboardingWizard'

export default async function OnboardingPage() {
  const { org } = await getCurrentOrg()

  // Si l'org a déjà un BrandKit complet → pas besoin d'onboarding
  if (org?.brandKit?.brandName) {
    redirect('/agents')
  }

  return <OnboardingWizard />
}
