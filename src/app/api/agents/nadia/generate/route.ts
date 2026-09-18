import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { orgId } = await auth();
  if (!orgId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { poste, secteur, typeContrat, niveauExperience, competences, salaire, typeOutput } = await req.json();

  const org = await db.organization.findUnique({
    where: { clerkOrgId: orgId },
    include: { brandKit: true },
  });

  const brandKit = org?.brandKit;
  const entreprise = brandKit?.brandName || "Notre entreprise";
  const ville = brandKit?.city || "Casablanca";

  const prompts: Record<string, string> = {
    offre: `Tu es Nadia, experte RH pour PME marocaines. Génère une offre d'emploi professionnelle et attractive.

Entreprise : ${entreprise} (${ville})
Poste : ${poste}
Secteur : ${secteur}
Contrat : ${typeContrat}
Expérience : ${niveauExperience}
Compétences : ${competences}
Salaire : ${salaire}

Réponds UNIQUEMENT en JSON valide sans backticks :
{
  "titre": "titre accrocheur du poste",
  "intro": "présentation de l'entreprise (2-3 phrases)",
  "missions": ["mission 1", "mission 2", "mission 3", "mission 4", "mission 5"],
  "profil": ["critère 1", "critère 2", "critère 3", "critère 4"],
  "avantages": ["avantage 1", "avantage 2", "avantage 3"],
  "processus": "comment postuler",
  "tip": "conseil RH de Nadia"
}`,

    entretien: `Tu es Nadia, experte RH pour PME marocaines. Génère une grille d'entretien structurée par compétences.

Poste : ${poste}
Secteur : ${secteur}
Expérience requise : ${niveauExperience}
Compétences clés : ${competences}

Réponds UNIQUEMENT en JSON valide sans backticks :
{
    "questions": [
    {"categorie": "Motivation", "question": "...", "indice": "..."},
    {"categorie": "Expérience", "question": "...", "indice": "..."},
    {"categorie": "Compétences techniques", "question": "...", "indice": "..."},
    {"categorie": "Comportemental", "question": "...", "indice": "..."},
    {"categorie": "Mise en situation", "question": "...", "indice": "..."}
  ],
  "scorecard": ["critère évaluation 1", "critère évaluation 2", "critère évaluation 3"],
  "tip": "conseil entretien de Nadia"
}`,

    lettre: `Tu es Nadia, experte RH pour PME marocaines. Génère une lettre d'offre d'embauche formelle conforme aux usages marocains.

Entreprise : ${entreprise} (${ville})
Poste : ${poste}
Contrat : ${typeContrat}
Salaire proposé : ${salaire}

Réponds UNIQUEMENT en JSON valide sans backticks :
{
  "objet": "objet de la lettre",
  "corps": "corps complet de la lettre (formel, mentions légales marocaines, période d'essai selon CGNC)",
  "mentions": ["mention légale 1", "mention légale 2", "mention légale 3"],
  "tip": "conseil de Nadia sur l'intégration"
}`,
  };

  const prompt = prompts[typeOutput] || prompts.offre;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 3000,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = message.content[0].type === "text" ? message.content[0].text : "";
  const clean = raw.replace(/```json|```/g, "").trim();

  try {
    const data = JSON.parse(clean);
    return NextResponse.json({ ...data, typeOutput });
  } catch {
    return NextResponse.json({ error: "Erreur parsing JSON", raw }, { status: 500 });
  }
}