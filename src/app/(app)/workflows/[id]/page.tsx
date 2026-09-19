import { notFound } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { WORKFLOW_LABELS } from "@/lib/types/workflow"
import { AgentSlug } from "@prisma/client"
import Link from "next/link"

const AGENT_LABELS: Record<AgentSlug, { name: string; role: string; color: string; initial: string }> = {
  NOUR:    { name: "Nour",    role: "Veille & Recherche",      color: "from-pink-500 to-rose-600",       initial: "N" },
  YOUSSEF: { name: "Youssef", role: "Prospection B2B",         color: "from-emerald-500 to-teal-600",    initial: "Y" },
  MEHDI:   { name: "Mehdi",   role: "Réunions & BANT",         color: "from-indigo-500 to-blue-600",     initial: "M" },
  KARIM:   { name: "Karim",   role: "Proposition Commerciale", color: "from-amber-500 to-orange-600",    initial: "K" },
  SAMIA:   { name: "Samia",   role: "Email & Relances",        color: "from-sky-500 to-cyan-600",        initial: "S" },
  KARIMA:  { name: "Karima",  role: "Facturation",             color: "from-rose-500 to-pink-600",       initial: "K" },
  TARIQ:   { name: "Tariq",   role: "Stratégie",               color: "from-slate-500 to-gray-600",      initial: "T" },
  IMANE:   { name: "Imane",   role: "Créatif & Pub",           color: "from-fuchsia-500 to-purple-600",  initial: "I" },
  SALMA:   { name: "Salma",   role: "Contenu Réseaux",         color: "from-violet-500 to-purple-600",   initial: "S" },
  YASMINE: { name: "Yasmine", role: "E-commerce",              color: "from-rose-400 to-pink-600",       initial: "Y" },
  FATIMA:  { name: "Fatima",  role: "Support Client",          color: "from-cyan-500 to-teal-600",       initial: "F" },
  NADIA:   { name: "Nadia",   role: "Ressources Humaines",     color: "from-teal-500 to-emerald-600",    initial: "N" },
  AMINE:   { name: "Amine",   role: "Finance & Analyse",       color: "from-green-500 to-emerald-600",   initial: "A" },
  KAMAL:   { name: "Kamal",   role: "Analytics & KPIs",        color: "from-orange-500 to-amber-600",    initial: "K" },
  REDA:    { name: "Reda",    role: "Decks & Rapports",        color: "from-violet-500 to-indigo-600",   initial: "R" },
}

const WORKFLOW_ICONS: Record<string, string> = {
  PROSPECT_TO_CASH:   "💰",
  IDEA_TO_MARKETING:  "🎯",
  SUPPORT_CLIENT:     "🤝",
}

export default async function WorkflowDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { orgId } = await auth()
  if (!orgId) notFound()

  const org = await db.organization.findUnique({
    where: { clerkOrgId: orgId },
  })
  if (!org) notFound()

  const workflow = await db.workflow.findFirst({
    where: { id, organizationId: org.id },
    include: { steps: { orderBy: { order: "asc" } } },
  })
  if (!workflow) notFound()

  const label = WORKFLOW_LABELS[workflow.slug]
  const completedSteps = workflow.steps.filter((s) => s.status === "COMPLETED").length
  const totalSteps = workflow.steps.length
  const progress = Math.round((completedSteps / totalSteps) * 100)

  return (
    <div className="min-h-screen bg-[#0F1117]">
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">

        {/* Breadcrumb */}
        <Link
          href="/workflows"
          className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          ← Retour aux workflows
        </Link>

        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#1C1F2E] border border-white/5 flex items-center justify-center text-2xl flex-shrink-0">
            {WORKFLOW_ICONS[workflow.slug]}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              {label.name}
            </h1>
            <p className="text-sm text-white/40 mt-0.5">{label.description}</p>
          </div>
          {workflow.status === "COMPLETED" && (
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Terminé
            </span>
          )}
        </div>

        {/* Progression */}
        <div className="bg-[#1C1F2E] rounded-2xl border border-white/5 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/60 font-medium">Progression</span>
            <span className="text-sm font-bold text-white">{completedSteps}/{totalSteps} étapes</span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#7C5CFC] to-[#9B7FFF] rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-white/30">
            <span>{progress}% complété</span>
            <span>{totalSteps - completedSteps} étape{totalSteps - completedSteps > 1 ? "s" : ""} restante{totalSteps - completedSteps > 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* Stepper */}
        <div className="relative">
          {/* Ligne verticale connecteur */}
          <div className="absolute left-[23px] top-8 bottom-8 w-px bg-white/5" />

          <div className="space-y-3">
            {workflow.steps.map((step, index) => {
              const agent = AGENT_LABELS[step.agentSlug]
              const isActive = step.status === "IN_PROGRESS"
              const isDone = step.status === "COMPLETED"

              return (
                <div
                  key={step.id}
                  className={`relative flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 ${
                    isActive
                      ? "bg-[#1C1F2E] border-[#7C5CFC]/40 shadow-lg shadow-[#7C5CFC]/5"
                      : isDone
                      ? "bg-[#1C1F2E]/60 border-white/5"
                      : "bg-[#1C1F2E]/30 border-white/3"
                  }`}
                >
                  {/* Avatar agent */}
                  <div className={`relative flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white ${
                    isDone
                      ? "bg-emerald-500/20 ring-2 ring-emerald-500/30"
                      : isActive
                      ? `bg-gradient-to-br ${agent.color} ring-2 ring-white/10`
                      : "bg-white/5"
                  }`}>
                    {isDone ? (
                      <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className={isActive ? "text-white" : "text-white/20"}>
                        {agent.initial}
                      </span>
                    )}
                  </div>

                  {/* Contenu */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-semibold text-sm ${isDone ? "text-white/50" : isActive ? "text-white" : "text-white/25"}`}>
                        {agent.name}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${
                        isDone
                          ? "bg-white/5 text-white/25 border-white/5"
                          : isActive
                          ? "bg-[#7C5CFC]/10 text-[#A78BFA] border-[#7C5CFC]/20"
                          : "bg-white/3 text-white/15 border-white/5"
                      }`}>
                        {agent.role}
                      </span>
                      {isActive && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse">
                          ● En cours
                        </span>
                      )}
                    </div>

                    {/* Output complété */}
                    {isDone && (
                      <p className="text-xs text-emerald-500/60 mt-1.5 flex items-center gap-1">
                        <span>✓</span> Output enregistré
                      </p>
                    )}

                    {/* Numéro étape pending */}
                    {!isDone && !isActive && (
                      <p className="text-xs text-white/15 mt-1">Étape {index + 1}</p>
                    )}

                    {/* Bouton studio */}
                    {isActive && (
                      <Link
                        href={`/agents/${step.agentSlug.toLowerCase()}?workflowId=${workflow.id}&stepId=${step.id}`}
                        className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-xl bg-[#7C5CFC] hover:bg-[#6B4FDB] active:scale-95 text-white text-sm font-semibold transition-all"
                      >
                        Ouvrir le studio {agent.name}
                        <span className="text-white/70">→</span>
                      </Link>
                    )}
                  </div>

                  {/* Indicateur position */}
                  {!isDone && (
                    <span className="flex-shrink-0 text-xs text-white/15 font-mono mt-1">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}