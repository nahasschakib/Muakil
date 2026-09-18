"use client";

import { useState } from "react";
import AnalyticsPreview from "./AnalyticsPreview";

const DOMAINES = ["Commercial & Ventes", "Marketing & Communication", "Finance & Trésorerie", "RH & Équipe", "Opérations & Logistique", "Service client", "Production", "Digital & E-commerce"];
const PERIODES = ["Ce mois-ci", "Trimestre en cours", "6 derniers mois", "Année en cours", "Année précédente"];
const OUTPUTS = [
  { id: "kpis", label: "Tableau KPIs", icon: "📊" },
  { id: "analyse", label: "Analyse", icon: "🔍" },
  { id: "rapport", label: "Rapport mensuel", icon: "📋" },
];

export default function AnalyticsStudio({ orgId }: { orgId: string }) {
  const [domaine, setDomaine] = useState(DOMAINES[0]);
  const [periode, setPeriode] = useState(PERIODES[0]);
  const [donnees, setDonnees] = useState("");
  const [objectif, setObjectif] = useState("");
  const [typeOutput, setTypeOutput] = useState("kpis");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  const generate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/agents/kamal/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domaine, periode, donnees, objectif, typeOutput }),
      });
      const data = await res.json();
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-[#1C1F2E] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50";
  const labelClass = "block text-xs font-medium text-white/60 mb-1";

  return (
    <div className="min-h-screen bg-[#0F1117] text-white">
      <div className="border-b border-white/10 px-6 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-orange-500/20 flex items-center justify-center text-lg">📈</div>
        <div>
          <h1 className="font-semibold text-white">Kamal — Analytics Studio</h1>
          <p className="text-xs text-white/40">KPIs · Analyse performance · Rapport mensuel</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        <div className="space-y-4">
          <div>
            <p className={labelClass}>Type d&apos;analyse</p>
            <div className="grid grid-cols-3 gap-2">
              {OUTPUTS.map(o => (
                <button
                  key={o.id}
                  onClick={() => { setTypeOutput(o.id); setResult(null); }}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border text-xs font-medium transition-all ${typeOutput === o.id ? "bg-orange-500/20 border-orange-500/50 text-orange-300" : "border-white/10 text-white/50 hover:border-white/20"}`}
                >
                  <span className="text-lg">{o.icon}</span>
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Domaine</label>
              <select className={inputClass} value={domaine} onChange={e => setDomaine(e.target.value)}>
                {DOMAINES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Période</label>
              <select className={inputClass} value={periode} onChange={e => setPeriode(e.target.value)}>
                {PERIODES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Objectif</label>
            <input
              className={inputClass}
              placeholder="ex: Augmenter les ventes de 20%, réduire les coûts..."
              value={objectif}
              onChange={e => setObjectif(e.target.value)}
            />
          </div>

          {(typeOutput === "analyse" || typeOutput === "rapport") && (
            <div>
              <label className={labelClass}>Données / chiffres disponibles</label>
              <textarea
                className={`${inputClass} resize-none h-24`}
               placeholder={
                    domaine === "Finance & Trésorerie"
                        ? "ex: CA = 120 000 MAD | Charges = 85 000 MAD | Marge = 29% | Impayés = 15 000 MAD | Clients = 34"
                        : domaine === "Commercial & Ventes"
                        ? "ex: Ventes = 45 000 MAD | Objectif = 60 000 MAD | Nouveaux clients = 8 | Taux conversion = 12%"
                        : domaine === "Marketing & Communication"
                        ? "ex: Budget dépensé = 5 000 MAD | Leads générés = 120 | Taux ouverture email = 22% | Followers +150"
                        : domaine === "RH & Équipe"
                        ? "ex: Effectif = 12 | Absences = 3 jours | Turnover = 8% | Heures sup = 45h | Recrutements = 2"
                        : domaine === "Service client"
                        ? "ex: Réclamations = 14 | Délai réponse moyen = 4h | Satisfaction = 3.8/5 | Tickets résolus = 89%"
                        : "ex: Indiquez vos chiffres clés — volumes, montants MAD, pourcentages, objectifs vs réalisé..."
                    }
                value={donnees}
                onChange={e => setDonnees(e.target.value)}
              />
            </div>
          )}

          <button
            onClick={generate}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all"
          >
            {loading ? "Kamal analyse..." : `Générer ${OUTPUTS.find(o => o.id === typeOutput)?.label}`}
          </button>
        </div>

        <div className="bg-[#1C1F2E] rounded-xl p-4 min-h-[500px] overflow-y-auto">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-white/40">
              <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
              <p className="text-sm">Kamal traite les données...</p>
            </div>
          ) : (
            <AnalyticsPreview data={result} typeOutput={typeOutput} />
          )}
        </div>
      </div>
    </div>
  );
}