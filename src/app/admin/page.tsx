import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { Plan } from '@prisma/client'
import PlanSelector from './PlanSelector'

const PLAN_BADGE: Record<Plan, string> = {
  STARTER: 'bg-white/10 text-white/50',
  PRO:     'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  AGENCE:  'bg-amber-500/10 text-amber-400 border border-amber-500/20',
}

export default async function AdminPage() {
  const { userId } = await auth()
  if (userId !== process.env.ADMIN_USER_ID) redirect('/')

  const orgs = await db.organization.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      brandKit: true,
      _count: { select: { deliverables: true, workflows: true } },
    },
  })

  // Stats globales
  const total = orgs.length
  const byPlan = {
    STARTER: orgs.filter(o => o.plan === 'STARTER').length,
    PRO:     orgs.filter(o => o.plan === 'PRO').length,
    AGENCE:  orgs.filter(o => o.plan === 'AGENCE').length,
  }
  const totalLivrables = orgs.reduce((sum, o) => sum + o._count.deliverables, 0)
  const totalWorkflows  = orgs.reduce((sum, o) => sum + o._count.workflows, 0)

  return (
    <div className="min-h-screen bg-[#0F1117] text-white">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-1">
              Administration
            </p>
            <h1 className="text-2xl font-bold">MUAKIL — Dashboard Admin</h1>
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full">
            🔒 Accès restreint
          </span>
        </div>

        {/* Stats globales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden">
          {[
            { num: total,          label: 'Organisations' },
            { num: totalLivrables, label: 'Livrables générés' },
            { num: totalWorkflows,  label: 'Workflows lancés' },
            { num: byPlan.AGENCE,  label: 'Clients Agence' },
          ].map(s => (
            <div key={s.label} className="bg-[#1C1F2E] px-6 py-5">
              <div className="text-2xl font-bold text-white">{s.num}</div>
              <div className="text-xs text-white/40 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Répartition plans */}
        <div className="grid grid-cols-3 gap-4">
          {(['STARTER', 'PRO', 'AGENCE'] as Plan[]).map(p => (
            <div key={p} className="bg-[#1C1F2E] rounded-xl p-4 border border-white/5">
              <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${PLAN_BADGE[p].split(' ')[1]}`}>
                {p}
              </div>
              <div className="text-3xl font-bold">{byPlan[p]}</div>
              <div className="text-xs text-white/30 mt-1">organisation{byPlan[p] > 1 ? 's' : ''}</div>
            </div>
          ))}
        </div>

        {/* Tableau orgs */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-white/30 uppercase tracking-widest">
            Toutes les organisations
          </p>
          <div className="bg-[#1C1F2E] rounded-2xl border border-white/5 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-white/30 uppercase tracking-wider">Organisation</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-white/30 uppercase tracking-wider">Secteur</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-white/30 uppercase tracking-wider">Ville</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-white/30 uppercase tracking-wider">Plan</th>
                  <th className="text-center px-6 py-4 text-xs font-semibold text-white/30 uppercase tracking-wider">Livrables</th>
                  <th className="text-center px-6 py-4 text-xs font-semibold text-white/30 uppercase tracking-wider">Workflows</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-white/30 uppercase tracking-wider">Inscrit le</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orgs.map(org => (
                  <tr key={org.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">
                        {org.brandKit?.brandName ?? org.name}
                      </div>
                      <div className="text-xs text-white/30 font-mono mt-0.5">{org.clerkOrgId}</div>
                    </td>
                    <td className="px-6 py-4 text-white/50 text-xs">{org.brandKit?.sector ?? '—'}</td>
                    <td className="px-6 py-4 text-white/50 text-xs">{org.brandKit?.city ?? '—'}</td>
                    <td className="px-6 py-4">
                      <PlanSelector orgId={org.id} currentPlan={org.plan} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-white/60 font-mono">{org._count.deliverables}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-white/60 font-mono">{org._count.workflows}</span>
                    </td>
                    <td className="px-6 py-4 text-white/30 text-xs">
                      {org.createdAt.toLocaleDateString('fr-MA', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orgs.length === 0 && (
              <div className="px-6 py-12 text-center text-white/20 text-sm">
                Aucune organisation enregistrée
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}