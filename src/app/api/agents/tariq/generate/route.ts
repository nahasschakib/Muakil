import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { orgId } = await auth();
  if (!orgId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { secteur, taille, defi, objectif, budget, typeOutput } = await req.json();

  const org = await db.organization.findUnique({
    where: { clerkOrgId: orgId },
    include: { brandKit: true },
  });

  const entreprise = org?.brandKit?.brandName || org?.name || "Votre entreprise";
  const ville = org?.brandKit?.city || "Maroc";

  const prompts: Record<string, string> = {
    swot: `Tu es Tariq, expert en stratégie d'entreprise pour PME marocaines. Génère une analyse SWOT approfondie et actionnelle.

Entreprise : ${entreprise} (${ville})
Secteur : ${secteur}
Taille : ${taille}
Défi principal : ${defi}
Objectif : ${objectif}

Réponds UNIQUEMENT en JSON valide sans backticks, textes CONCIS (max 12 mots par item) :
{
  "forces": ["force 1", "force 2", "force 3", "force 4"],
  "faiblesses": ["faiblesse 1", "faiblesse 2", "faiblesse 3", "faiblesse 4"],
  "opportunites": ["opportunité 1", "opportunité 2", "opportunité 3", "opportunité 4"],
  "menaces": ["menace 1", "menace 2", "menace 3", "menace 4"],
  "priorite": "action stratégique prioritaire à mener maintenant (1 phrase)",
  "tip": "conseil de Tariq (max 20 mots)"
}`,

    plan90: `Tu es Tariq, expert en stratégie pour PME marocaines. Génère un plan d'action stratégique sur 90 jours.

Entreprise : ${entreprise} (${ville})
Secteur : ${secteur}
Taille : ${taille}
Défi : ${defi}
Objectif : ${objectif}
Budget : ${budget}

Réponds UNIQUEMENT en JSON valide sans backticks, actions COURTES (max 10 mots chacune) :
{
  "mois1": {
    "theme": "thème mois 1",
    "actions": ["action 1", "action 2", "action 3"]
  },
  "mois2": {
    "theme": "thème mois 2",
    "actions": ["action 1", "action 2", "action 3"]
  },
  "mois3": {
    "theme": "thème mois 3",
    "actions": ["action 1", "action 2", "action 3"]
  },
  "kpis": ["KPI 1", "KPI 2", "KPI 3"],
  "risque": "principal risque à surveiller (1 phrase courte)",
  "tip": "conseil de Tariq (max 20 mots)"
}`,

    positionnement: `Tu es Tariq, expert en stratégie pour PME marocaines. Génère une analyse de positionnement concurrentiel.

Entreprise : ${entreprise} (${ville})
Secteur : ${secteur}
Taille : ${taille}
Défi : ${defi}
Objectif : ${objectif}

Réponds UNIQUEMENT en JSON valide sans backticks, textes CONCIS :
{
  "proposition": "proposition de valeur unique (1 phrase percutante)",
  "cible": "client idéal au Maroc (1 phrase)",
  "differenciateurs": ["différenciateur 1", "différenciateur 2", "différenciateur 3"],
  "messages": ["message clé 1", "message clé 2", "message clé 3"],
  "canaux": ["canal prioritaire 1", "canal prioritaire 2", "canal prioritaire 3"],
  "tip": "conseil de Tariq (max 20 mots)"
}`,
  };

  const prompt = prompts[typeOutput] || prompts.swot;

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