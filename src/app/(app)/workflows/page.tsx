import { getWorkflows } from "./actions"
import { createWorkflow } from "./actions"
import { WORKFLOW_LABELS } from "@/lib/types/workflow"
import { WorkflowSlug } from "@prisma/client"
import Link from "next/link"

export default async function WorkflowsPage() {
  const workflows = await getWorkflows()

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-bricolage">
            Workflows
          </h1>
          <p className="text-sm text-white/50 mt-1">
            Processus métier guidés — vos agents travaillent en séquence
          </p>
        </div>
      </div>

      {/* Lancer un nouveau workflow */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest">
          Nouveau workflow
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(Object.keys(WORKFLOW_LABELS) as WorkflowSlug[]).map((slug) => (
            <NewWorkflowCard key={slug} slug={slug} />
          ))}
        </div>
      </div>

      {/* Workflows en cours */}
      {workflows.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest">
            En cours
          </h2>
          <div className="space-y-3">
            {workflows.map((wf) => {
              const completedSteps = wf.steps.filter(
                (s) => s.status === "COMPLETED"
              ).length
              const totalSteps = wf.steps.length
              const progress = Math.round((completedSteps / totalSteps) * 100)
              const label = WORKFLOW_LABELS[wf.slug]

              return (
                <Link
                  key={wf.id}
                  href={`/workflows/${wf.id}`}
                  className="flex items-center justify-between p-4 rounded-xl bg-[#1C1F2E] border border-white/5 hover:border-[#7C5CFC]/40 transition-all group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium group-hover:text-[#7C5CFC] transition-colors">
                        {wf.name}
                      </span>
                      {wf.status === "COMPLETED" && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                          Terminé
                        </span>
                      )}
                      {wf.status === "PAUSED" && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">
                          En pause
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/40">{label.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-white/40">
                        {completedSteps}/{totalSteps} étapes
                      </p>
                      <div className="w-32 h-1.5 bg-white/10 rounded-full mt-1">
                        <div
                          className="h-full bg-[#7C5CFC] rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-white/20 group-hover:text-[#7C5CFC] transition-colors">
                      →
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* État vide */}
      {workflows.length === 0 && (
        <div className="text-center py-20 text-white/30">
          <p className="text-lg">Aucun workflow lancé pour le moment</p>
          <p className="text-sm mt-1">
            Choisissez un processus ci-dessus pour démarrer
          </p>
        </div>
      )}
    </div>
  )
}

// Carte pour lancer un nouveau workflow
function NewWorkflowCard({ slug }: { slug: WorkflowSlug }) {
  const label = WORKFLOW_LABELS[slug]

  const icons: Record<WorkflowSlug, string> = {
    PROSPECT_TO_CASH: "💰",
    IDEA_TO_MARKETING: "🎯",
    SUPPORT_CLIENT: "🤝",
  }

  const colors: Record<WorkflowSlug, string> = {
    PROSPECT_TO_CASH: "hover:border-emerald-500/40",
    IDEA_TO_MARKETING: "hover:border-violet-500/40",
    SUPPORT_CLIENT: "hover:border-sky-500/40",
  }

  async function handleCreate() {
    "use server"
    await createWorkflow(slug)
  }

  return (
    <form action={handleCreate}>
      <button
        type="submit"
        className={`w-full text-left p-5 rounded-xl bg-[#1C1F2E] border border-white/5 ${colors[slug]} hover:bg-[#1C1F2E]/80 transition-all group`}
      >
        <div className="text-2xl mb-3">{icons[slug]}</div>
        <h3 className="text-white font-semibold group-hover:text-white transition-colors">
          {label.name}
        </h3>
        <p className="text-xs text-white/40 mt-1">{label.description}</p>
      </button>
    </form>
  )
}