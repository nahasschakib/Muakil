import { AgentSlug, WorkflowSlug, WorkflowStatus, StepStatus } from "@prisma/client"

// Contexte partagé entre toutes les étapes d'un workflow
export type WorkflowContext = {
  // Prospect (Nour)
  prospectName?: string
  prospectSector?: string
  prospectCity?: string
  prospectContact?: string
  prospectWebsite?: string

  // Qualification BANT (Mehdi)
  budget?: string
  authority?: string
  need?: string
  timeline?: string

  // Proposition (Karim)
  proposalOption?: string   // Essentiel | Pro | Premium
  proposalAmount?: number

  // Commun à tous les workflows
  companyName?: string      // depuis BrandKit
  sector?: string
  notes?: string
}

// Type complet d'un workflow avec ses étapes
export type WorkflowWithSteps = {
  id: string
  slug: WorkflowSlug
  name: string
  status: WorkflowStatus
  context: WorkflowContext
  steps: WorkflowStepType[]
  createdAt: Date
  updatedAt: Date
}

export type WorkflowStepType = {
  id: string
  agentSlug: AgentSlug
  order: number
  status: StepStatus
  input: WorkflowContext | null
  output: Record<string, unknown> | null
}

// Définition statique des étapes par workflow
export const WORKFLOW_DEFINITIONS: Record<WorkflowSlug, AgentSlug[]> = {
  PROSPECT_TO_CASH: [
    "NOUR",
    "YOUSSEF",
    "MEHDI",
    "KARIM",
    "SAMIA",
    "KARIMA",
  ],
  IDEA_TO_MARKETING: [
    "TARIQ",
    "IMANE",
    "SALMA",
    "YASMINE",
  ],
  SUPPORT_CLIENT: [
    "FATIMA",
    "NADIA",
    "AMINE",
    "KAMAL",
  ],
}

// Labels affichés dans l'UI
export const WORKFLOW_LABELS: Record<WorkflowSlug, { name: string; description: string }> = {
  PROSPECT_TO_CASH: {
    name: "Prospect to Cash",
    description: "De la recherche prospect jusqu'à la facture encaissée",
  },
  IDEA_TO_MARKETING: {
    name: "Idée → Marketing",
    description: "De la stratégie jusqu'au contenu publié",
  },
  SUPPORT_CLIENT: {
    name: "Support & Service Client",
    description: "Fidélisation, gestion et analyse post-vente",
  },
}