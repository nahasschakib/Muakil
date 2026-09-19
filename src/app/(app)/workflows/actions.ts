"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { Prisma, WorkflowSlug } from "@prisma/client"
import { WORKFLOW_DEFINITIONS, WORKFLOW_LABELS, WorkflowContext } from "@/lib/types/workflow"
import { revalidatePath } from "next/cache"


// Créer un nouveau workflow pour l'org active
export async function createWorkflow(slug: WorkflowSlug, context?: WorkflowContext) {
  const { orgId } = await auth()
  if (!orgId) throw new Error("Non authentifié")

  // Vérifier que l'org existe en base
  const org = await db.organization.findUnique({
    where: { clerkOrgId: orgId },
  })
  if (!org) throw new Error("Organisation introuvable")

  // Créer le workflow + ses étapes en une seule transaction
  const workflow = await db.workflow.create({
    data: {
      organizationId: org.id,
      slug,
      name: WORKFLOW_LABELS[slug].name,
      context: context ?? {},
      steps: {
        create: WORKFLOW_DEFINITIONS[slug].map((agentSlug, index) => ({
          agentSlug,
          order: index,
          status: index === 0 ? "IN_PROGRESS" : "PENDING",
        })),
      },
    },
    include: { steps: true },
  })

  revalidatePath("/workflows")
  return workflow
}

// Mettre à jour le contexte partagé d'un workflow
export async function updateWorkflowContext(
  workflowId: string,
  context: Partial<WorkflowContext>
) {
  const { orgId } = await auth()
  if (!orgId) throw new Error("Non authentifié")

  const org = await db.organization.findUnique({
    where: { clerkOrgId: orgId },
  })
  if (!org) throw new Error("Organisation introuvable")

  // Récupérer le contexte existant et merger
  const existing = await db.workflow.findFirst({
    where: { id: workflowId, organizationId: org.id },
    select: { context: true },
  })
  if (!existing) throw new Error("Workflow introuvable")

  const merged = { ...(existing.context as WorkflowContext), ...context }

  return db.workflow.update({
    where: { id: workflowId },
    data: { context: merged },
  })
}

// Compléter une étape et passer à la suivante
export async function completeWorkflowStep(
  workflowId: string,
  stepId: string,
  output: Prisma.InputJsonValue
) {
  const { orgId } = await auth()
  if (!orgId) throw new Error("Non authentifié")

  const org = await db.organization.findUnique({
    where: { clerkOrgId: orgId },
  })
  if (!org) throw new Error("Organisation introuvable")

  // Marquer l'étape courante comme complétée
  await db.workflowStep.update({
    where: { id: stepId },
    data: { status: "COMPLETED", output },
  })

  // Trouver et activer l'étape suivante
  const currentStep = await db.workflowStep.findUnique({
    where: { id: stepId },
    select: { order: true },
  })

  if (currentStep) {
    const nextStep = await db.workflowStep.findFirst({
      where: {
        workflowId,
        order: currentStep.order + 1,
        status: "PENDING",
      },
    })

    if (nextStep) {
      await db.workflowStep.update({
        where: { id: nextStep.id },
        data: { status: "IN_PROGRESS" },
      })
    } else {
      // Plus d'étapes — workflow terminé
      await db.workflow.update({
        where: { id: workflowId },
        data: { status: "COMPLETED" },
      })
    }
  }

  revalidatePath(`/workflows/${workflowId}`)
}

// Charger les workflows de l'org
export async function getWorkflows() {
  const { orgId } = await auth()
  if (!orgId) throw new Error("Non authentifié")

  const org = await db.organization.findUnique({
    where: { clerkOrgId: orgId },
  })
  if (!org) return []

  return db.workflow.findMany({
    where: { organizationId: org.id },
    include: { steps: { orderBy: { order: "asc" } } },
    orderBy: { createdAt: "desc" },
  })
}