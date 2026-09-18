"use client";

import { useState } from "react";
import CreativePreview from "./CreativePreview";

const EMOTIONS = ["Confiance", "Fierté", "Urgence", "Appartenance", "Aspiration", "Sécurité", "Joie", "Exclusivité"];
const FORMATS = ["Affiche / Flyer", "Bannière web", "Story Instagram", "Annonce presse", "Spot radio", "SMS marketing", "Panneau publicitaire"];
const OUTPUTS = [
  { id: "slogan", label: "Slogans", icon: "✨" },
  { id: "brief", label: "Brief créatif", icon: "📋" },
  { id: "pub", label: "Texte pub", icon: "📢" },
];

export default function CreativeStudio({ orgId }: { orgId: string }) {
  const [produit, setProduit] = useState("");
  const [cible, setCible] = useState("");
  const [emotion, setEmotion] = useState(EMOTIONS[0]);
  const [format, setFormat] = useState(FORMATS[0]);
  const [typeOutput, setTypeOutput] = useState("slogan");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  const generate = async () => {
    if (!produit.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/agents/imane/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ produit, cible, emotion, format, typeOutput }),
      });
      const data = await res.json();
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-[#1C1F2E] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50";
  const labelClass = "block text-xs font-medium text-white/60 mb-1";

  return (
    <div className="min-h-screen bg-[#0F1117] text-white">
      <div className="border-b border-white/10 px-6 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-fuchsia-500/20 flex items-center justify-center text-lg">🎨</div>
        <div>
          <h1 className="font-semibold text-white">Imane — Creative Studio</h1>
          <p className="text-xs text-white/40">Slogans · Brief créatif · Textes publicitaires</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        <div className="space-y-4">
          <div>
            <p className={labelClass}>Type de création</p>
            <div className="grid grid-cols-3 gap-2">
              {OUTPUTS.map(o => (
                <button
                  key={o.id}
                  onClick={() => { setTypeOutput(o.id); setResult(null); }}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border text-xs font-medium transition-all ${typeOutput === o.id ? "bg-fuchsia-500/20 border-fuchsia-500/50 text-fuchsia-300" : "border-white/10 text-white/50 hover:border-white/20"}`}
                >
                  <span className="text-lg">{o.icon}</span>
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>Produit / Service *</label>
            <input
              className={inputClass}
              placeholder="ex: Assurance auto, formation en ligne, restaurant livraison..."
              value={produit}
              onChange={e => setProduit(e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>Cible visée</label>
            <input
              className={inputClass}
              placeholder="ex: Jeunes actifs 25-35 ans Casablanca, mères de famille, dirigeants PME..."
              value={cible}
              onChange={e => setCible(e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>Émotion visée</label>
            <div className="grid grid-cols-4 gap-2">
              {EMOTIONS.map(e => (
                <button
                  key={e}
                  onClick={() => setEmotion(e)}
                  className={`py-2 rounded-lg border text-xs font-medium transition-all ${emotion === e ? "bg-fuchsia-500/20 border-fuchsia-500/50 text-fuchsia-300" : "border-white/10 text-white/50 hover:border-white/20"}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {(typeOutput === "brief" || typeOutput === "pub") && (
            <div>
              <label className={labelClass}>Format</label>
              <select className={inputClass} value={format} onChange={e => setFormat(e.target.value)}>
                {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          )}

          <button
            onClick={generate}
            disabled={loading || !produit.trim()}
            className="w-full py-3 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all"
          >
            {loading ? "Imane crée..." : `Générer ${OUTPUTS.find(o => o.id === typeOutput)?.label}`}
          </button>
        </div>

        <div className="bg-[#1C1F2E] rounded-xl p-4 min-h-[500px] overflow-y-auto">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-white/40">
              <div className="w-8 h-8 border-2 border-fuchsia-500/30 border-t-fuchsia-500 rounded-full animate-spin" />
              <p className="text-sm">Imane imagine votre campagne...</p>
            </div>
          ) : (
            <CreativePreview data={result} typeOutput={typeOutput} />
          )}
        </div>
      </div>
    </div>
  );
}