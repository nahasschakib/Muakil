"use client";

import { useState } from "react";
import { FinanceDashboard } from "./FinanceDashboard";
import { saveLivrable } from "@/app/(app)/livrables/actions";
import { useOrganization } from "@clerk/nextjs";

type AnalysisType = "complet" | "rentabilite" | "tresorerie" | "bilan";

const analysisTypes: { id: AnalysisType; emoji: string; label: string; desc: string }[] = [
  { id: "complet", emoji: "📊", label: "Analyse complète", desc: "Tous les ratios et indicateurs" },
  { id: "rentabilite", emoji: "💰", label: "Rentabilité", desc: "Marges, ROI, résultats" },
  { id: "tresorerie", emoji: "💧", label: "Trésorerie", desc: "Liquidité, flux de trésorerie" },
  { id: "bilan", emoji: "⚖️", label: "Bilan", desc: "Solvabilité, dettes, capitaux" },
];

const periodes = ["Janvier 2026", "T1 2026", "S1 2026", "Année 2025", "Année 2026"];

type Analysis = any;

export function FinanceStudio({ brandName }: { brandName?: string }) {
  const { organization } = useOrganization();
  const [analysisType, setAnalysisType] = useState<AnalysisType>("complet");
  const [periode, setPeriode] = useState("Année 2025");
  const [ca, setCa] = useState("");
  const [chargesExploitation, setChargesExploitation] = useState("");
  const [resultatNet, setResultatNet] = useState("");
  const [tresorerie, setTresorerie] = useState("");
  const [dettes, setDettes] = useState("");
  const [capitauxPropres, setCapitauxPropres] = useState("");
  const [creances, setCreances] = useState("");
  const [stocks, setStocks] = useState("");
  const [immobilisations, setImmobilisations] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function fmt(val: string) {
    return val ? `${Number(val).toLocaleString("fr-MA")} MAD` : "0 MAD";
  }

  async function handleAnalyze() {
    if (!ca || !chargesExploitation || !resultatNet) return;
    setLoading(true);
    setAnalysis(null);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch("/api/agents/amine/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          periode, analysisType, ca, chargesExploitation, resultatNet,
          tresorerie, dettes, capitauxPropres, creances, stocks, immobilisations,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAnalysis(data.analysis);
      } else {
        setError("Erreur lors de l'analyse. Réessayez.");
      }
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!analysis) return;
    const content = `## Rapport financier — ${periode}

**Score financier : ${analysis.scoreFinancier}/100**

${analysis.resume}

## Ratios
- Marge nette : ${analysis.ratios.rentabilite.margeNette}
- Liquidité générale : ${analysis.ratios.liquidite.liquiditeGenerale}
- Autonomie financière : ${analysis.ratios.solvabilite.autonomieFinanciere}

## Forces
${analysis.forces.map((f: string) => `- ${f}`).join("\n")}

## Risques
${analysis.risques.map((r: string) => `- ${r}`).join("\n")}

## Plan d'action
${analysis.recommandations.map((r: any) => `- [${r.priorite.toUpperCase()}] ${r.action} (${r.delai})`).join("\n")}

💡 **Conseil :** ${analysis.tip}`;

    await saveLivrable({
      agentSlug: "amine",
      title: `Analyse financière — ${periode} — Score ${analysis.scoreFinancier}/100`,
      content,
    });
    setSaved(true);
  }

  return (
    <div className="min-h-screen bg-[#0F1117] text-white">
      {/* Header */}
      <div className="border-b border-[#2A2D3E] bg-[#1C1F2E]/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-700 flex items-center justify-center text-sm font-bold">
            A
          </div>
          <div>
            <h1 className="font-semibold text-sm text-white" style={{ fontFamily: "'Bricolage Grotesque', Inter, sans-serif" }}>
              Studio Amine
            </h1>
            <p className="text-xs text-gray-500">FinanceStudio — Analyse financière & tableaux de bord CGNC</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {analysis && !saved && (
              <button onClick={handleSave} className="text-xs bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Enregistrer le rapport
              </button>
            )}
            {saved && <span className="text-xs text-emerald-400 font-medium">✓ Enregistré</span>}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* Formulaire (2/5) */}
        <div className="lg:col-span-2 space-y-5">

          {/* Type d'analyse */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Type d'analyse</h2>
            <div className="space-y-2">
              {analysisTypes.map((t) => (
                <button key={t.id} onClick={() => setAnalysisType(t.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    analysisType === t.id ? "border-teal-500 bg-teal-500/10" : "border-[#2A2D3E] bg-[#1C1F2E] hover:border-[#3A3D4E]"
                  }`}>
                  <span className="text-lg">{t.emoji}</span>
                  <div>
                    <p className="text-sm font-medium text-white">{t.label}</p>
                    <p className="text-xs text-gray-500">{t.desc}</p>
                  </div>
                  {analysisType === t.id && <span className="ml-auto w-2 h-2 rounded-full bg-teal-400" />}
                </button>
              ))}
            </div>
          </section>

          {/* Période */}
          <section className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Période</label>
            <div className="flex flex-wrap gap-2">
              {periodes.map((p) => (
                <button key={p} onClick={() => setPeriode(p)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                    periode === p ? "border-teal-500 bg-teal-500/20 text-teal-300" : "border-[#2A2D3E] text-gray-400 hover:border-gray-500"
                  }`}>
                  {p}
                </button>
              ))}
            </div>
          </section>

          {/* Compte de résultat */}
          <section className="space-y-2">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Compte de résultat</h2>
            {[
              { label: "Chiffre d'affaires (HT)", value: ca, set: setCa, placeholder: "Ex : 1200000" },
              { label: "Charges d'exploitation", value: chargesExploitation, set: setChargesExploitation, placeholder: "Ex : 850000" },
              { label: "Résultat net", value: resultatNet, set: setResultatNet, placeholder: "Ex : 280000" },
            ].map((field) => (
              <div key={field.label}>
                <label className="text-xs text-gray-500 mb-1 block">{field.label}</label>
                <div className="relative">
                  <input type="number" value={field.value} onChange={(e) => field.set(e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full bg-[#1C1F2E] border border-[#2A2D3E] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-teal-500 transition-colors pr-14" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">MAD</span>
                </div>
                {field.value && <p className="text-xs text-teal-400 mt-0.5">{fmt(field.value)}</p>}
              </div>
            ))}
          </section>

          {/* Bilan */}
          <section className="space-y-2">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Bilan</h2>
            {[
              { label: "Trésorerie", value: tresorerie, set: setTresorerie, placeholder: "Ex : 150000" },
              { label: "Créances clients", value: creances, set: setCreances, placeholder: "Ex : 200000" },
              { label: "Stocks", value: stocks, set: setStocks, placeholder: "Ex : 80000" },
              { label: "Immobilisations", value: immobilisations, set: setImmobilisations, placeholder: "Ex : 500000" },
              { label: "Dettes totales", value: dettes, set: setDettes, placeholder: "Ex : 300000" },
              { label: "Capitaux propres", value: capitauxPropres, set: setCapitauxPropres, placeholder: "Ex : 700000" },
            ].map((field) => (
              <div key={field.label}>
                <label className="text-xs text-gray-500 mb-1 block">{field.label}</label>
                <div className="relative">
                  <input type="number" value={field.value} onChange={(e) => field.set(e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full bg-[#1C1F2E] border border-[#2A2D3E] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-teal-500 transition-colors pr-14" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">MAD</span>
                </div>
                {field.value && <p className="text-xs text-teal-400 mt-0.5">{fmt(field.value)}</p>}
              </div>
            ))}
          </section>

          <button onClick={handleAnalyze} disabled={loading || !ca || !chargesExploitation || !resultatNet}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-teal-600 hover:bg-teal-500 text-white">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Amine analyse vos données…
              </span>
            ) : "Analyser les finances"}
          </button>

          {error && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
        </div>

        {/* Dashboard (3/5) */}
        <div className="lg:col-span-3">
          {analysis ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <FinanceDashboard analysis={analysis} periode={periode} brandName={brandName || organization?.name} />
            </div>
          ) : (
            <div className="h-full min-h-64 flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-[#2A2D3E] p-12">
              <div className="w-14 h-14 rounded-2xl bg-[#1C1F2E] flex items-center justify-center text-2xl mb-4">📊</div>
              <p className="text-gray-400 text-sm font-medium">Votre tableau de bord apparaîtra ici</p>
              <p className="text-gray-600 text-xs mt-1">Saisissez vos données financières et lancez l'analyse</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
