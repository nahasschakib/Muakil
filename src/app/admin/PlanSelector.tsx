'use client'

import { useState, useTransition } from 'react'
import { Plan } from '@prisma/client'
import { updateOrgPlan } from './actions'

const PLANS: Plan[] = ['STARTER', 'PRO', 'AGENCE']

const PLAN_COLORS: Record<Plan, string> = {
  STARTER: 'text-white/50',
  PRO:     'text-blue-400',
  AGENCE:  'text-amber-400',
}

export default function PlanSelector({ orgId, currentPlan }: { orgId: string; currentPlan: Plan }) {
  const [plan, setPlan] = useState<Plan>(currentPlan)
  const [isPending, startTransition] = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newPlan = e.target.value as Plan
    setPlan(newPlan)
    startTransition(async () => {
      await updateOrgPlan(orgId, newPlan)
    })
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={plan}
        onChange={handleChange}
        disabled={isPending}
        className={`bg-[#1C1F2E] border border-white/10 rounded-lg px-3 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-violet-500/50 disabled:opacity-40 ${PLAN_COLORS[plan]}`}
      >
        {PLANS.map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
      {isPending && <span className="text-xs text-white/30 animate-pulse">Mise à jour…</span>}
    </div>
  )
}