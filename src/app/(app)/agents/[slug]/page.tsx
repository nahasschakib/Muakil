import { notFound, redirect } from 'next/navigation'
import { requireOrg } from '@/lib/clerk'
import { getAgent, agentAccessible, type AgentPlan } from '@/lib/agents'
import AgentChat from './AgentChat'

export default async function AgentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const agent = getAgent(slug)

  if (!agent) notFound()

  const org = await requireOrg()
  const orgPlan = org.plan as AgentPlan

  if (!agentAccessible(agent.planMin, orgPlan)) {
    redirect('/agents')
  }

  return (
    <AgentChat
      agent={agent}
      orgId={org.id}
      brandKit={org.brandKit ?? null}
    />
  )
}
