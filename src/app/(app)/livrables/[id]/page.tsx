import { notFound } from 'next/navigation'
import Link from 'next/link'
import { requireOrg } from '@/lib/clerk'
import { db } from '@/lib/db'
import { getAgent } from '@/lib/agents'
import ReactMarkdown from 'react-markdown'
import CopyButton from './CopyButton'

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-MA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export default async function LivrablePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const org = await requireOrg()

  const livrable = await db.deliverable.findFirst({
    where: { id, organizationId: org.id },
  })

  if (!livrable) notFound()

  const agent = getAgent(livrable.agentSlug.toLowerCase())

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Retour */}
      <Link
        href="/livrables"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        ← Livrables
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          {agent && <span className="text-2xl">{agent.emoji}</span>}
          <h1 className="text-2xl font-bold tracking-tight">{livrable.title}</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {agent ? `${agent.prenom} — ${agent.role}` : livrable.agentSlug}
          {' · '}
          {formatDate(livrable.createdAt)}
        </p>
      </div>

      {/* Contenu */}
      <div className="rounded-xl border border-border bg-card p-6 prose prose-sm max-w-none">
        <ReactMarkdown
          components={{
            p: ({ children }) => <p className="mb-3 last:mb-0 text-sm leading-relaxed">{children}</p>,
            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            ul: ({ children }) => <ul className="mb-3 ml-4 list-disc space-y-1 text-sm">{children}</ul>,
            ol: ({ children }) => <ol className="mb-3 ml-4 list-decimal space-y-1 text-sm">{children}</ol>,
            li: ({ children }) => <li>{children}</li>,
            h1: ({ children }) => <h1 className="mb-3 text-lg font-bold">{children}</h1>,
            h2: ({ children }) => <h2 className="mb-2 text-base font-bold">{children}</h2>,
            h3: ({ children }) => <h3 className="mb-2 text-sm font-semibold">{children}</h3>,
            hr: () => <hr className="my-4 border-border" />,
            code: ({ children }) => <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{children}</code>,
          }}
        >
          {livrable.content}
        </ReactMarkdown>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <CopyButton content={livrable.content} />
        <Link
          href={`/agents/${livrable.agentSlug.toLowerCase()}`}
          className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
        >
          💬 Continuer avec {agent?.prenom ?? 'l\'agent'}
        </Link>
      </div>
    </div>
  )
}
