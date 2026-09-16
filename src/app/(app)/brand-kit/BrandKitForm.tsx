'use client'

import { useState, useTransition } from 'react'
import { updateBrandKit, type BrandKitData } from './actions'
import type { BrandKit } from '@prisma/client'

const SECTEURS = [
  'Comptabilité & Audit',
  'Commerce & Distribution',
  'BTP & Immobilier',
  'Transport & Logistique',
  'Restauration & Hôtellerie',
  'Santé & Pharmacie',
  'IT & Digital',
  'Éducation & Formation',
  'Industrie & Manufacturing',
  'Services aux entreprises',
  'Autre',
]

const FORMES_JURIDIQUES = ['SARL', 'SA', 'SNC', 'Auto-entrepreneur', 'Association', 'Autre']

const BANQUES = [
  'Attijariwafa Bank',
  'CIH Bank',
  'Banque Populaire',
  'BMCE / Bank of Africa',
  'BMCI',
  'Société Générale Maroc',
  'Crédit du Maroc',
  'Barid Bank',
  'Al Barid Bank',
  'Autre',
]

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
    </div>
  )
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    />
  )
}

function Select({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder?: string
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="mb-4 text-sm font-semibold text-foreground">{title}</h2>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  )
}

export default function BrandKitForm({ brandKit }: { brandKit: BrandKit | null }) {
  const [data, setData] = useState<BrandKitData>({
    brandName: brandKit?.brandName ?? '',
    sector: brandKit?.sector ?? '',
    city: brandKit?.city ?? '',
    formeJuridique: brandKit?.formeJuridique ?? '',
    language: (brandKit?.language as 'FR' | 'AR' | 'MIX') ?? 'FR',
    tone: brandKit?.tone ?? '',
    icpProfile: brandKit?.icpProfile ?? '',
    forbiddenWords: brandKit?.forbiddenWords ?? [],
    ice: brandKit?.ice ?? '',
    ifFiscal: brandKit?.ifFiscal ?? '',
    rc: brandKit?.rc ?? '',
    cnss: brandKit?.cnss ?? '',
    capitalSocial: brandKit?.capitalSocial ?? '',
    siegeSocial: brandKit?.siegeSocial ?? '',
    rib: brandKit?.rib ?? '',
    banque: brandKit?.banque ?? '',
  })

  const [wordInput, setWordInput] = useState('')
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set(key: keyof BrandKitData, value: string) {
    setData((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  function addWord() {
    const w = wordInput.trim()
    if (!w) return
    const current = data.forbiddenWords ?? []
    if (!current.includes(w)) {
      setData((prev) => ({ ...prev, forbiddenWords: [...current, w] }))
    }
    setWordInput('')
  }

  function removeWord(w: string) {
    setData((prev) => ({
      ...prev,
      forbiddenWords: (prev.forbiddenWords ?? []).filter((x) => x !== w),
    }))
  }

  function handleSubmit() {
    setError(null)
    startTransition(async () => {
      try {
        await updateBrandKit(data)
        setSaved(true)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Une erreur est survenue')
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Entreprise */}
      <Section title="🏢 Entreprise">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Nom de l'entreprise">
            <Input value={data.brandName} onChange={(v) => set('brandName', v)} placeholder="Cabinet Al Farouk" />
          </Field>
          <Field label="Secteur d'activité">
            <Select value={data.sector} onChange={(v) => set('sector', v)} options={SECTEURS} placeholder="Choisir…" />
          </Field>
          <Field label="Ville">
            <Input value={data.city} onChange={(v) => set('city', v)} placeholder="Casablanca" />
          </Field>
          <Field label="Forme juridique">
            <Select value={data.formeJuridique} onChange={(v) => set('formeJuridique', v)} options={FORMES_JURIDIQUES} placeholder="Choisir…" />
          </Field>
        </div>
      </Section>

      {/* Identifiants légaux */}
      <Section title="📋 Identifiants légaux">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="ICE">
            <Input value={data.ice ?? ''} onChange={(v) => set('ice', v)} placeholder="000000000000000" />
          </Field>
          <Field label="IF (Identifiant Fiscal)">
            <Input value={data.ifFiscal ?? ''} onChange={(v) => set('ifFiscal', v)} placeholder="12345678" />
          </Field>
          <Field label="RC">
            <Input value={data.rc ?? ''} onChange={(v) => set('rc', v)} placeholder="123456" />
          </Field>
          <Field label="CNSS">
            <Input value={data.cnss ?? ''} onChange={(v) => set('cnss', v)} placeholder="1234567" />
          </Field>
          <Field label="Capital social">
            <Input value={data.capitalSocial ?? ''} onChange={(v) => set('capitalSocial', v)} placeholder="100 000 MAD" />
          </Field>
          <Field label="Siège social">
            <Input value={data.siegeSocial ?? ''} onChange={(v) => set('siegeSocial', v)} placeholder="125, Bd Mohammed V" />
          </Field>
        </div>
      </Section>

      {/* Banque */}
      <Section title="🏦 Banque & finance">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="RIB">
            <Input value={data.rib ?? ''} onChange={(v) => set('rib', v)} placeholder="007 780 0000000000000000 00" />
          </Field>
          <Field label="Banque">
            <Select value={data.banque ?? ''} onChange={(v) => set('banque', v)} options={BANQUES} placeholder="Choisir…" />
          </Field>
        </div>
      </Section>

      {/* Identité de marque */}
      <Section title="🎨 Identité de marque">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Langue de travail">
            <Select value={data.language} onChange={(v) => set('language', v as 'FR' | 'AR' | 'MIX')} options={['FR', 'AR', 'MIX']} />
          </Field>
          <Field label="Ton de communication">
            <Select
              value={data.tone ?? ''}
              onChange={(v) => set('tone', v)}
              options={['Professionnel', 'Chaleureux', 'Expert', 'Dynamique', 'Institutionnel']}
              placeholder="Choisir…"
            />
          </Field>
        </div>
        <Field label="Profil client cible (ICP)">
          <Input value={data.icpProfile ?? ''} onChange={(v) => set('icpProfile', v)} placeholder="TPE marocaine, CA < 5M MAD, secteur BTP…" />
        </Field>
        <Field label="Mots interdits">
          <div className="flex gap-2">
            <input
              value={wordInput}
              onChange={(e) => setWordInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addWord())}
              placeholder="Ajouter un mot…"
              className="h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button
              type="button"
              onClick={addWord}
              className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Ajouter
            </button>
          </div>
          {(data.forbiddenWords ?? []).length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {(data.forbiddenWords ?? []).map((w) => (
                <span key={w} className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs">
                  {w}
                  <button type="button" onClick={() => removeWord(w)} className="text-muted-foreground hover:text-foreground">×</button>
                </span>
              ))}
            </div>
          )}
        </Field>
      </Section>

      {/* Bouton save */}
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="h-10 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isPending ? 'Enregistrement…' : 'Enregistrer'}
        </button>
        {saved && <span className="text-sm text-emerald-600">✅ Brand Kit mis à jour</span>}
      </div>
    </div>
  )
}
