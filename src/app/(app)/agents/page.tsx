import Link from 'next/link'
import { requireOrg } from '@/lib/clerk'
import { AGENTS, agentAccessible, type AgentPlan } from '@/lib/agents'
import { agentInPack } from '@/lib/agents/packs'

const PLAN_LABEL: Record<AgentPlan, string> = {
  STARTER: 'Starter',
  PRO: 'Pro',
  AGENCE: 'Agence',
}

const AGENT_GRADIENTS: Record<string, string> = {
  salma:   'from-violet-500 to-purple-600',
  karima:  'from-rose-500 to-pink-600',
  youssef: 'from-emerald-500 to-teal-600',
  mehdi:   'from-indigo-500 to-blue-600',
  karim:   'from-amber-500 to-orange-600',
  nour:    'from-pink-500 to-rose-600',
  yasmine: 'from-rose-400 to-pink-600',
  tariq:   'from-slate-500 to-gray-600',
  amine:   'from-green-500 to-emerald-600',
  reda:    'from-violet-500 to-indigo-600',
  nadia:   'from-teal-500 to-emerald-600',
  fatima:  'from-cyan-500 to-teal-600',
  imane:   'from-fuchsia-500 to-purple-600',
  kamal:   'from-orange-500 to-amber-600',
  samia:   'from-sky-500 to-cyan-600',
}

export default async function AgentsPage() {
  const org = await requireOrg()
  const orgPlan = org.plan as AgentPlan
  const sector = org.brandKit?.sector ?? null

  // Catégories mutuellement exclusives
  // 1. Accessible par plan ET dans le pack
  const actifs = AGENTS.filter(a =>
    agentAccessible(a.planMin, orgPlan) && agentInPack(a.slug, sector)
  )
  // 2. Plan insuffisant (peu importe pack)
  const horsPlan = AGENTS.filter(a => !agentAccessible(a.planMin, orgPlan))
  // 3. Plan OK mais hors pack secteur
  const horsPack = AGENTS.filter(a =>
    agentAccessible(a.planMin, orgPlan) && !agentInPack(a.slug, sector)
  )

  const proPending = horsPlan.filter(a => a.planMin === 'PRO')
  const agencePending = horsPlan.filter(a => a.planMin === 'AGENCE')

  return (
    <div className="min-h-screen bg-[#0F1117]">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-2">
              Ton équipe IA
            </p>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              {org.brandKit?.brandName ?? org.name}
            </h1>
            <p className="text-sm text-white/40 mt-1">
              {org.brandKit?.city ?? 'Maroc'} · {sector ?? 'Secteur non renseigné'}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold uppercase tracking-widest text-[#A78BFA]">
              Plan {PLAN_LABEL[orgPlan]}
            </span>
            <p className="text-xs text-white/30 mt-1">
              {actifs.length} agent{actifs.length > 1 ? 's' : ''} actif{actifs.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-px bg-white/5 rounded-2xl overflow-hidden">
          {[
            { num: actifs.length, label: 'Agents actifs' },
            { num: horsPlan.length + horsPack.length, label: 'À débloquer' },
            { num: 15, label: 'Agents au total' },
          ].map((s) => (
            <div key={s.label} className="bg-[#1C1F2E] px-6 py-5">
              <div className="text-2xl font-bold text-white">{s.num}</div>
              <div className="text-xs text-white/40 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Agents actifs */}
        <div className="space-y-4">
          <p className="text-xs font-semibold text-white/30 uppercase tracking-widest">
            {actifs.length === 1 ? 'Ton agent' : 'Tes agents'}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {actifs.map((agent) => {
              const gradient = AGENT_GRADIENTS[agent.slug] ?? 'from-slate-500 to-gray-600'
              return (
                <Link key={agent.slug} href={`/agents/${agent.slug}`} className="group block">
                  <div className="relative p-5 rounded-2xl bg-[#1C1F2E] border border-white/5 hover:border-[#7C5CFC]/40 hover:shadow-lg hover:shadow-[#7C5CFC]/5 transition-all h-full flex flex-col gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl flex-shrink-0`}>
                      {agent.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white text-sm group-hover:text-[#A78BFA] transition-colors">
                        {agent.prenom}
                      </div>
                      <div className="text-xs text-white/40 mt-0.5">{agent.role}</div>
                      <div className="text-xs text-white/25 mt-2 leading-relaxed line-clamp-2">
                        {agent.description}
                      </div>
                    </div>
                    <div className="text-xs text-white/20 group-hover:text-[#A78BFA] transition-colors font-medium">
                      Ouvrir →
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Agents hors pack secteur */}
        {horsPack.length > 0 && (
          <div className="space-y-4">
            <p className="text-xs font-semibold text-white/30 uppercase tracking-widest">
              Hors pack {sector ?? 'secteur'}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {horsPack.map((agent) => (
                <div key={agent.slug} className="relative p-5 rounded-2xl bg-[#1C1F2E]/40 border border-white/3 opacity-50 flex flex-col gap-3">
                  <span className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                    Hors pack
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl">
                    {agent.emoji}
                  </div>
                  <div>
                    <div className="font-semibold text-white/50 text-sm">{agent.prenom}</div>
                    <div className="text-xs text-white/25 mt-0.5">{agent.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Agents Pro verrouillés */}
        {proPending.length > 0 && (
          <div className="space-y-4">
            <p className="text-xs font-semibold text-white/30 uppercase tracking-widest">
              Plan Pro — à débloquer
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {proPending.map((agent) => (
                <div key={agent.slug} className="relative p-5 rounded-2xl bg-[#1C1F2E]/40 border border-white/3 opacity-50 flex flex-col gap-3">
                  <span className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Pro
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl">
                    {agent.emoji}
                  </div>
                  <div>
                    <div className="font-semibold text-white/50 text-sm">{agent.prenom}</div>
                    <div className="text-xs text-white/25 mt-0.5">{agent.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Agents Agence verrouillés */}
        {agencePending.length > 0 && (
          <div className="space-y-4">
            <p className="text-xs font-semibold text-white/30 uppercase tracking-widest">
              Plan Agence — à débloquer
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {agencePending.map((agent) => (
                <div key={agent.slug} className="relative p-5 rounded-2xl bg-[#1C1F2E]/40 border border-white/3 opacity-50 flex flex-col gap-3">
                  <span className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Agence
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl">
                    {agent.emoji}
                  </div>
                  <div>
                    <div className="font-semibold text-white/50 text-sm">{agent.prenom}</div>
                    <div className="text-xs text-white/25 mt-0.5">{agent.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upgrade banner */}
        {orgPlan !== 'AGENCE' && (
          <div className="flex items-center justify-between gap-4 p-6 rounded-2xl bg-[#1C1F2E] border border-dashed border-white/10">
            <div>
              <div className="text-sm font-semibold text-white">
                {orgPlan === 'STARTER'
                  ? '13 agents supplémentaires t\'attendent'
                  : '8 agents Agence à débloquer'}
              </div>
              <div className="text-xs text-white/40 mt-1">
                {orgPlan === 'STARTER'
                  ? 'À partir de 490 MAD HT/mois'
                  : 'Plan Agence à partir de 990 MAD HT/mois'}
              </div>
            </div>
            <Link href="/#tarifs" className="flex-shrink-0 px-4 py-2 rounded-xl bg-[#7C5CFC] hover:bg-[#6B4FDB] text-white text-sm font-semibold transition-colors">
              Voir les plans →
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}