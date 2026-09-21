// Matrice secteur → slugs agents inclus dans le pack
// Basée sur l'architecture Workflows & Matrice Sectorielle

export const SECTOR_PACKS: Record<string, string[]> = {
  // Agents Core universels dans tous les packs : salma, nour, samia, karima, fatima, kamal

  "Comptabilité & Audit": [
    "salma", "karima", "samia", "nour", "kamal", "amine", "fatima", "tariq"
  ],
  "Commerce & Distribution": [
    "salma", "karima", "samia", "nour", "kamal", "youssef", "mehdi", "karim", "fatima", "yasmine"
  ],
  "BTP & Immobilier": [
    "salma", "karima", "samia", "nour", "kamal", "youssef", "mehdi", "karim", "fatima", "tariq"
  ],
  "Transport & Logistique": [
    "salma", "karima", "samia", "nour", "kamal", "youssef", "fatima", "amine"
  ],
  "Restauration & Hôtellerie": [
    "salma", "karima", "samia", "nour", "kamal", "fatima", "imane", "yasmine"
  ],
  "Santé & Pharmacie": [
    "salma", "karima", "samia", "nour", "kamal", "fatima", "nadia", "tariq"
  ],
  "IT & Digital": [
    "salma", "karima", "samia", "nour", "kamal", "youssef", "mehdi", "karim",
    "fatima", "tariq", "reda", "imane"
  ],
  "Éducation & Formation": [
    "salma", "karima", "samia", "nour", "kamal", "fatima", "tariq", "reda", "nadia"
  ],
  "Industrie & Manufacturing": [
    "salma", "karima", "samia", "nour", "kamal", "youssef", "fatima", "amine", "nadia"
  ],
  "Services aux entreprises": [
    "salma", "karima", "samia", "nour", "kamal", "youssef", "mehdi", "karim",
    "fatima", "tariq", "reda", "imane", "nadia"
  ],
  "Autre": [
    "salma", "karima", "samia", "nour", "kamal", "fatima"
  ],
}

// Retourne true si l'agent est dans le pack secteur de l'org
// Si le secteur est inconnu → pack Core par défaut
export function agentInPack(agentSlug: string, sector: string | null | undefined): boolean {
  if (!sector) return true // pas de secteur → pas de restriction
  if (process.env.NEXT_PUBLIC_UNLOCK_ALL_AGENTS === "true") return true
  const pack = SECTOR_PACKS[sector] ?? SECTOR_PACKS["Autre"]
  return pack.includes(agentSlug)
}