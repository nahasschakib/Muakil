import Link from 'next/link'
import { requireOrg } from '@/lib/clerk'
import { AGENTS, agentAccessible, type AgentPlan } from '@/lib/agents'

const PLAN_LABEL: Record<AgentPlan, string> = {
  STARTER: 'Starter',
  PRO: 'Pro',
  AGENCE: 'Agence',
}

const AGENT_COLORS: Record<string, string> = {
  salma:   'oklch(0.95 0.02 300)',
  karima:  'oklch(0.95 0.03 140)',
  youssef: 'oklch(0.94 0.03 250)',
  mehdi:   'oklch(0.95 0.04 60)',
  karim:   'oklch(0.96 0.04 80)',
  nour:    'oklch(0.95 0.03 340)',
  yasmine: 'oklch(0.95 0.04 10)',
  tariq:   'oklch(0.94 0.03 270)',
  amine:   'oklch(0.95 0.03 180)',
  reda:    'oklch(0.95 0.03 210)',
  nadia:   'oklch(0.94 0.03 290)',
  fatima:  'oklch(0.95 0.03 150)',
  imane:   'oklch(0.94 0.03 320)',
  kamal:   'oklch(0.95 0.03 230)',
  samia:   'oklch(0.96 0.04 120)',
}

export default async function AgentsPage() {
  const org = await requireOrg()
  const orgPlan = org.plan as AgentPlan

  const accessibles = AGENTS.filter(a => agentAccessible(a.planMin, orgPlan))
  const proPending = AGENTS.filter(a => a.planMin === 'PRO' && !agentAccessible(a.planMin, orgPlan))
  const agencePending = AGENTS.filter(a => a.planMin === 'AGENCE' && !agentAccessible(a.planMin, orgPlan))

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>

      {/* ── Hero ── */}
      <section style={{ padding: '48px 32px 40px', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden', maxWidth: '100vw' }}>

        {/* Forme décorative rouge */}

        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <p className="mu-label" style={{ marginBottom: 10 }}>Ton équipe IA</p>
              <h1 className="mu-title" style={{ margin: 0 }}>
                {org.brandKit?.brandName ?? org.name}
              </h1>
              <p style={{ marginTop: 8, fontSize: 14, color: 'var(--muted-foreground)' }}>
                {org.brandKit?.city ?? 'Maroc'} · {org.brandKit?.sector ?? 'Secteur non renseigné'}
              </p>
            </div>

            {/* Plan badge */}
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8,
            }}>
              <span className={`mu-plan-badge ${orgPlan.toLowerCase()}`}>
                Plan {PLAN_LABEL[orgPlan]}
              </span>
              <p style={{ fontSize: 12, color: 'var(--muted-foreground)', margin: 0 }}>
                {accessibles.length} agent{accessibles.length > 1 ? 's' : ''} actif{accessibles.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 1, marginTop: 36,
            background: 'var(--border)', borderRadius: 16, overflow: 'hidden',
          }}>
            {[
              { num: accessibles.length, label: 'Agents actifs' },
              { num: AGENTS.length - accessibles.length, label: 'À débloquer' },
              { num: 15, label: 'Agents au total' },
            ].map((s) => (
              <div key={s.label} style={{
                background: 'var(--card)', padding: '20px 24px',
              }}>
                <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--foreground)' }}>
                  {s.num}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 4 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Agents accessibles ── */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '40px 32px 0' }}>
        <p className="mu-label" style={{ marginBottom: 20 }}>
          {accessibles.length === 1 ? 'Ton agent' : 'Tes agents'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {accessibles.map((agent) => (
            <Link key={agent.slug} href={`/agents/${agent.slug}`} style={{ textDecoration: 'none' }}>
              <div className="mu-featured-card">
                {/* Accent couleur à gauche selon agent */}
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
                  background: agent.slug === 'karima'
                    ? 'oklch(0.45 0.14 140)'
                    : 'oklch(0.38 0.16 22)',
                  borderRadius: '4px 0 0 4px',
                }} />

                <div className="mu-agent-icon" style={{ background: AGENT_COLORS[agent.slug] ?? 'var(--muted)', flexShrink: 0 }}>
                  {agent.emoji}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--foreground)' }}>
                    {agent.prenom}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--muted-foreground)', marginTop: 2 }}>
                    {agent.role}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 6, lineHeight: 1.5 }}>
                    {agent.description}
                  </div>
                </div>

                <div style={{
                  flexShrink: 0, fontSize: 13, fontWeight: 500,
                  color: 'oklch(0.38 0.16 22)',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  Ouvrir →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Agents Pro ── */}
      {proPending.length > 0 && (
        <section style={{ maxWidth: 900, margin: '0 auto', padding: '40px 32px 0' }}>
          <p className="mu-label" style={{ marginBottom: 20 }}>Plan Pro — à débloquer</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
            {proPending.map((agent) => (
              <div key={agent.slug} className="mu-agent-card locked">
                <span style={{
                  position: 'absolute', top: 12, right: 12,
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
                  textTransform: 'uppercase', padding: '3px 8px', borderRadius: 999,
                  background: 'oklch(0.93 0.03 250)', color: 'oklch(0.35 0.15 250)',
                }}>Pro</span>
                <div className="mu-agent-icon" style={{ background: AGENT_COLORS[agent.slug] ?? 'var(--muted)', width: 40, height: 40, fontSize: 18, flexShrink: 0, marginBottom: 8 }}>
                  {agent.emoji}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)' }}>{agent.prenom}</div>
                <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginTop: 2 }}>{agent.role}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Agents Agence ── */}
      {agencePending.length > 0 && (
        <section style={{ maxWidth: 900, margin: '0 auto', padding: '40px 32px 0' }}>
          <p className="mu-label" style={{ marginBottom: 20 }}>Plan Agence — à débloquer</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
            {agencePending.map((agent) => (
              <div key={agent.slug} className="mu-agent-card locked">
                <span style={{
                  position: 'absolute', top: 12, right: 12,
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
                  textTransform: 'uppercase', padding: '3px 8px', borderRadius: 999,
                  background: 'oklch(0.93 0.04 22)', color: 'oklch(0.38 0.16 22)',
                }}>Agence</span>
                <div className="mu-agent-icon" style={{ background: AGENT_COLORS[agent.slug] ?? 'var(--muted)', width: 40, height: 40, fontSize: 18, flexShrink: 0, marginBottom: 8 }}>
                  {agent.emoji}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)' }}>{agent.prenom}</div>
                <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginTop: 2 }}>{agent.role}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Upgrade banner ── */}
      {orgPlan !== 'AGENCE' && (
        <section style={{ maxWidth: 900, margin: '40px auto 0', padding: '0 32px 48px' }}>
          <div style={{
            borderRadius: 20, border: '1px dashed var(--border)',
            background: 'var(--card)', padding: '24px 28px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 16, flexWrap: 'wrap',
          }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--foreground)' }}>
                {orgPlan === 'STARTER'
                  ? '13 agents supplémentaires t\'attendent'
                  : '8 agents Agence à débloquer'}
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted-foreground)', marginTop: 4 }}>
                {orgPlan === 'STARTER'
                  ? 'À partir de 290 MAD/mois — essai 14 jours gratuit'
                  : 'Plan Agence à partir de 1 990 MAD/mois'}
              </div>
            </div>
            <a href="#" className="mu-pill-cta" style={{ fontSize: 13 }}>
              Voir les plans →
            </a>
          </div>
        </section>
      )}

    </div>
  )
}
