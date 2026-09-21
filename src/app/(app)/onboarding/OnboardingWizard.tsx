'use client'

import { useState, useTransition } from 'react'
import { saveOnboarding, type OnboardingData } from './actions'

// ── Types ────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4 | 5
type ChangeHandler = (k: keyof OnboardingData, v: string | boolean) => void

// ── Constantes ───────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: 'Entreprise' },
  { id: 2, label: 'Légal' },
  { id: 3, label: 'Banque' },
  { id: 4, label: 'Marque' },
  { id: 5, label: 'Confirmation' },
] as const

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

// ── Composants utilitaires ───────────────────────────────────────────────────

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}

function Input({
  value,
  onChange,
  placeholder,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> & {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <input
      {...props}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
      className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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

// ── Étapes ───────────────────────────────────────────────────────────────────

function Step1({ data, onChange }: { data: OnboardingData; onChange: ChangeHandler }) {
  return (
    <div className="flex flex-col gap-5">
      <Field label="Nom de l'entreprise" required>
        <Input value={data.brandName} onChange={(v) => onChange('brandName', v)} placeholder="Cabinet Al Farouk" />
      </Field>
      <Field label="Secteur d'activité" required>
        <Select
          value={data.sector}
          onChange={(v) => onChange('sector', v)}
          options={SECTEURS}
          placeholder="Choisir un secteur…"
        />
      </Field>
      <Field label="Ville" required>
        <Input value={data.city} onChange={(v) => onChange('city', v)} placeholder="Casablanca" />
      </Field>
      <Field label="Forme juridique" required>
        <Select
          value={data.formeJuridique}
          onChange={(v) => onChange('formeJuridique', v)}
          options={FORMES_JURIDIQUES}
          placeholder="Choisir…"
        />
      </Field>
    </div>
  )
}

function Step2({ data, onChange }: { data: OnboardingData; onChange: ChangeHandler }) {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-muted-foreground">Ces informations sont optionnelles — tu pourras les compléter depuis Brand Kit.</p>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="ICE">
          <Input value={data.ice ?? ''} onChange={(v) => onChange('ice', v)} placeholder="000000000000000" />
        </Field>
        <Field label="IF (Identifiant Fiscal)">
          <Input value={data.ifFiscal ?? ''} onChange={(v) => onChange('ifFiscal', v)} placeholder="12345678" />
        </Field>
        <Field label="RC (Registre de Commerce)">
          <Input value={data.rc ?? ''} onChange={(v) => onChange('rc', v)} placeholder="123456" />
        </Field>
        <Field label="CNSS">
          <Input value={data.cnss ?? ''} onChange={(v) => onChange('cnss', v)} placeholder="1234567" />
        </Field>
        <Field label="Capital social">
          <Input value={data.capitalSocial ?? ''} onChange={(v) => onChange('capitalSocial', v)} placeholder="100 000 MAD" />
        </Field>
        <Field label="Siège social">
          <Input value={data.siegeSocial ?? ''} onChange={(v) => onChange('siegeSocial', v)} placeholder="123 Bd Mohammed V, Casablanca" />
        </Field>
      </div>
    </div>
  )
}

function Step3({ data, onChange }: { data: OnboardingData; onChange: ChangeHandler }) {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-muted-foreground">Ces informations sont optionnelles — tu pourras les compléter depuis Brand Kit.</p>
      <Field label="RIB">
        <Input value={data.rib ?? ''} onChange={(v) => onChange('rib', v)} placeholder="007 780 0000000000000000 00" />
      </Field>
      <Field label="Banque">
        <Select
          value={data.banque ?? ''}
          onChange={(v) => onChange('banque', v)}
          options={['Attijariwafa Bank', 'CIH Bank', 'Banque Populaire', 'BMCE / Bank of Africa', 'BMCI', 'Société Générale Maroc', 'Crédit du Maroc', 'Barid Bank', 'Al Barid Bank', 'Autre']}
          placeholder="Choisir une banque…"
        />
      </Field>
    </div>
  )
}

function Step4({ data, onChange }: { data: OnboardingData; onChange: ChangeHandler }) {
  const [wordInput, setWordInput] = useState('')

  function addWord() {
    const w = wordInput.trim()
    if (!w) return
    const current = data.forbiddenWords ?? []
    if (!current.includes(w)) {
      onChange('forbiddenWords', [...current, w] as unknown as string)
    }
    setWordInput('')
  }

  function removeWord(w: string) {
    const current = data.forbiddenWords ?? []
    onChange('forbiddenWords', current.filter((x) => x !== w) as unknown as string)
  }

  return (
    <div className="flex flex-col gap-5">
      <Field label="Langue de travail principale" required>
        <Select
          value={data.language}
          onChange={(v) => onChange('language', v as 'FR' | 'AR' | 'MIX')}
          options={['FR', 'AR', 'MIX']}
        />
      </Field>
      <Field label="Ton de communication">
        <Select
          value={data.tone ?? ''}
          onChange={(v) => onChange('tone', v)}
          options={['Professionnel', 'Chaleureux', 'Expert', 'Dynamique', 'Institutionnel']}
          placeholder="Choisir un ton…"
        />
      </Field>
      <Field label="Profil client cible (ICP)">
        <Input
          value={data.icpProfile ?? ''}
          onChange={(v) => onChange('icpProfile', v)}
          placeholder="TPE marocaine, CA < 5M MAD, secteur BTP…"
        />
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
                <button type="button" onClick={() => removeWord(w)} className="text-muted-foreground hover:text-foreground">
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </Field>
    </div>
  )
}

function Step5({ data, onChange }: { data: OnboardingData; onChange: ChangeHandler }) {
  const rows: { label: string; value: string | undefined }[] = [
    { label: 'Entreprise', value: data.brandName },
    { label: 'Secteur', value: data.sector },
    { label: 'Ville', value: data.city },
    { label: 'Forme juridique', value: data.formeJuridique },
    { label: 'ICE', value: data.ice },
    { label: 'IF', value: data.ifFiscal },
    { label: 'RC', value: data.rc },
    { label: 'CNSS', value: data.cnss },
    { label: 'Capital social', value: data.capitalSocial },
    { label: 'Siège social', value: data.siegeSocial },
    { label: 'RIB', value: data.rib },
    { label: 'Banque', value: data.banque },
    { label: 'Langue', value: data.language },
    { label: 'Ton', value: data.tone },
    { label: 'ICP', value: data.icpProfile },
  ].filter((r) => r.value)

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">Vérifie tes informations avant de lancer MUAKIL.</p>
      <div className="rounded-lg border border-border divide-y divide-border">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between px-4 py-2.5 text-sm">
            <span className="text-muted-foreground">{r.label}</span>
            <span className="font-medium text-right max-w-[60%]">{r.value}</span>
          </div>
        ))}
        {(data.forbiddenWords ?? []).length > 0 && (
          <div className="flex justify-between px-4 py-2.5 text-sm">
            <span className="text-muted-foreground">Mots interdits</span>
            <span className="font-medium">{(data.forbiddenWords ?? []).join(', ')}</span>
          </div>
        )}
      </div>
      <label className="flex items-start gap-3 cursor-pointer mt-2">
        <input
          type="checkbox"
          checked={!!data.cguAccepted}
          onChange={e => onChange('cguAccepted', e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-border accent-primary cursor-pointer"
        />
        <span className="text-sm text-muted-foreground leading-relaxed">
          J&apos;ai lu et j&apos;accepte les{' '}
          <a href="/cgu" target="_blank" className="text-primary underline underline-offset-2 hover:text-primary/80">
            Conditions Générales d&apos;Utilisation
          </a>{' '}
          de MUAKIL. Je confirme que les informations renseignées sont exactes.
        </span>
      </label>
    </div>
  )
}

