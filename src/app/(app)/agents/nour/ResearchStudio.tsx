"use client";

import { useState } from "react";
import { ResultCards } from "./ResultCards";
import { saveLivrable } from "@/app/(app)/livrables/actions";
import { completeWorkflowStep } from "@/app/(app)/workflows/actions";
import { useRouter } from "next/navigation";
import type { BrandKit } from "@prisma/client";

type SearchType = "prospects" | "concurrents" | "actualites" | "marche";

const searchTypes: {
  id: SearchType;
  emoji: string;
  label: string;
  desc: string;
}[] = [
  {
    id: "prospects",
    emoji: "🎯",
    label: "Prospects",
    desc: "Clients potentiels à contacter",
  },
  {
    id: "concurrents",
    emoji: "🔍",
    label: "Concurrents",
    desc: "Analyse concurrentielle réelle",
  },
  {
    id: "actualites",
    emoji: "📰",
    label: "Actualités",
    desc: "News et tendances sectorielles",
  },
  {
    id: "marche",
    emoji: "📊",
    label: "Marché",
    desc: "Données et opportunités marché",
  },
];

const moroccanCities = [
  "Tout le Maroc",
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Fès",
  "Tanger",
  "Agadir",
  "Meknès",
  "Oujda",
  "Kenitra",
  "Tétouan",
  "Salé",
  "Mohammedia",
];

type ProspectResult = {
  nom: string;
  dirigeant?: string;
  secteur?: string;
  ville?: string;
  telephone?: string;
  email?: string;
  site?: string;
  description?: string;
  source?: string;
};

type ActualiteResult = {
  titre: string;
  source: string;
  url: string;
  date?: string;
  resume: string;
  pertinence?: string;
};

type MarcheResult = {
  titre: string;
  detail: string;
  source?: string;
  impact?: string;
};

type SearchData = {
  type: string;
  query: string;
  results: (ProspectResult | ActualiteResult | MarcheResult)[];
  total: number;
  tip?: string;
};

type ResearchStudioProps = {
  workflowId?: string;
  stepId?: string;
  brandKit?: BrandKit | null;
};

