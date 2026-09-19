import { notFound } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { WORKFLOW_LABELS, WORKFLOW_DEFINITIONS } from "@/lib/types/workflow"
import { AgentSlug } from "@prisma/client"
import Link from "next/link"

// Labels des agents pour l'affichage
const AGENT_LABELS: Record<AgentSlug, { name: string; role: string; color: string }> = {
  NOUR:    { name: "Nour",    role: "Veille & Recherche",       color: "bg-pink-500/10 text-pink-400 border-pink-500/20" },
  YOUSSEF: { name: "Youssef", role: "Prospection B2B",          color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  MEHDI:   { name: "Mehdi",   role: "Réunions & BANT",          color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" },
  KARIM:   { name: "Karim",   role: "Proposition Commerciale",  color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  SAMIA:   { name: "Samia",   role: "Email & Relances",         color: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
  KARIMA:  { name: "Karima",  role: "Facturation",              color: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
  TARIQ:   { name: "Tariq",   role: "Stratégie",                color: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
  IMANE:   { name: "Imane",   role: "Créatif & Pub",            color: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20" },
  SALMA:   { name: "Salma",   role: "Contenu Réseaux",          color: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
  YASMINE: { name: "Yasmine", role: "E-commerce",               color: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
  FATIMA:  { name: "Fatima",  role: "Support Client",           color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
  NADIA:   { name: "Nadia",   role: "Ressources Humaines",      color: "bg-teal-500/10 text-teal-400 border-teal-500/20" },
  AMINE:   { name: "Amine",   role: "Finance & Analyse",        color: "bg-green-500/10 text-green-400 border-green-500/20" },
  KAMAL:   { name: "Kamal",   role: "Analytics & KPIs",         color: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
  REDA:    { name: "Reda",    role: "Decks & Rapports",         color: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
}

export default async function WorkflowDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const { orgId } = await auth()
  if (!orgId) notFound()

  const org = await db.organization.findUnique({
    where: { clerkOrgId: orgId },
  })
  if (!org) notFound()

  const workflow = await db.workflow.findFirst({
    where: { id: params.id, organizationId: org.id },
    include: { steps: { orderBy: { order: "asc" } } },
  })
  if (!workflow) notFound()

  const label = WORKFLOW_LABELS[workflow.slug]
  const completedSteps = workflow.steps.filter((s) => s.status === "COMPLETED").length
  const totalSteps = workflow.steps.length
  const progress = Math.round((completedSteps / totalSteps) * 100)
  const activeStep = workflow.steps.find((s) => s.status === "IN_PROGRESS")

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">

      {/* Header */}
      <div className="space-y-1">
        <Link
          href="/workflows"
          className="text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          ← Workflows
        </Link>
        <h1 className="text-2xl font-bold text-white font-bricolage">
          {label.name}
        </h1>
        <p className="text-sm text-white/40">{label.description}</p>
      </div>

      {/* Barre de progression */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-white/40">
          <span>{completedSteps} / {totalSteps} étapes complétées</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full">
          <div
            className="h-full bg-[#7C5CFC] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stepper */}
      <div className="space-y-3">
        {workflow.steps.map((step, index) => {
          const agent = AGENT_LABELS[step.agentSlug]
          const isActive = step.status === "IN_PROGRESS"
          const isDone = step.status === "COMPLETED"
          const isPending = step.status === "PENDING"

          return (
            <div
              key={step.id}
              className={`relative flex items-start gap-4 p-5 rounded-xl border transition-all ${
                isActive
                  ? "bg-[#7C5CFC]/5 border-[#7C5CFC]/30"
                  : isDone
                  ? "bg-[#1C1F2E] border-white/5 opacity-70"
                  : "bg-[#1C1F2E] border-white/5 opacity-40"
              }`}
            >
              {/* Numéro / Statut */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${
                  isDone
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : isActive
                    ? "bg-[#7C5CFC]/20 border-[#7C5CFC]/50 text-[#7C5CFC]"
                    : "bg-white/5 border-white/10 text-white/30"
                }`}
              >
                {isDone ? "✓" : index + 1}
              </div>

              {/* Contenu */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold">{agent.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${agent.color}`}>
                    {agent.role}
                  </span>
                  {isActive && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#7C5CFC]/10 text-[#7C5CFC] border border-[#7C5CFC]/20">
                      En cours
                    </span>
                  )}
                </div>

                {/* Output si complété */}
                {isDone && step.output && (
                  <p className="text-xs text-white/30 mt-1">
                    ✓ Complété — output enregistré
                  </p>
                )}

                {/* Bouton accéder au studio */}
                {isActive && (
                  <Link
                    href={`/agents/${step.agentSlug.toLowerCase()}`}
                    className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-lg bg-[#7C5CFC] hover:bg-[#6B4FDB] text-white text-sm font-medium transition-colors"
                  >
                    Ouvrir le studio {agent.name} →
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}