// ── Wizard principal ──────────────────────────────────────────────────────────

const INITIAL: OnboardingData = {
  brandName: '',
  sector: '',
  city: '',
  formeJuridique: '',
  language: 'FR',
  cguAccepted: false,
}

export default function OnboardingWizard() {
  const [step, setStep] = useState<Step>(1)
  const [data, setData] = useState<OnboardingData>(INITIAL)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

    function handleChange(key: keyof OnboardingData, value: string | boolean) {
    setData((prev) => ({ ...prev, [key]: value }))
  }

  function canNext(): boolean {
    if (step === 1) {
      return !!data.brandName.trim() && !!data.sector && !!data.city.trim() && !!data.formeJuridique
    }
    return true
  }

  function next() {
    if (!canNext()) return
    setStep((s) => Math.min(s + 1, 5) as Step)
  }

  function prev() {
    setStep((s) => Math.max(s - 1, 1) as Step)
  }

  function submit() {
     if (!data.cguAccepted) return
    setError(null)
    startTransition(async () => {
      try {
        await saveOnboarding(data)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Une erreur est survenue')
      }
    })
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Bienvenue sur MUAKIL</h1>
          <p className="mt-1 text-sm text-muted-foreground">Ton équipe IA, taillée pour le Maroc 🇲🇦</p>
        </div>

        {/* Stepper */}
        <div className="mb-8 flex items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                    s.id < step
                      ? 'bg-primary text-primary-foreground'
                      : s.id === step
                        ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {s.id < step ? '✓' : s.id}
                </div>
                <span className={`text-[10px] ${s.id === step ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`mx-1 mb-4 h-px w-8 sm:w-12 transition-colors ${s.id < step ? 'bg-primary' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-6 text-base font-semibold">
            {step === 1 && 'Ton entreprise'}
            {step === 2 && 'Identifiants légaux'}
            {step === 3 && 'Banque & finance'}
            {step === 4 && 'Identité de marque'}
            {step === 5 && 'Confirmation'}
          </h2>

          {step === 1 && <Step1 data={data} onChange={handleChange} />}
          {step === 2 && <Step2 data={data} onChange={handleChange} />}
          {step === 3 && <Step3 data={data} onChange={handleChange} />}
          {step === 4 && <Step4 data={data} onChange={handleChange} />}
          {step === 5 && <Step5 data={data} onChange={handleChange} />}

          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={prev}
              disabled={step === 1}
              className="h-10 rounded-md border border-border px-4 text-sm font-medium hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Retour
            </button>

            {step < 5 ? (
              <button
                type="button"
                onClick={next}
                disabled={!canNext()}
                className="h-10 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continuer
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={isPending || !data.cguAccepted}
                className="h-10 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {isPending ? 'Enregistrement…' : 'Lancer MUAKIL 🚀'}
              </button>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4 text-center text-xs text-muted-foreground">
          Étape {step} sur 5
        </div>
      </div>
    </div>
  )
}
