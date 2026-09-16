import Link from 'next/link'
import { requireOrg } from '@/lib/clerk'
import { db } from '@/lib/db'
import { getAgent } from '@/lib/agents'
import type { AgentSlug } from '@prisma/client'

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-MA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export default async function LivrablesPage() {
  const org = await requireOrg()

  const livrables = await db.deliverable.findMany({
    where: { organizationId: org.id },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Livrables</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {livrables.length === 0
            ? 'Aucun livrable enregistré pour le moment'
            : `${livrables.length} livrable${livrables.length > 1 ? 's' : ''} enregistré${livrables.length > 1 ? 's' : ''}`}
        </p>
      </div>

      {livrables.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/40 p-12 text-center">
          <p className="text-sm font-medium">Aucun livrable pour le moment</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Dans le chat d'un agent, clique sur "Enregistrer" sous une réponse pour la sauvegarder ici.
          </p>
          <Link
            href="/agents"
            className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Aller aux agents
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {livrables.map((livrable) => {
            const agent = getAgent(livrable.agentSlug.toLowerCase() as string)
            return (
              <div
                key={livrable.id}
                className="rounded-xl border border-border bg-card p-5 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2 min-w-0">
                    {agent && (
                      <span className="text-lg shrink-0">{agent.emoji}</span>
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{livrable.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {agent ? `${agent.prenom} — ${agent.role}` : livrable.agentSlug}
                        {' · '}
                        {formatDate(livrable.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/livrables/${livrable.id}`}
                    className="shrink-0 rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
                  >
                    Voir
                  </Link>
                </div>

                {/* Aperçu */}
                <p className="mt-3 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {livrable.content.replace(/[#*`_]/g, '').slice(0, 200)}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
