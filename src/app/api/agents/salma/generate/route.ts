import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { orgId } = await auth();
  if (!orgId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { network, theme, tone, cta, targetAudience } = await req.json();

  // Charger le BrandKit de l'organisation
  const org = await db.organization.findUnique({ where: { clerkOrgId: orgId } });
  const brandKit = org ? await db.brandKit.findUnique({ where: { organizationId: org.id } }) : null;

  const systemPrompt = `Tu es Salma, experte en création de contenu digital pour le marché marocain.
Tu génères des posts sociaux professionnels, engageants et adaptés à la culture marocaine.
${brandKit ? `
Marque : ${brandKit.brandName}
Secteur : ${brandKit.industry}
Ton de marque : ${brandKit.brandTone}
Description : ${brandKit.brandDescription}
` : ""}
Tu réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks.
Format exact :
{
  "caption": "texte du post (avec emojis adaptés au réseau)",
  "hashtags": ["hashtag1", "hashtag2", ...],
  "visualSuggestion": "description concise de l'image/visuel recommandé",
  "hook": "première phrase d'accroche (pour Stories/Reels)"
}`;

  const userPrompt = `Crée un post ${network} professionnel.
Thème : ${theme}
Ton : ${tone}
Call-to-action : ${cta || "aucun"}
Audience cible : ${targetAudience || "grand public marocain"}
Réseau : ${network}
${network === "LinkedIn" ? "Format professionnel, structuré, avec des sauts de ligne." : ""}
${network === "Instagram" ? "Légende courte et percutante, nombreux emojis pertinents, hashtags variés." : ""}
${network === "Facebook" ? "Ton conversationnel, accessible, avec question d'engagement à la fin." : ""}`;

  let message;
  try {
    message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }

  const raw = message.content[0].type === "text" ? message.content[0].text : "";

  try {
    const clean = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    const parsed = JSON.parse(clean);
    if (Array.isArray(parsed.hashtags)) { parsed.hashtags = parsed.hashtags.map((h: string) => h.replace(/^#+/, "")); }
    return NextResponse.json({ success: true, post: parsed, network });
  } catch {
    return NextResponse.json({ error: "Erreur de parsing", raw }, { status: 500 });
  }
}
