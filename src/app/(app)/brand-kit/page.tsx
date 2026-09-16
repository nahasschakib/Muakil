import { requireOrg } from '@/lib/clerk'
import BrandKitForm from './BrandKitForm'

export default async function BrandKitPage() {
  const org = await requireOrg()

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Brand Kit</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ces informations sont utilisées par tous tes agents pour personnaliser leurs réponses.
        </p>
      </div>
      <BrandKitForm brandKit={org.brandKit ?? null} />
    </div>
  )
}
