import Link from 'next/link'
import { requireOrg } from '@/lib/clerk'
import { AGENTS, agentAccessible, type AgentPlan } from '@/lib/agents'

const COULEUR_MAP: Record<string, string> = {
  violet:  'bg-violet-100 text-violet-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  blue:    'bg-blue-100 text-blue-700',
  orange:  'bg-orange-100 text-orange-700',
  amber:   'bg-amber-100 text-amber-700',
  pink:    'bg-pink-100 text-pink-700',
  rose:    'bg-rose-100 text-rose-700',
  indigo:  'bg-indigo-100 text-indigo-700',
  teal:    'bg-teal-100 text-teal-700',
  cyan:    'bg-cyan-100 text-cyan-700',
  purple:  'bg-purple-100 text-purple-700',
  green:   'bg-green-100 text-green-700',
  fuchsia: 'bg-fuchsia-100 text-fuchsia-700',
  sky:     'bg-sky-100 text-sky-700',
  lime:    'bg-lime-100 text-lime-700',
}

const PLAN_LABEL: Record<AgentPlan, string> = {
  STARTER: 'Starter',
  PRO: 'Pro',
  AGENCE: 'Agence',
}

export default async function AgentsPage() {
  const org = await requireOrg()
  const orgPlan = org.plan as AgentPlan

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Tes agents IA</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {org.brandKit?.brandName ?? org.name} — Plan{' '}
          <span className="font-medium text-foreground">{PLAN_LABEL[orgPlan]}</span>
        </p>
      </div>

      {/* Grille */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {AGENTS.map((agent) => {
          const accessible = agentAccessible(agent.planMin, orgPlan)
          const couleurClass = COULEUR_MAP[agent.couleur] ?? 'bg-muted text-muted-foreground'

          return (
            <div
              key={agent.slug}
              className={`relative rounded-xl border bg-card p-5 transition-shadow ${
                accessible
                  ? 'hover:shadow-md cursor-pointer'
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              {accessible ? (
                <Link href={`/agents/${agent.slug}`} className="absolute inset-0 rounded-xl" />
              ) : null}

              {/* Badge plan requis */}
              {!accessible && (
                <span className="absolute top-3 right-3 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {PLAN_LABEL[agent.planMin]}
                </span>
              )}

              {/* Emoji */}
              <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg text-xl ${couleurClass}`}>
                {agent.emoji}
              </div>

              {/* Nom & rôle */}
              <h2 className="font-semibold text-sm">{agent.prenom}</h2>
              <p className="text-xs text-muted-foreground mb-2">{agent.role}</p>

              {/* Description */}
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {agent.description}
              </p>
            </div>
          )
        })}
      </div>

      {/* Upgrade banner si plan < AGENCE */}
      {orgPlan !== 'AGENCE' && (
        <div className="mt-10 rounded-xl border border-dashed border-border bg-muted/40 p-6 text-center">
          <p className="text-sm font-medium">
            {orgPlan === 'STARTER'
              ? '13 agents supplémentaires disponibles en plan Pro ou Agence'
              : '8 agents supplémentaires disponibles en plan Agence'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Passe à un plan supérieur pour débloquer toute ton équipe IA
          </p>
        </div>
      )}
    </div>
  )
}
