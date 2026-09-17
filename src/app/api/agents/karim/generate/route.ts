import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { orgId } = await auth();
  if (!orgId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const org = await db.organization.findUnique({ where: { clerkOrgId: orgId } });
  const brandKit = org ? await db.brandKit.findUnique({ where: { organizationId: org.id } }) : null;

  const { prospectName, prospectSector, prospectSize, problem, services, budget, deadline } = await req.json();

  const systemPrompt = `Tu es Karim, expert en propositions commerciales B2B pour le marché marocain.
Tu génères des propositions commerciales structurées selon la méthode SCR (Situation-Complication-Résolution) avec 3 options tarifaires claires.
${brandKit ? `
Entreprise émettrice : ${brandKit.brandName}
Secteur : ${brandKit.sector}
Ville : ${brandKit.city}
Ton : ${brandKit.tone || "professionnel"}
` : ""}
Tu réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks.
Format exact :
{
  "intro": "accroche personnalisée 2-3 phrases — situation actuelle du prospect",
  "problem": "formulation du problème/complication identifié",
  "approach": "notre approche de résolution en 2-3 phrases",
  "options": [
    {
      "name": "Essentiel",
      "tagline": "sous-titre court",
      "price": "X 000 MAD HT/mois",
      "description": "description courte",
      "inclus": ["item 1", "item 2", "item 3"],
      "ideal": "pour qui c'est idéal",
      "highlight": false
    },
    {
      "name": "Pro",
      "tagline": "sous-titre court",
      "price": "X 000 MAD HT/mois",
      "description": "description courte",
      "inclus": ["item 1", "item 2", "item 3", "item 4"],
      "ideal": "pour qui c'est idéal",
      "highlight": true
    },
    {
      "name": "Premium",
      "tagline": "sous-titre court",
      "price": "Sur devis",
      "description": "description courte",
      "inclus": ["item 1", "item 2", "item 3", "item 4", "item 5"],
      "ideal": "pour qui c'est idéal",
      "highlight": false
    }
  ],
  "roi": "estimation du retour sur investissement ou valeur générée",
  "nextSteps": ["étape 1", "étape 2", "étape 3"],
  "validity": "Offre valable 30 jours",
  "tip": "conseil de Karim pour maximiser les chances d'acceptation"
}`;

  const userPrompt = `Génère une proposition commerciale complète.
Prospect : ${prospectName}
Secteur : ${prospectSector}
Taille : ${prospectSize}
Problème identifié : ${problem}
Services à proposer : ${services}
Budget évoqué : ${budget || "non communiqué"}
Délai souhaité : ${deadline || "non défini"}
Adapte les prix au marché marocain et au profil du prospect.
La proposition doit être convaincante, professionnelle et ancrée dans la réalité business marocaine.`;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text : "";
    const clean = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json({ success: true, proposal: parsed });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
