import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { orgId } = await auth();
  if (!orgId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { objet, destinataire, contexte, ton, typeOutput } = await req.json();

  const org = await db.organization.findUnique({
    where: { clerkOrgId: orgId },
    include: { brandKit: true },
  });

  const entreprise = org?.brandKit?.brandName || org?.name || "Notre entreprise";
  const secteur = org?.brandKit?.sector || "";
  const tonBrand = org?.brandKit?.tone || ton;

  const prompts: Record<string, string> = {
    email: `Tu es Samia, experte en communication écrite pour PME marocaines. Rédige un email professionnel.

Expéditeur : ${entreprise} (${secteur})
Destinataire : ${destinataire}
Objet / contexte : ${objet} — ${contexte}
Ton : ${tonBrand}

Réponds UNIQUEMENT en JSON valide sans backticks :
{
  "objet": "objet de l'email (accrocheur, max 10 mots)",
  "corps": "email complet avec formule d'appel, corps structuré et formule de politesse",
  "variante": "version alternative plus courte du même email",
  "tip": "conseil de Samia (max 20 mots)"
}`,

    relance: `Tu es Samia, experte en communication pour PME marocaines. Rédige une séquence de relance email en 3 temps.

Expéditeur : ${entreprise} (${secteur})
Destinataire : ${destinataire}
Contexte : ${objet} — ${contexte}
Ton : ${tonBrand}

Réponds UNIQUEMENT en JSON valide sans backticks, emails COURTS (max 5 phrases chacun) :
{
  "relances": [
    {"delai": "J+3", "objet": "objet email 1", "corps": "email relance 1 court et direct"},
    {"delai": "J+7", "objet": "objet email 2", "corps": "email relance 2 avec valeur ajoutée"},
    {"delai": "J+14", "objet": "objet email 3", "corps": "dernière relance — ton légèrement différent"}
  ],
  "tip": "conseil de Samia sur les relances (max 20 mots)"
}`,

    newsletter: `Tu es Samia, experte en communication pour PME marocaines. Rédige une newsletter professionnelle.

Expéditeur : ${entreprise} (${secteur})
Destinataires : ${destinataire}
Thème / actualité : ${objet} — ${contexte}
Ton : ${tonBrand}

Réponds UNIQUEMENT en JSON valide sans backticks, sections CONCISES :
{
  "objet": "objet newsletter accrocheur (max 10 mots)",
  "preheader": "texte prévisualisation (max 12 mots)",
  "sections": [
    {"titre": "titre section 1", "contenu": "contenu court 2-3 phrases", "cta": "bouton action"},
    {"titre": "titre section 2", "contenu": "contenu court 2-3 phrases", "cta": "bouton action"},
    {"titre": "titre section 3", "contenu": "contenu court 2-3 phrases", "cta": "bouton action"}
  ],
  "signature": "formule de clôture + signature",
  "tip": "conseil de Samia (max 20 mots)"
}`,
  };

  const prompt = prompts[typeOutput] || prompts.email;

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