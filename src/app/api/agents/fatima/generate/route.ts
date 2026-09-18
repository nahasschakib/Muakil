import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { orgId } = await auth();
  if (!orgId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { situation, canal, ton, langue, typeOutput } = await req.json();

  const org = await db.organization.findUnique({
    where: { clerkOrgId: orgId },
    include: { brandKit: true },
  });

  const entreprise = org?.brandKit?.companyName || org?.name || "Notre entreprise";
  const secteur = org?.brandKit?.sector || "";
  const tonBrand = org?.brandKit?.tone || ton;

  const prompts: Record<string, string> = {
    reclamation: `Tu es Fatima, experte en relation client pour PME marocaines. Génère une réponse professionnelle à une réclamation client.

Entreprise : ${entreprise} (${secteur})
Situation / réclamation : ${situation}
Canal : ${canal}
Ton souhaité : ${tonBrand}
Langue : ${langue}

Réponds UNIQUEMENT en JSON valide sans backticks :
{
  "objet": "objet du message (si email)",
  "reponse": "réponse complète professionnelle et empathique (3-4 paragraphes max)",
  "gestes": ["geste commercial possible 1", "geste commercial possible 2"],
  "aEviter": ["erreur à éviter 1", "erreur à éviter 2"],
  "tip": "conseil de Fatima (max 20 mots)"
}`,

    faq: `Tu es Fatima, experte en relation client pour PME marocaines. Génère une FAQ professionnelle.

Entreprise : ${entreprise} (${secteur})
Domaine / thématique : ${situation}
Canal : ${canal}
Langue : ${langue}

Réponds UNIQUEMENT en JSON valide sans backticks, réponses CONCISES (max 2 phrases chacune) :
{
  "faqs": [
    {"question": "question 1", "reponse": "réponse courte"},
    {"question": "question 2", "reponse": "réponse courte"},
    {"question": "question 3", "reponse": "réponse courte"},
    {"question": "question 4", "reponse": "réponse courte"},
    {"question": "question 5", "reponse": "réponse courte"}
  ],
  "tip": "conseil de Fatima (max 20 mots)"
}`,

    script: `Tu es Fatima, experte en relation client pour PME marocaines. Génère un script d'appel téléphonique professionnel.

Entreprise : ${entreprise} (${secteur})
Objectif de l'appel : ${situation}
Ton : ${tonBrand}
Langue : ${langue}

Réponds UNIQUEMENT en JSON valide sans backticks, répliques COURTES (max 15 mots chacune) :
{
  "etapes": [
    {"phase": "Accueil", "agent": "réplique agent", "client": "réponse client type"},
    {"phase": "Identification", "agent": "réplique agent", "client": "réponse client type"},
    {"phase": "Écoute", "agent": "réplique agent", "client": "réponse client type"},
    {"phase": "Résolution", "agent": "réplique agent", "client": "réponse client type"},
    {"phase": "Clôture", "agent": "réplique agent", "client": "réponse client type"}
  ],
  "objections": [
    {"objection": "objection fréquente", "reponse": "réponse agent courte"}
  ],
  "tip": "conseil de Fatima (max 20 mots)"
}`,
  };

  const prompt = prompts[typeOutput] || prompts.reclamation;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2048,
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