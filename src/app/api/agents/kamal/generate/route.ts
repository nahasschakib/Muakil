import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { orgId } = await auth();
  if (!orgId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { domaine, periode, donnees, objectif, typeOutput } = await req.json();

  const org = await db.organization.findUnique({
    where: { clerkOrgId: orgId },
    include: { brandKit: true },
  });

  const entreprise = org?.brandKit?.brandName || org?.name || "Votre entreprise";
  const secteur = org?.brandKit?.sector || "";

  const prompts: Record<string, string> = {
    kpis: `Tu es Kamal, expert en analytics pour PME marocaines. Génère un tableau de bord KPIs adapté.

Entreprise : ${entreprise} (${secteur})
Domaine : ${domaine}
Période : ${periode}
Objectif : ${objectif}

Réponds UNIQUEMENT en JSON valide sans backticks, textes CONCIS :
{
  "kpis": [
    {"nom": "nom KPI", "description": "ce qu'il mesure", "unite": "unité (MAD, %, nombre...)", "frequence": "quotidien/hebdo/mensuel", "cible": "valeur cible exemple"},
    {"nom": "nom KPI", "description": "ce qu'il mesure", "unite": "unité", "frequence": "fréquence", "cible": "valeur cible"},
    {"nom": "nom KPI", "description": "ce qu'il mesure", "unite": "unité", "frequence": "fréquence", "cible": "valeur cible"},
    {"nom": "nom KPI", "description": "ce qu'il mesure", "unite": "unité", "frequence": "fréquence", "cible": "valeur cible"},
    {"nom": "nom KPI", "description": "ce qu'il mesure", "unite": "unité", "frequence": "fréquence", "cible": "valeur cible"},
    {"nom": "nom KPI", "description": "ce qu'il mesure", "unite": "unité", "frequence": "fréquence", "cible": "valeur cible"}
  ],
  "outil": "outil de suivi recommandé (Excel, Google Sheets, Power BI...)",
  "priorite": "KPI le plus critique à suivre en premier",
  "tip": "conseil de Kamal (max 20 mots)"
}`,

    analyse: `Tu es Kamal, expert en analytics pour PME marocaines. Analyse les données fournies et génère des insights actionnables.

Entreprise : ${entreprise} (${secteur})
Domaine : ${domaine}
Période : ${periode}
Données / chiffres : ${donnees}
Objectif : ${objectif}

Réponds UNIQUEMENT en JSON valide sans backticks, insights CONCIS (max 15 mots chacun) :
{
  "synthese": "résumé de la situation en 2 phrases",
  "points_forts": ["point fort 1", "point fort 2", "point fort 3"],
  "points_faibles": ["point faible 1", "point faible 2", "point faible 3"],
  "tendance": "tendance générale observée (1 phrase)",
  "actions": [
    {"priorite": "haute", "action": "action immédiate à mener"},
    {"priorite": "moyenne", "action": "action à planifier"},
    {"priorite": "basse", "action": "action à surveiller"}
  ],
  "alerte": "signal d'alarme à surveiller (1 phrase)",
  "tip": "conseil de Kamal (max 20 mots)"
}`,

    rapport: `Tu es Kamal, expert en analytics pour PME marocaines. Génère un rapport de performance mensuel structuré.

Entreprise : ${entreprise} (${secteur})
Domaine : ${domaine}
Période : ${periode}
Données disponibles : ${donnees}
Objectif : ${objectif}

Réponds UNIQUEMENT en JSON valide sans backticks, textes CONCIS :
{
  "titre": "titre du rapport",
  "resume_executif": "résumé en 2 phrases pour le dirigeant",
  "sections": [
    {"titre": "Performance globale", "contenu": "analyse courte", "statut": "bon/moyen/mauvais"},
    {"titre": "Points saillants", "contenu": "analyse courte", "statut": "bon/moyen/mauvais"},
    {"titre": "Écarts vs objectifs", "contenu": "analyse courte", "statut": "bon/moyen/mauvais"},
    {"titre": "Recommandations", "contenu": "analyse courte", "statut": "bon"}
  ],
  "decision": "décision clé à prendre ce mois-ci (1 phrase)",
  "tip": "conseil de Kamal (max 20 mots)"
}`,
  };

  const prompt = prompts[typeOutput] || prompts.kpis;

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