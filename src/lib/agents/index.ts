export type AgentPlan = 'STARTER' | 'PRO' | 'AGENCE'

export type Agent = {
  slug: string
  nom: string
  prenom: string
  role: string
  description: string
  planMin: AgentPlan
  couleur: string
  emoji: string
}

export const AGENTS: Agent[] = [
  {
    slug: 'salma',
    prenom: 'Salma',
    nom: 'Agente Contenu',
    role: 'Création de contenu',
    description: 'Rédige tes posts, articles et newsletters en français, arabe ou darija. Adapte le ton à ta marque.',
    planMin: 'STARTER',
    couleur: 'violet',
    emoji: '✍️',
  },
  {
    slug: 'karima',
    prenom: 'Karima',
    nom: 'Agente Admin',
    role: 'Administration & facturation',
    description: 'Génère tes factures, devis et bons de commande conformes au droit marocain (ICE, IF, RC).',
    planMin: 'STARTER',
    couleur: 'emerald',
    emoji: '🧾',
  },
  {
    slug: 'youssef',
    prenom: 'Youssef',
    nom: 'Agent Commercial',
    role: 'Prospection B2B',
    description: 'Identifie des prospects via OMPIC et Pages Jaunes Maroc, rédige tes messages WhatsApp et emails de prospection.',
    planMin: 'PRO',
    couleur: 'blue',
    emoji: '🤝',
  },
  {
    slug: 'mehdi',
    prenom: 'Mehdi',
    nom: 'Agent Réunions',
    role: 'Suivi prospects & réunions',
    description: 'Analyse tes calls, génère les comptes-rendus et suit le pipeline BANT en MAD.',
    planMin: 'PRO',
    couleur: 'orange',
    emoji: '📞',
  },
  {
    slug: 'karim',
    prenom: 'Karim',
    nom: 'Agent Propositions',
    role: 'Propositions commerciales',
    description: 'Rédige tes propositions commerciales en 3 options (Situation / Complication / Résolution).',
    planMin: 'PRO',
    couleur: 'amber',
    emoji: '📄',
  },
  {
    slug: 'nour',
    prenom: 'Nour',
    nom: 'Agente Veille',
    role: 'Veille & tendances',
    description: 'Surveille Instagram, LinkedIn et les tendances sectorielles marocaines pour alimenter ta stratégie.',
    planMin: 'PRO',
    couleur: 'pink',
    emoji: '🔍',
  },
  {
    slug: 'yasmine',
    prenom: 'Yasmine',
    nom: 'Agente E-commerce',
    role: 'E-commerce & vidéo produit',
    description: 'Crée tes fiches produits, scripts vidéo et contenus pour le marché marocain (Ramadan, Aid, rentrée).',
    planMin: 'PRO',
    couleur: 'rose',
    emoji: '🛍️',
  },
  {
    slug: 'tariq',
    prenom: 'Tariq',
    nom: 'Agent Stratégie',
    role: 'Stratégie & briefs',
    description: 'Conçoit ta stratégie de communication, rédige tes briefs créatifs et plans d\'action.',
    planMin: 'AGENCE',
    couleur: 'indigo',
    emoji: '🎯',
  },
  {
    slug: 'amine',
    prenom: 'Amine',
    nom: 'Agent Comptable',
    role: 'Analyse financière',
    description: 'Analyse tes données financières, génère des tableaux de bord et rapports conformes CGNC.',
    planMin: 'AGENCE',
    couleur: 'teal',
    emoji: '📊',
  },
  {
    slug: 'reda',
    prenom: 'Reda',
    nom: 'Agent Présentations',
    role: 'Decks & présentations',
    description: 'Structure et rédige tes présentations, pitchs et rapports pour clients et investisseurs.',
    planMin: 'AGENCE',
    couleur: 'cyan',
    emoji: '🖥️',
  },
  {
    slug: 'nadia',
    prenom: 'Nadia',
    nom: 'Agente RH',
    role: 'RH & recrutement',
    description: 'Rédige tes offres d\'emploi, analyse les CVs et prépare tes entretiens selon le droit du travail marocain.',
    planMin: 'AGENCE',
    couleur: 'purple',
    emoji: '👥',
  },
  {
    slug: 'fatima',
    prenom: 'Fatima',
    nom: 'Agente Service Client',
    role: 'Service client',
    description: 'Rédige tes réponses clients en français, arabe ou darija. Gère les réclamations et fidélise.',
    planMin: 'AGENCE',
    couleur: 'green',
    emoji: '💬',
  },
  {
    slug: 'imane',
    prenom: 'Imane',
    nom: 'Agente Creative',
    role: 'Creative strategist',
    description: 'Imagine tes concepts créatifs, campagnes et idées de contenu viral pour le marché marocain.',
    planMin: 'AGENCE',
    couleur: 'fuchsia',
    emoji: '💡',
  },
  {
    slug: 'kamal',
    prenom: 'Kamal',
    nom: 'Agent Performances',
    role: 'Analyse performances',
    description: 'Analyse tes KPIs, rapports Meta/Google Ads et recommande des optimisations.',
    planMin: 'AGENCE',
    couleur: 'sky',
    emoji: '📈',
  },
  {
    slug: 'samia',
    prenom: 'Samia',
    nom: 'Agente Email',
    role: 'Gestion emails',
    description: 'Trie, rédige et suit tes emails professionnels. Relances, confirmations, courriers formels.',
    planMin: 'AGENCE',
    couleur: 'lime',
    emoji: '📧',
  },
]

const PLAN_RANK: Record<AgentPlan, number> = {
  STARTER: 0,
  PRO: 1,
  AGENCE: 2,
}

export function agentAccessible(agentPlan: AgentPlan, orgPlan: AgentPlan): boolean {
  if (process.env.NEXT_PUBLIC_UNLOCK_ALL_AGENTS === 'true') return true
  return PLAN_RANK[orgPlan] >= PLAN_RANK[agentPlan]
}

export function getAgent(slug: string): Agent | undefined {
  return AGENTS.find((a) => a.slug === slug)
}
