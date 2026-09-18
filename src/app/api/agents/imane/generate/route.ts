import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { orgId } = await auth();
  if (!orgId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { produit, cible, emotion, format, typeOutput } = await req.json();

  const org = await db.organization.findUnique({
    where: { clerkOrgId: orgId },
    include: { brandKit: true },
  });

  const entreprise = org?.brandKit?.brandName || org?.name || "Notre entreprise";
  const secteur = org?.brandKit?.sector || "";
  const tone = org?.brandKit?.tone || "professionnel";

  const prompts: Record<string, string> = {
    slogan: `Tu es Imane, directrice créative pour PME marocaines. Génère des slogans et taglines percutants.

Entreprise : ${entreprise} (${secteur})
Produit/Service : ${produit}
Cible : ${cible}
Émotion visée : ${emotion}
Ton de marque : ${tone}

Réponds UNIQUEMENT en JSON valide sans backticks :
{
  "slogans": [
    {"texte": "slogan 1 court et percutant", "angle": "angle créatif utilisé"},
    {"texte": "slogan 2 émotionnel", "angle": "angle créatif utilisé"},
    {"texte": "slogan 3 rationnel", "angle": "angle créatif utilisé"},
    {"texte": "slogan 4 en darija ou bilingue", "angle": "angle créatif utilisé"}
  ],
  "tagline": "tagline officielle recommandée (max 6 mots)",
  "territoire": "territoire de marque en 1 phrase",
  "tip": "conseil d'Imane (max 20 mots)"
}`,

    brief: `Tu es Imane, directrice créative pour PME marocaines. Génère un brief créatif complet pour une campagne.

Entreprise : ${entreprise} (${secteur})
Produit/Service : ${produit}
Cible : ${cible}
Émotion visée : ${emotion}
Format : ${format}
Ton : ${tone}

Réponds UNIQUEMENT en JSON valide sans backticks, textes CONCIS :
{
  "objectif": "objectif de la campagne (1 phrase)",
  "cibleDetail": "portrait précis de la cible marocaine",
  "message": "message central unique (1 phrase forte)",
  "ton": "description du ton et style visuel",
  "elements": ["élément créatif clé 1", "élément créatif clé 2", "élément créatif clé 3"],
  "aEviter": ["erreur créative à éviter 1", "erreur créative à éviter 2"],
  "inspiration": "référence ou direction artistique suggérée",
  "tip": "conseil d'Imane (max 20 mots)"
}`,

    pub: `Tu es Imane, directrice créative pour PME marocaines. Génère des textes publicitaires prêts à l'emploi.

Entreprise : ${entreprise} (${secteur})
Produit/Service : ${produit}
Cible : ${cible}
Émotion visée : ${emotion}
Format : ${format}
Ton : ${tone}

Réponds UNIQUEMENT en JSON valide sans backticks, textes COURTS adaptés au format :
{
  "titre": "titre accrocheur (max 8 mots)",
  "sousTitre": "sous-titre qui complète (max 12 mots)",
  "corps": "texte principal (2-3 phrases max)",
  "cta": "appel à l'action (max 5 mots)",
  "variantes": [
    {"version": "Version A — émotionnelle", "titre": "...", "cta": "..."},
    {"version": "Version B — rationnelle", "titre": "...", "cta": "..."}
  ],
  "tip": "conseil d'Imane (max 20 mots)"
}`,
  };

  const prompt = prompts[typeOutput] || prompts.slogan;

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