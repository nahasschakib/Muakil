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

  const { meetingType, prospectSector, prospectRole, prospectContext, objective } = await req.json();

  const systemPrompt = `Tu es Mehdi, expert en développement commercial B2B pour le marché marocain.
Tu prépares des fiches de réunion complètes, structurées et adaptées à la culture business marocaine.
${brandKit ? `
Entreprise : ${brandKit.brandName}
Secteur : ${brandKit.sector}
Ville : ${brandKit.city}
` : ""}
Tu réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks.
Format exact :
{
  "summary": "résumé de la situation en 2-3 phrases",
  "bant": {
    "budget": "analyse du budget probable et questions pour qualifier",
    "authority": "qui décide probablement et comment l'identifier",
    "need": "besoins probables à explorer",
    "timeline": "horizon de décision probable"
  },
  "questions": [
    { "category": "Découverte", "question": "..." },
    { "category": "BANT", "question": "..." },
    { "category": "Objection", "question": "..." }
  ],
  "objections": [
    { "objection": "...", "reponse": "..." }
  ],
  "agenda": ["étape 1", "étape 2", "étape 3", "étape 4"],
  "tip": "conseil culturel ou stratégique pour cette réunion au Maroc"
}`;

  const userPrompt = `Prépare une fiche de réunion complète.
Type de réunion : ${meetingType}
Secteur prospect : ${prospectSector}
Poste prospect : ${prospectRole}
Contexte connu : ${prospectContext || "Aucun contexte particulier"}
Objectif : ${objective}
Adapte pour le contexte business marocain (codes culturels, processus de décision local, références pertinentes).`;

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

    return NextResponse.json({ success: true, brief: parsed });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
