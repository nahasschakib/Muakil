"use client";

import { useState } from "react";
import SupportPreview from "./SupportPreview";

const CANAUX = ["Email", "WhatsApp", "Téléphone", "Facebook", "Instagram", "En personne"];
const TONS = ["Professionnel", "Chaleureux", "Formel", "Décontracté"];
const LANGUES = ["Français", "Darija (arabe marocain)", "Arabe classique", "Français + Darija"];
const OUTPUTS = [
  { id: "reclamation", label: "Réclamation", icon: "📨" },
  { id: "faq", label: "FAQ", icon: "❓" },
  { id: "script", label: "Script appel", icon: "📞" },
];

export default function SupportStudio({ orgId, tone }: { orgId: string; tone?: string | null }) {
  const [situation, setSituation] = useState("");
  const [canal, setCanal] = useState(CANAUX[0]);
 const [ton, setTon] = useState(
    (tone && TONS.includes(tone)) ? tone : TONS[0]
  );
  const [langue, setLangue] = useState(LANGUES[0]);
  const [typeOutput, setTypeOutput] = useState("reclamation");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  const generate = async () => {
    if (!situation.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/agents/fatima/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation, canal, ton, langue, typeOutput }),
      });
      const data = await res.json();
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-[#1C1F2E] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/50";
  const labelClass = "block text-xs font-medium text-white/60 mb-1";

  const placeholder: Record<string, string> = {
    reclamation: "ex: Client mécontent d'un retard de livraison de 5 jours, commande importante...",
    faq: "ex: Livraison et retours pour une boutique en ligne de vêtements...",
    script: "ex: Relance client impayé, facture en retard de 30 jours...",
  };

  return (
    <div className="min-h-screen bg-[#0F1117] text-white">
      <div className="border-b border-white/10 px-6 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center text-lg">🎧</div>
        <div>
          <h1 className="font-semibold text-white">Fatima — Support Studio</h1>
          <p className="text-xs text-white/40">Réclamations · FAQ · Scripts &apos;appel</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        <div className="space-y-4">
          <div>
            <p className={labelClass}>Type de document</p>
            <div className="grid grid-cols-3 gap-2">
              {OUTPUTS.map(o => (
                <button
                  key={o.id}
                  onClick={() => { setTypeOutput(o.id); setResult(null); }}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border text-xs font-medium transition-all ${typeOutput === o.id ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300" : "border-white/10 text-white/50 hover:border-white/20"}`}
                >
                  <span className="text-lg">{o.icon}</span>
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>
              {typeOutput === "reclamation" ? "Situation / réclamation *" :
               typeOutput === "faq" ? "Domaine / thématique *" : "Objectif de l'appel *"}
            </label>
            <textarea
              className={`${inputClass} resize-none h-24`}
              placeholder={placeholder[typeOutput]}
              value={situation}
              onChange={e => setSituation(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Canal</label>
              <select className={inputClass} value={canal} onChange={e => setCanal(e.target.value)}>
                {CANAUX.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Langue</label>
              <select className={inputClass} value={langue} onChange={e => setLangue(e.target.value)}>
                {LANGUES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {typeOutput !== "faq" && (
            <div>
              <label className={labelClass}>Ton</label>
              <div className="grid grid-cols-4 gap-2">
                {TONS.map(t => (
                  <button
                    key={t}
                    onClick={() => setTon(t)}
                    className={`py-2 rounded-lg border text-xs font-medium transition-all ${ton === t ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300" : "border-white/10 text-white/50 hover:border-white/20"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={generate}
            disabled={loading || !situation.trim()}
            className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all"
          >
            {loading ? "Fatima rédige..." : `Générer ${OUTPUTS.find(o => o.id === typeOutput)?.label}`}
          </button>
        </div>

        <div className="bg-[#1C1F2E] rounded-xl p-4 min-h-[500px] overflow-y-auto">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-white/40">
              <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
              <p className="text-sm">Fatima prépare la réponse...</p>
            </div>
          ) : (
            <SupportPreview data={result} typeOutput={typeOutput} />
          )}
        </div>
      </div>
    </div>
  );
}