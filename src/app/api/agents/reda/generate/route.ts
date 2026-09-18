import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { orgId } = await auth();
  if (!orgId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { sujet, audience, objectif, contexte, typeOutput } = await req.json();

  const org = await db.organization.findUnique({
    where: { clerkOrgId: orgId },
    include: { brandKit: true },
  });

  const entreprise = org?.brandKit?.brandName || org?.name || "Votre entreprise";
  const secteur = org?.brandKit?.sector || "";

  const prompts: Record<string, string> = {
    pitch: `Tu es Reda, expert en présentation et storytelling pour PME marocaines. Génère un pitch deck structuré.

Entreprise : ${entreprise} (${secteur})
Sujet : ${sujet}
Audience : ${audience}
Objectif : ${objectif}
Contexte : ${contexte}

Réponds UNIQUEMENT en JSON valide sans backticks, textes CONCIS (titres max 8 mots, contenus max 15 mots) :
{
  "slides": [
    {"numero": 1, "titre": "titre slide", "type": "cover", "contenu": "accroche principale", "notes": "note orateur"},
    {"numero": 2, "titre": "Le problème", "type": "problem", "contenu": "problème en 1 phrase", "notes": "note orateur"},
    {"numero": 3, "titre": "Notre solution", "type": "solution", "contenu": "solution en 1 phrase", "notes": "note orateur"},
    {"numero": 4, "titre": "Pourquoi nous", "type": "value", "contenu": "différenciateur clé", "notes": "note orateur"},
    {"numero": 5, "titre": "Appel à l'action", "type": "cta", "contenu": "next step concret", "notes": "note orateur"}
  ],
  "tip": "conseil de Reda (max 20 mots)"
}`,

    client: `Tu es Reda, expert en présentation pour PME marocaines. Génère une présentation client professionnelle.

Entreprise : ${entreprise} (${secteur})
Sujet : ${sujet}
Client/Audience : ${audience}
Objectif : ${objectif}
Contexte : ${contexte}

Réponds UNIQUEMENT en JSON valide sans backticks, textes CONCIS :
{
  "slides": [
    {"numero": 1, "titre": "titre", "type": "cover", "contenu": "introduction", "notes": "note orateur"},
    {"numero": 2, "titre": "Contexte & enjeux", "type": "context", "contenu": "situation client", "notes": "note orateur"},
    {"numero": 3, "titre": "Notre approche", "type": "approach", "contenu": "méthodologie", "notes": "note orateur"},
    {"numero": 4, "titre": "Ce qu'on propose", "type": "offer", "contenu": "offre concrète", "notes": "note orateur"},
    {"numero": 5, "titre": "Prochaines étapes", "type": "next", "contenu": "actions immédiates", "notes": "note orateur"}
  ],
  "tip": "conseil de Reda (max 20 mots)"
}`,

    rapport: `Tu es Reda, expert en communication pour PME marocaines. Génère un rapport de réunion structuré.

Entreprise : ${entreprise}
Réunion : ${sujet}
Participants : ${audience}
Objectif : ${objectif}
Contexte / points abordés : ${contexte}

Réponds UNIQUEMENT en JSON valide sans backticks, textes CONCIS :
{
  "slides": [
    {"numero": 1, "titre": "Compte-rendu", "type": "cover", "contenu": "réunion + date", "notes": ""},
    {"numero": 2, "titre": "Points abordés", "type": "agenda", "contenu": "sujets traités", "notes": ""},
    {"numero": 3, "titre": "Décisions prises", "type": "decisions", "contenu": "décisions actées", "notes": ""},
    {"numero": 4, "titre": "Actions & responsables", "type": "actions", "contenu": "qui fait quoi avant quand", "notes": ""},
    {"numero": 5, "titre": "Prochaine réunion", "type": "next", "contenu": "date et ordre du jour", "notes": ""}
  ],
  "tip": "conseil de Reda (max 20 mots)"
}`,
  };

  const prompt = prompts[typeOutput] || prompts.pitch;

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