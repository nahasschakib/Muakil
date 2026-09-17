import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

const client = new Anthropic();

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { orgId } = await auth();
  if (!orgId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const org = await db.organization.findUnique({ where: { clerkOrgId: orgId } });
  const brandKit = org ? await db.brandKit.findUnique({ where: { organizationId: org.id } }) : null;

  const {
    periode, analysisType,
    ca, chargesExploitation, resultatNet,
    tresorerie, dettes, capitauxPropres,
    creances, stocks, immobilisations,
  } = await req.json();

  const systemPrompt = `Tu es Amine, expert en analyse financière pour les entreprises marocaines, certifié CGNC.
Tu analyses des données financières réelles et produis des rapports structurés conformes au Plan Comptable Général Marocain (CGNC).
${brandKit ? `
Entreprise : ${brandKit.brandName}
Secteur : ${brandKit.sector}
Ville : ${brandKit.city}
` : ""}

Tu réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks.
Format exact :
{
  "resume": "synthèse exécutive en 2-3 phrases",
  "indicateurs": [
    {
      "nom": "Nom de l'indicateur",
      "valeur": "valeur calculée avec unité",
      "statut": "bon" | "attention" | "critique",
      "interpretation": "explication courte",
      "benchmark": "comparaison avec normes sectorielles marocaines"
    }
  ],
  "ratios": {
    "rentabilite": {
      "margeNette": "X%",
      "margeBreute": "X%",
      "roi": "X%",
      "statut": "bon" | "attention" | "critique"
    },
    "liquidite": {
      "liquiditeGenerale": "X",
      "liquiditeReduite": "X",
      "tresorerieNette": "X MAD",
      "statut": "bon" | "attention" | "critique"
    },
    "solvabilite": {
      "autonomieFinanciere": "X%",
      "endettement": "X%",
      "capaciteRemboursement": "X ans",
      "statut": "bon" | "attention" | "critique"
    }
  },
  "forces": ["force 1", "force 2", "force 3"],
  "risques": ["risque 1", "risque 2"],
  "recommandations": [
    {
      "priorite": "haute" | "moyenne" | "faible",
      "action": "action recommandée",
      "impact": "impact attendu",
      "delai": "délai suggéré"
    }
  ],
  "conformiteCGNC": {
    "observations": "observations comptables CGNC",
    "alertes": ["alerte 1 si applicable"]
  },
  "scoreFinancier": numero entre 0 et 100,
  "tip": "conseil stratégique d'Amine"
}`;

  const userPrompt = `Analyse les données financières suivantes pour la période ${periode}.
Type d'analyse : ${analysisType}

COMPTE DE RÉSULTAT :
- Chiffre d'affaires : ${ca} MAD
- Charges d'exploitation : ${chargesExploitation} MAD
- Résultat net : ${resultatNet} MAD

BILAN :
- Trésorerie : ${tresorerie} MAD
- Créances clients : ${creances || 0} MAD
- Stocks : ${stocks || 0} MAD
- Immobilisations : ${immobilisations || 0} MAD
- Dettes totales : ${dettes} MAD
- Capitaux propres : ${capitauxPropres} MAD

Calcule tous les ratios financiers, évalue la santé financière de l'entreprise et fournis des recommandations concrètes adaptées au contexte marocain (TVA 20%, IS 20-31%, CGNC).`;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text : "";
    const clean = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json({ success: true, analysis: parsed });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
