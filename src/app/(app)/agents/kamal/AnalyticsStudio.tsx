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
    <label className={labelClass}>Données clés</label>
    {domaine === "Finance & Trésorerie" && (
      <div className="grid grid-cols-2 gap-2">
        {[
          { key: "ca", label: "CA (MAD)", placeholder: "ex: 120 000" },
          { key: "charges", label: "Charges (MAD)", placeholder: "ex: 85 000" },
          { key: "marge", label: "Marge brute (%)", placeholder: "ex: 29" },
          { key: "impayes", label: "Impayés (MAD)", placeholder: "ex: 15 000" },
          { key: "clients", label: "Clients actifs", placeholder: "ex: 34" },
          { key: "tresorerie", label: "Trésorerie (MAD)", placeholder: "ex: 45 000" },
        ].map(f => (
          <div key={f.key}>
            <label className="block text-xs text-white/40 mb-1">{f.label}</label>
            <input className={inputClass} placeholder={f.placeholder}
              onChange={e => setDonnees(prev => {
                const lines = prev.split("\n").filter(l => !l.startsWith(f.label));
                return [...lines, `${f.label} : ${e.target.value}`].filter(Boolean).join("\n");
              })} />
          </div>
        ))}
      </div>
    )}
    {domaine === "Commercial & Ventes" && (
      <div className="grid grid-cols-2 gap-2">
        {[
          { key: "ventes", label: "Ventes (MAD)", placeholder: "ex: 45 000" },
          { key: "objectif", label: "Objectif (MAD)", placeholder: "ex: 60 000" },
          { key: "nouveaux", label: "Nouveaux clients", placeholder: "ex: 8" },
          { key: "conversion", label: "Taux conversion (%)", placeholder: "ex: 12" },
          { key: "panier", label: "Panier moyen (MAD)", placeholder: "ex: 1 200" },
          { key: "prospects", label: "Prospects contactés", placeholder: "ex: 65" },
        ].map(f => (
          <div key={f.key}>
            <label className="block text-xs text-white/40 mb-1">{f.label}</label>
            <input className={inputClass} placeholder={f.placeholder}
              onChange={e => setDonnees(prev => {
                const lines = prev.split("\n").filter(l => !l.startsWith(f.label));
                return [...lines, `${f.label} : ${e.target.value}`].filter(Boolean).join("\n");
              })} />
          </div>
        ))}
      </div>
    )}
    {domaine === "Marketing & Communication" && (
      <div className="grid grid-cols-2 gap-2">
        {[
          { key: "budget", label: "Budget dépensé (MAD)", placeholder: "ex: 5 000" },
          { key: "leads", label: "Leads générés", placeholder: "ex: 120" },
          { key: "ouverture", label: "Taux ouverture email (%)", placeholder: "ex: 22" },
          { key: "followers", label: "Nouveaux followers", placeholder: "ex: 150" },
          { key: "reach", label: "Portée posts", placeholder: "ex: 8 500" },
          { key: "cpl", label: "Coût par lead (MAD)", placeholder: "ex: 42" },
        ].map(f => (
          <div key={f.key}>
            <label className="block text-xs text-white/40 mb-1">{f.label}</label>
            <input className={inputClass} placeholder={f.placeholder}
              onChange={e => setDonnees(prev => {
                const lines = prev.split("\n").filter(l => !l.startsWith(f.label));
                return [...lines, `${f.label} : ${e.target.value}`].filter(Boolean).join("\n");
              })} />
          </div>
        ))}
      </div>
    )}
    {domaine === "RH & Équipe" && (
      <div className="grid grid-cols-2 gap-2">
        {[
          { key: "effectif", label: "Effectif total", placeholder: "ex: 12" },
          { key: "absences", label: "Jours d'absence", placeholder: "ex: 8" },
          { key: "turnover", label: "Turnover (%)", placeholder: "ex: 8" },
          { key: "heures", label: "Heures sup (h)", placeholder: "ex: 45" },
          { key: "recrutements", label: "Recrutements", placeholder: "ex: 2" },
          { key: "formation", label: "Jours formation", placeholder: "ex: 3" },
        ].map(f => (
          <div key={f.key}>
            <label className="block text-xs text-white/40 mb-1">{f.label}</label>
            <input className={inputClass} placeholder={f.placeholder}
              onChange={e => setDonnees(prev => {
                const lines = prev.split("\n").filter(l => !l.startsWith(f.label));
                return [...lines, `${f.label} : ${e.target.value}`].filter(Boolean).join("\n");
              })} />
          </div>
        ))}
      </div>
    )}
    {domaine === "Service client" && (
      <div className="grid grid-cols-2 gap-2">
        {[
          { key: "reclamations", label: "Réclamations", placeholder: "ex: 14" },
          { key: "delai", label: "Délai réponse moyen (h)", placeholder: "ex: 4" },
          { key: "satisfaction", label: "Satisfaction (/5)", placeholder: "ex: 3.8" },
          { key: "resolus", label: "Tickets résolus (%)", placeholder: "ex: 89" },
          { key: "recontacts", label: "Recontacts clients", placeholder: "ex: 6" },
          { key: "nps", label: "NPS score", placeholder: "ex: 42" },
        ].map(f => (
          <div key={f.key}>
            <label className="block text-xs text-white/40 mb-1">{f.label}</label>
            <input className={inputClass} placeholder={f.placeholder}
              onChange={e => setDonnees(prev => {
                const lines = prev.split("\n").filter(l => !l.startsWith(f.label));
                return [...lines, `${f.label} : ${e.target.value}`].filter(Boolean).join("\n");
              })} />
          </div>
        ))}
      </div>
    )}
    {!["Finance & Trésorerie","Commercial & Ventes","Marketing & Communication","RH & Équipe","Service client"].includes(domaine) && (
      <textarea
        className={`${inputClass} resize-none h-24`}
        placeholder="ex: Indiquez vos chiffres clés — volumes, montants MAD, pourcentages, objectifs vs réalisé..."
        value={donnees}
        onChange={e => setDonnees(e.target.value)}
      />
    )}
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