export function ResearchStudio({
  workflowId,
  stepId,
  brandKit,
}: ResearchStudioProps) {
  const [searchType, setSearchType] = useState<SearchType>("prospects");
  const [query, setQuery] = useState("");
  const [city, setCity] = useState(brandKit?.city ?? "Casablanca");
  const [sector, setSector] = useState(brandKit?.sector ?? "");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SearchData | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [completingStep, setCompletingStep] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState<string | null>(null);

  async function handleCompleteStep() {
    if (!workflowId || !stepId || !data) return;
    setCompletingStep(true);
    const firstProspect =
      data.type === "prospects" && data.results.length > 0
        ? (data.results[0] as ProspectResult)
        : null;
    const chosenName = selectedProspect ?? firstProspect?.nom ?? "";
    const chosenSector = firstProspect?.secteur ?? query;
    await completeWorkflowStep(workflowId, stepId, {
      searchType,
      query,
      city,
      results: data,
      prospectName: chosenName,
      prospectSector: chosenSector,
    });
    router.push(`/workflows/${workflowId}`);
  }

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    setData(null);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch("/api/agents/nour/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ searchType, query, city, sector }),
      });
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      } else {
        setError("Erreur lors de la recherche. Réessayez.");
      }
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!data) return;
    const content = `## Recherche ${data.type} — ${data.query}\n\n${data.results
      .map((r) =>
        Object.entries(r)
          .filter(([, v]) => v)
          .map(([k, v]) => `**${k}:** ${v}`)
          .join("\n"),
      )
      .join("\n\n---\n\n")}\n\n💡 **Conseil :** ${data.tip}`;

    await saveLivrable({
      agentSlug: "nour",
      title: `Recherche ${data.type} — ${data.query} (${city})`,
      content,
    });
    setSaved(true);
  }

  return (
    <div className="min-h-screen bg-[#0F1117] text-white">
      {/* Header */}
      <div className="border-b border-[#2A2D3E] bg-[#1C1F2E]/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-700 flex items-center justify-center text-sm font-bold">
            N
          </div>
          <div>
            <h1
              className="font-semibold text-sm text-white"
              style={{ fontFamily: "'Bricolage Grotesque', Inter, sans-serif" }}
            >
              Studio Nour
            </h1>
            <p className="text-xs text-gray-500">
              ResearchStudio — Veille & recherche web en temps réel
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {data && !saved && (
              <button
                onClick={handleSave}
                className="text-xs bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Enregistrer les résultats
              </button>
            )}
            {saved && (
              <span className="text-xs text-emerald-400 font-medium">
                ✓ Enregistré
              </span>
            )}
            {workflowId && stepId && data && (
              <button
                onClick={handleCompleteStep}
                disabled={completingStep}
                className="text-xs bg-[#7C5CFC] hover:bg-[#6B4FDB] disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {completingStep ? "En cours…" : "Terminer cette étape →"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Formulaire (2/5) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Type de recherche */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Type de recherche
            </h2>
            <div className="space-y-2">
              {searchTypes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSearchType(t.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    searchType === t.id
                      ? "border-pink-500 bg-pink-500/10"
                      : "border-[#2A2D3E] bg-[#1C1F2E] hover:border-[#3A3D4E]"
                  }`}
                >
                  <span className="text-lg">{t.emoji}</span>
                  <div>
                    <p className="text-sm font-medium text-white">{t.label}</p>
                    <p className="text-xs text-gray-500">{t.desc}</p>
                  </div>
                  {searchType === t.id && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-pink-400" />
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Recherche */}
          <section className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              {searchType === "prospects"
                ? "Type de prospect"
                : searchType === "concurrents"
                  ? "Secteur concurrent"
                  : searchType === "actualites"
                    ? "Sujet à surveiller"
                    : "Marché à analyser"}
            </label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                searchType === "prospects"
                  ? "Ex : cabinets comptables, promoteurs immobiliers…"
                  : searchType === "concurrents"
                    ? "Ex : expertise comptable, audit financier…"
                    : searchType === "actualites"
                      ? "Ex : TVA Maroc, transformation digitale PME…"
                      : "Ex : marché immobilier, e-commerce Maroc…"
              }
              className="w-full bg-[#1C1F2E] border border-[#2A2D3E] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </section>

          {/* Ville */}
          <section className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Ville
            </label>
            <div className="flex flex-wrap gap-2">
              {moroccanCities.map((c) => (
                <button
                  key={c}
                  onClick={() => setCity(c)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                    city === c
                      ? "border-pink-500 bg-pink-500/20 text-pink-300"
                      : "border-[#2A2D3E] text-gray-400 hover:border-gray-500"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </section>

          {/* Secteur */}
          <section className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Secteur{" "}
              <span className="text-gray-600 font-normal normal-case">
                (optionnel)
              </span>
            </label>
            <input
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              placeholder="Ex : immobilier, agroalimentaire, tech…"
              className="w-full bg-[#1C1F2E] border border-[#2A2D3E] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </section>

          <button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-pink-600 hover:bg-pink-500 text-white"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Nour recherche sur internet…
              </span>
            ) : (
              `Rechercher ${searchType === "prospects" ? "des prospects" : searchType === "concurrents" ? "des concurrents" : searchType === "actualites" ? "des actualités" : "le marché"}`
            )}
          </button>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>

        {/* Résultats (3/5) */}
        <div className="lg:col-span-3">
          {data ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ResultCards
                data={data}
                selectedProspect={workflowId ? selectedProspect : null}
                onSelectProspect={workflowId ? setSelectedProspect : undefined}
              />
            </div>
          ) : (
            <div className="h-full min-h-64 flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-[#2A2D3E] p-12">
              <div className="w-14 h-14 rounded-2xl bg-[#1C1F2E] flex items-center justify-center text-2xl mb-4">
                🔍
              </div>
              <p className="text-gray-400 text-sm font-medium">
                Les résultats apparaîtront ici
              </p>
              <p className="text-gray-600 text-xs mt-1">
                Nour cherche sur internet en temps réel
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
