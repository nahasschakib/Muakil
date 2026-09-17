import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { braveSearch, formatSearchResults } from "@/lib/tools/braveSearch";

const client = new Anthropic();

const webSearchTool = {
  name: "web_search",
  description: "Recherche des informations réelles sur internet — entreprises, contacts, actualités, prix du marché.",
  input_schema: {
    type: "object" as const,
    properties: {
      query: { type: "string", description: "Requête de recherche précise" },
      count: { type: "number", description: "Nombre de résultats (3-10)" },
    },
    required: ["query"],
  },
};

export async function POST(req: NextRequest) {
  const { orgId } = await auth();
  if (!orgId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const org = await db.organization.findUnique({ where: { clerkOrgId: orgId } });
  const brandKit = org ? await db.brandKit.findUnique({ where: { organizationId: org.id } }) : null;

  const { searchType, query, city, sector } = await req.json();

  const systemPrompt = `Tu es Nour, experte en recherche et veille pour le marché marocain.
${brandKit ? `Tu travailles pour "${brandKit.brandName}", ${brandKit.sector} basée à ${brandKit.city}.` : ""}

Tu utilises l'outil web_search pour trouver des informations RÉELLES et ACTUALISÉES.
Fais 2-3 recherches complémentaires pour obtenir des résultats complets.

Tu réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks.
Format exact selon le type de recherche :

Pour PROSPECTS et CONCURRENTS :
{
  "type": "${searchType}",
  "query": "requête utilisée",
  "results": [
    {
      "nom": "Nom de l'entreprise",
      "dirigeant": "Nom du dirigeant si trouvé",
      "secteur": "Secteur d'activité",
      "ville": "Ville",
      "telephone": "Numéro si disponible",
      "email": "Email si disponible",
      "site": "URL du site web",
      "description": "Description courte de l'activité",
      "source": "URL source de l'information"
    }
  ],
  "total": nombre de résultats,
  "tip": "conseil stratégique de Nour pour exploiter ces résultats"
}

Pour ACTUALITES :
{
  "type": "actualites",
  "query": "requête utilisée",
  "results": [
    {
      "titre": "Titre de l'article",
      "source": "Nom du média",
      "url": "URL de l'article",
      "date": "Date si disponible",
      "resume": "Résumé en 2 phrases",
      "pertinence": "Pourquoi c'est pertinent pour l'entreprise"
    }
  ],
  "total": nombre,
  "tip": "conseil de Nour"
}

Pour MARCHE :
{
  "type": "marche",
  "query": "requête utilisée",
  "results": [
    {
      "titre": "Tendance ou donnée",
      "detail": "Explication détaillée",
      "source": "URL source",
      "impact": "Impact pour l'entreprise"
    }
  ],
  "total": nombre,
  "tip": "conseil de Nour"
}`;

  const searchQueries: Record<string, string[]> = {
    prospects: [
      `${query} ${city} Maroc contact téléphone site web`,
      `${sector || query} entreprises ${city} Maroc annuaire`,
      `${query} ${city} pages jaunes Maroc`,
      `${query} ${city} Maroc LinkedIn dirigeant`,
    ],
    concurrents: [
      `${query} ${city} Maroc concurrent`,
      `${sector || query} cabinets ${city} site web`,
      `${query} ${city} Maroc annuaire professionnel`,
      `${query} ${city} Maroc avis clients`,
    ],
    actualites: [
      `${query} Maroc actualité 2025 2026`,
      `${sector || query} Maroc news récent`,
    ],
    marche: [
      `${query} marché Maroc tendance analyse`,
      `${sector || query} secteur Maroc données statistiques`,
    ],
  };

  const queries = searchQueries[searchType] || searchQueries.prospects;

  // Lancer les recherches Brave en parallèle
  const searchResults = await Promise.all(
    queries.map(async (q) => {
      try {
        const result = await braveSearch(q, 8);
        return formatSearchResults(result);
      } catch {
        return `Erreur recherche: ${q}`;
      }
    })
  );

  const combinedResults = searchResults.join("\n\n---\n\n");

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Voici les résultats de recherche web que j'ai obtenus :

${combinedResults}

Analyse ces résultats et retourne une liste structurée de ${searchType} pour : "${query}" à ${city}, secteur ${sector || "général"}.
Extrais uniquement les informations réelles trouvées dans les résultats. Ne hallucine pas.`,
        },
      ],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text : "";
    const clean = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json({ success: true, data: parsed });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
