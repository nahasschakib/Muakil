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

  const { productName, category, price, platform, season, contentType, description, targetAudience } = await req.json();

  const systemPrompt = `Tu es Yasmine, experte en e-commerce et marketing produit pour le marché marocain.
Tu crées des fiches produits et scripts vidéo optimisés pour les plateformes marocaines.
${brandKit ? `
Marque : ${brandKit.brandName}
Secteur : ${brandKit.sector}
Ville : ${brandKit.city}
Ton : ${brandKit.tone || "professionnel"}
` : ""}

Tu réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks.
Format exact :
{
  "productSheet": {
    "titre": "Titre accrocheur optimisé SEO (max 80 caractères)",
    "sousTitre": "Sous-titre descriptif",
    "description": "Description produit engageante 3-4 paragraphes",
    "avantages": ["avantage 1", "avantage 2", "avantage 3", "avantage 4", "avantage 5"],
    "caracteristiques": ["spec 1", "spec 2", "spec 3"],
    "prix": "prix affiché avec devise",
    "badge": "badge promotionnel (ex: Nouveau, Best-seller, Édition Ramadan)",
    "cta": "texte du bouton d'action",
    "seoKeywords": ["mot-clé 1", "mot-clé 2", "mot-clé 3"]
  },
  "videoScript": {
    "hook": "Accroche première seconde (très percutante)",
    "intro": "Introduction 5-10 secondes",
    "demo": "Démonstration produit 20-30 secondes",
    "temoignage": "Témoignage ou preuve sociale simulée",
    "cta": "Call-to-action final",
    "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
    "duration": "durée recommandée"
  },
  "tip": "conseil de Yasmine pour maximiser les ventes sur ${platform || 'cette plateforme'} au Maroc"
}`;

  const userPrompt = `Crée le contenu e-commerce pour ce produit.
Produit : ${productName}
Catégorie : ${category}
Prix : ${price} MAD
Plateforme : ${platform}
Saison/Occasion : ${season || "Toute saison"}
Type de contenu : ${contentType}
Description du vendeur : ${description || "non fournie"}
Audience cible : ${targetAudience || "grand public marocain"}

Adapte le contenu au contexte marocain — références culturelles, saisons commerciales, prix en MAD, plateformes locales.
${season === "Ramadan" ? "Intègre les valeurs de partage, famille et générosité du Ramadan." : ""}
${season === "Aïd" ? "Intègre les thèmes de célébration, cadeaux et fête de l'Aïd." : ""}
${season === "Rentrée" ? "Intègre les thèmes de la rentrée scolaire et préparation." : ""}`;

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

    return NextResponse.json({ success: true, content: parsed });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
