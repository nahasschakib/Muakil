import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { orgId } = await auth();
  if (!orgId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { channel, sector, prospectRole, companySize, objective, tone } = await req.json();

  const org = await db.organization.findUnique({ where: { clerkOrgId: orgId } });
  const brandKit = org ? await db.brandKit.findUnique({ where: { organizationId: org.id } }) : null;

  const channelInstructions: Record<string, string> = {
    WhatsApp: "Messages courts, conversationnels, avec emojis pertinents. Ton direct et humain. Maximum 200 mots par message.",
    LinkedIn: "Message de connexion (300 caractères max pour la note), puis 2 relances sous forme de messages LinkedIn professionnels et personnalisés.",
    Email: "Objet accrocheur inclus dans le champ 'subject'. Corps structuré : accroche personnalisée, valeur proposée, CTA clair. Signature professionnelle.",
    SMS: "Maximum 160 caractères par message. Ultra-concis, CTA immédiat, lien ou numéro à la fin.",
  };

  const systemPrompt = `Tu es Youssef, expert en prospection B2B pour le marché marocain.
Tu génères des séquences de messages de prospection percutants, personnalisés et adaptés à la culture business marocaine.
${brandKit ? `
Entreprise : ${brandKit.brandName}
Secteur : ${brandKit.sector}
Ville : ${brandKit.city}
Ton de marque : ${brandKit.tone || "professionnel"}
` : ""}
Tu réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks.
Format exact :
{
  "messages": [
    { "step": "Premier contact", "day": 0, "text": "...", "subject": "..." },
    { "step": "Relance", "day": 2, "text": "...", "subject": "..." },
    { "step": "Dernière chance", "day": 5, "text": "...", "subject": "..." }
  ],
  "channel": "${channel}",
  "tip": "conseil court pour maximiser le taux de réponse sur ce canal"
}
Note: le champ "subject" n'est utilisé que pour Email (objet du mail). Pour les autres canaux, laisse-le vide "".`;

  const userPrompt = `Génère une séquence de prospection ${channel} B2B.
Secteur cible : ${sector}
Poste du prospect : ${prospectRole}
Taille entreprise : ${companySize || "PME"}
Objectif : ${objective}
Ton : ${tone}
Instructions canal : ${channelInstructions[channel]}
Contextualise pour le marché marocain (références locales si pertinent, respect des codes culturels business marocains).`;

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

    return NextResponse.json({ success: true, sequence: parsed });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
