"use client";

import { useState } from "react";
import DeckPreview from "./DeckPreview";

const AUDIENCES = ["Investisseurs", "Client prospect", "Partenaire commercial", "Équipe interne", "Direction / Associés", "Banque / Financement", "Appel d'offres public"];
const OUTPUTS = [
  { id: "pitch", label: "Pitch Deck", icon: "🚀" },
  { id: "client", label: "Présentation client", icon: "🤝" },
  { id: "rapport", label: "Compte-rendu", icon: "📝" },
];

export default function DeckStudio({ orgId }: { orgId: string }) {
  const [sujet, setSujet] = useState("");
  const [audience, setAudience] = useState(AUDIENCES[1]);
  const [objectif, setObjectif] = useState("");
  const [contexte, setContexte] = useState("");
  const [typeOutput, setTypeOutput] = useState("pitch");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  const generate = async () => {
    if (!sujet.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/agents/reda/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sujet, audience, objectif, contexte, typeOutput }),
      });
      const data = await res.json();
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-[#1C1F2E] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500/50";
  const labelClass = "block text-xs font-medium text-white/60 mb-1";

  return (
    <div className="min-h-screen bg-[#0F1117] text-white">
      <div className="border-b border-white/10 px-6 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-violet-500/20 flex items-center justify-center text-lg">📊</div>
        <div>
          <h1 className="font-semibold text-white">Reda — Deck Studio</h1>
          <p className="text-xs text-white/40">Pitch Deck · Présentation client · Compte-rendu</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        <div className="space-y-4">
          <div>
            <p className={labelClass}>Type de présentation</p>
            <div className="grid grid-cols-3 gap-2">
              {OUTPUTS.map(o => (
                <button
                  key={o.id}
                  onClick={() => setTypeOutput(o.id)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border text-xs font-medium transition-all ${typeOutput === o.id ? "bg-violet-500/20 border-violet-500/50 text-violet-300" : "border-white/10 text-white/50 hover:border-white/20"}`}
                >
                  <span className="text-lg">{o.icon}</span>
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>
              {typeOutput === "rapport" ? "Intitulé de la réunion *" : "Sujet de la présentation *"}
            </label>
            <input
              className={inputClass}
              placeholder={typeOutput === "rapport" ? "ex: Réunion bilan Q3 équipe commerciale" : "ex: Lancement nouveau service livraison B2B"}
              value={sujet}
              onChange={e => setSujet(e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>
              {typeOutput === "rapport" ? "Participants" : "Audience"}
            </label>
            {typeOutput === "rapport" ? (
              <input
                className={inputClass}
                placeholder="ex: Directeur commercial, 3 commerciaux, RH"
                value={audience}
                onChange={e => setAudience(e.target.value)}
              />
            ) : (
              <select className={inputClass} value={audience} onChange={e => setAudience(e.target.value)}>
                {AUDIENCES.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            )}
          </div>

          <div>
            <label className={labelClass}>Objectif</label>
            <input
              className={inputClass}
              placeholder="ex: Convaincre d'investir, signer un contrat, valider une roadmap..."
              value={objectif}
              onChange={e => setObjectif(e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>Contexte / points clés</label>
            <textarea
              className={`${inputClass} resize-none h-20`}
              placeholder="ex: Budget 200k MAD, délai 3 mois, concurrent principal est X..."
              value={contexte}
              onChange={e => setContexte(e.target.value)}
            />
          </div>

          <button
            onClick={generate}
            disabled={loading || !sujet.trim()}
            className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all"
          >
            {loading ? "Reda prépare les slides..." : `Générer ${OUTPUTS.find(o => o.id === typeOutput)?.label}`}
          </button>
        </div>

        <div className="bg-[#1C1F2E] rounded-xl p-4 min-h-[500px] overflow-y-auto">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-white/40">
              <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
              <p className="text-sm">Reda structure la présentation...</p>
            </div>
          ) : (
            <DeckPreview data={result} />
          )}
        </div>
      </div>
    </div>
  );
}