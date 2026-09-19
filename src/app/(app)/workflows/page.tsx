import { getWorkflows } from "./actions"
import { createWorkflow } from "./actions"
import { WORKFLOW_LABELS } from "@/lib/types/workflow"
import { WorkflowSlug } from "@prisma/client"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function WorkflowsPage() {
  const workflows = await getWorkflows()
  const active = workflows.filter((w) => w.status !== "COMPLETED")
  const completed = workflows.filter((w) => w.status === "COMPLETED")

  return (
    <div className="min-h-screen bg-[#0F1117]">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-12">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Workflows
          </h1>
          <p className="text-sm text-white/40 mt-1">
            Vos processus métier guidés — les agents travaillent en séquence
          </p>
        </div>

        {/* Nouveau workflow */}
        <div className="space-y-4">
          <p className="text-xs font-semibold text-white/30 uppercase tracking-widest">
            Lancer un nouveau processus
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(Object.keys(WORKFLOW_LABELS) as WorkflowSlug[]).map((slug) => (
              <NewWorkflowCard key={slug} slug={slug} />
            ))}
          </div>
        </div>

        {/* Workflows actifs */}
        {active.length > 0 && (
          <div className="space-y-4">
            <p className="text-xs font-semibold text-white/30 uppercase tracking-widest">
              En cours
            </p>
            <div className="space-y-3">
              {active.map((wf) => {
                const completedSteps = wf.steps.filter((s) => s.status === "COMPLETED").length
                const totalSteps = wf.steps.length
                const progress = Math.round((completedSteps / totalSteps) * 100)
                const label = WORKFLOW_LABELS[wf.slug]
                const activeStep = wf.steps.find((s) => s.status === "IN_PROGRESS")
                const icons: Record<WorkflowSlug, string> = {
                  PROSPECT_TO_CASH: "💰",
                  IDEA_TO_MARKETING: "🎯",
                  SUPPORT_CLIENT: "🤝",
                }

                return (
                  <Link
                    key={wf.id}
                    href={`/workflows/${wf.id}`}
                    className="flex items-center gap-5 p-5 rounded-2xl bg-[#1C1F2E] border border-white/5 hover:border-[#7C5CFC]/40 hover:bg-[#1C1F2E] transition-all group"
                  >
                    {/* Icône */}
                    <div className="w-11 h-11 rounded-xl bg-[#0F1117] border border-white/5 flex items-center justify-center text-xl flex-shrink-0">
                      {icons[wf.slug]}
                    </div>

                    {/* Infos */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold text-sm group-hover:text-[#A78BFA] transition-colors">
                          {wf.name}
                        </span>
                        {wf.status === "PAUSED" && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            En pause
                          </span>
                        )}
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#7C5CFC] to-[#9B7FFF] rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/30">
                          {completedSteps}/{totalSteps} étapes
                        </span>
                        {activeStep && (
                          <span className="text-xs text-[#A78BFA]">
                            Étape en cours : {activeStep.agentSlug.charAt(0) + activeStep.agentSlug.slice(1).toLowerCase()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Flèche */}
                    <span className="text-white/20 group-hover:text-[#7C5CFC] transition-colors text-lg flex-shrink-0">
                      →
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Workflows terminés */}
        {completed.length > 0 && (
          <div className="space-y-4">
            <p className="text-xs font-semibold text-white/30 uppercase tracking-widest">
              Terminés
            </p>
            <div className="space-y-3">
              {completed.map((wf) => {
                const label = WORKFLOW_LABELS[wf.slug]
                const icons: Record<WorkflowSlug, string> = {
                  PROSPECT_TO_CASH: "💰",
                  IDEA_TO_MARKETING: "🎯",
                  SUPPORT_CLIENT: "🤝",
                }
                return (
                  <Link
                    key={wf.id}
                    href={`/workflows/${wf.id}`}
                    className="flex items-center gap-5 p-5 rounded-2xl bg-[#1C1F2E]/40 border border-white/3 hover:border-white/10 transition-all group opacity-60 hover:opacity-100"
                  >
                    <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl flex-shrink-0">
                      {icons[wf.slug]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white/60 font-semibold text-sm">{wf.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          ✓ Terminé
                        </span>
                      </div>
                      <p className="text-xs text-white/25 mt-0.5">{label.description}</p>
                    </div>
                    <span className="text-white/20 group-hover:text-white/40 transition-colors text-lg flex-shrink-0">→</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* État vide */}
        {workflows.length === 0 && (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-[#1C1F2E] border border-white/5 flex items-center justify-center text-3xl mx-auto mb-4">
              ⚡
            </div>
            <p className="text-white/40 font-medium">Aucun workflow lancé</p>
            <p className="text-white/20 text-sm mt-1">Choisissez un processus ci-dessus pour démarrer</p>
          </div>
        )}

      </div>
    </div>
  )
}

const WORKFLOW_CONFIG: Record<WorkflowSlug, { icon: string; accent: string; glow: string; steps: number }> = {
  PROSPECT_TO_CASH:  { icon: "💰", accent: "hover:border-emerald-500/40", glow: "group-hover:shadow-emerald-500/5", steps: 6 },
  IDEA_TO_MARKETING: { icon: "🎯", accent: "hover:border-violet-500/40",  glow: "group-hover:shadow-violet-500/5",  steps: 4 },
  SUPPORT_CLIENT:    { icon: "🤝", accent: "hover:border-sky-500/40",     glow: "group-hover:shadow-sky-500/5",     steps: 4 },
}

function NewWorkflowCard({ slug }: { slug: WorkflowSlug }) {
  const label = WORKFLOW_LABELS[slug]
  const config = WORKFLOW_CONFIG[slug]

  async function handleCreate() {
    "use server"
    const wf = await createWorkflow(slug)
    redirect(`/workflows/${wf.id}`)
  }

  return (
    <form action={handleCreate}>
      <button
        type="submit"
        className={`w-full text-left p-5 rounded-2xl bg-[#1C1F2E] border border-white/5 ${config.accent} hover:shadow-lg ${config.glow} transition-all group`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#0F1117] border border-white/5 flex items-center justify-center text-xl">
            {config.icon}
          </div>
          <span className="text-xs text-white/20 font-mono">{config.steps} étapes</span>
        </div>
        <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-white transition-colors">
          {label.name}
        </h3>
        <p className="text-xs text-white/35 leading-relaxed">{label.description}</p>
        <div className="mt-4 text-xs text-white/20 group-hover:text-[#A78BFA] transition-colors font-medium">
          Démarrer →
        </div>
      </button>
    </form>
  )
}