"use client";

import { useState } from "react";
import StrategyPreview from "./StrategyPreview";

const SECTEURS = ["Commerce & Distribution", "BTP & Immobilier", "Industrie & Production", "Services & Conseil", "Finance & Assurance", "Santé & Pharmacie", "Transport & Logistique", "IT & Digital", "Tourisme & Hôtellerie", "Agriculture & Agroalimentaire"];
const TAILLES = ["Auto-entrepreneur", "TPE (1-9 salariés)", "PME (10-49 salariés)", "ETI (50-249 salariés)", "Grande entreprise (250+)"];
const DEFIS = ["Acquérir de nouveaux clients", "Fidéliser la clientèle existante", "Améliorer la rentabilité", "Se différencier de la concurrence", "Digitaliser les opérations", "Ouvrir un nouveau marché", "Restructurer l'organisation", "Gérer une crise"];
const OUTPUTS = [
  { id: "swot", label: "Analyse SWOT", icon: "🔍" },
  { id: "plan90", label: "Plan 90 jours", icon: "📅" },
  { id: "positionnement", label: "Positionnement", icon: "🎯" },
];

export default function StrategyStudio({ orgId, sector }: { orgId: string; sector?: string | null }) {
   const [secteur, setSecteur] = useState(
    (sector && SECTEURS.includes(sector)) ? sector : SECTEURS[0]
  );
  const [taille, setTaille] = useState(TAILLES[2]);
  const [defi, setDefi] = useState(DEFIS[0]);
  const [objectif, setObjectif] = useState("");
  const [budget, setBudget] = useState("");
  const [typeOutput, setTypeOutput] = useState("swot");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  const generate = async () => {
    if (!objectif.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/agents/tariq/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secteur, taille, defi, objectif, budget, typeOutput }),
      });
      const data = await res.json();
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-[#1C1F2E] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-slate-400/50";
  const labelClass = "block text-xs font-medium text-white/60 mb-1";

  return (
    <div className="min-h-screen bg-[#0F1117] text-white">
      <div className="border-b border-white/10 px-6 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-slate-500/20 flex items-center justify-center text-lg">🧠</div>
        <div>
          <h1 className="font-semibold text-white">Tariq — Strategy Studio</h1>
          <p className="text-xs text-white/40">SWOT · Plan 90 jours · Positionnement concurrentiel</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        <div className="space-y-4">
          {/* Type de sortie */}
          <div>
            <p className={labelClass}>Type d&apos;analyse</p>
            <div className="grid grid-cols-3 gap-2">
              {OUTPUTS.map(o => (
                <button
                  key={o.id}
                  onClick={() => setTypeOutput(o.id)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border text-xs font-medium transition-all ${typeOutput === o.id ? "bg-slate-500/20 border-slate-400/50 text-slate-300" : "border-white/10 text-white/50 hover:border-white/20"}`}
                >
                  <span className="text-lg">{o.icon}</span>
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Secteur</label>
              <select className={inputClass} value={secteur} onChange={e => setSecteur(e.target.value)}>
                {SECTEURS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Taille entreprise</label>
              <select className={inputClass} value={taille} onChange={e => setTaille(e.target.value)}>
                {TAILLES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Défi principal</label>
            <select className={inputClass} value={defi} onChange={e => setDefi(e.target.value)}>
              {DEFIS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label className={labelClass}>Objectif visé *</label>
            <input
              className={inputClass}
              placeholder="ex: Doubler le CA en 12 mois, conquérir Casablanca..."
              value={objectif}
              onChange={e => setObjectif(e.target.value)}
            />
          </div>

          {typeOutput === "plan90" && (
            <div>
              <label className={labelClass}>Budget disponible</label>
              <input
                className={inputClass}
                placeholder="ex: 50 000 MAD, limité, à définir..."
                value={budget}
                onChange={e => setBudget(e.target.value)}
              />
            </div>
          )}

          <button
            onClick={generate}
            disabled={loading || !objectif.trim()}
            className="w-full py-3 rounded-xl bg-slate-600 hover:bg-slate-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all"
          >
            {loading ? "Tariq analyse..." : `Générer ${OUTPUTS.find(o => o.id === typeOutput)?.label}`}
          </button>
        </div>

        <div className="bg-[#1C1F2E] rounded-xl p-4 min-h-[500px] overflow-y-auto">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-white/40">
              <div className="w-8 h-8 border-2 border-slate-500/30 border-t-slate-400 rounded-full animate-spin" />
              <p className="text-sm">Tariq analyse la situation...</p>
            </div>
          ) : (
            <StrategyPreview data={result} typeOutput={typeOutput} />
          )}
        </div>
      </div>
    </div>
  );
}