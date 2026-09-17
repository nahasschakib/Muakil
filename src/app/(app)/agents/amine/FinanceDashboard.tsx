"use client";

type Indicateur = {
  nom: string;
  valeur: string;
  statut: "bon" | "attention" | "critique";
  interpretation: string;
  benchmark: string;
};

type Recommandation = {
  priorite: "haute" | "moyenne" | "faible";
  action: string;
  impact: string;
  delai: string;
};

type Analysis = {
  resume: string;
  indicateurs: Indicateur[];
  ratios: {
    rentabilite: { margeNette: string; margeBreute: string; roi: string; statut: string };
    liquidite: { liquiditeGenerale: string; liquiditeReduite: string; tresorerieNette: string; statut: string };
    solvabilite: { autonomieFinanciere: string; endettement: string; capaciteRemboursement: string; statut: string };
  };
  forces: string[];
  risques: string[];
  recommandations: Recommandation[];
  conformiteCGNC: { observations: string; alertes: string[] };
  scoreFinancier: number;
  tip: string;
};

type Props = { analysis: Analysis; periode: string; brandName?: string };

const statutConfig = {
  bon: { bg: "bg-emerald-500/10 border-emerald-500/30", text: "text-emerald-400", dot: "bg-emerald-400", label: "Bon" },
  attention: { bg: "bg-amber-500/10 border-amber-500/30", text: "text-amber-400", dot: "bg-amber-400", label: "Attention" },
  critique: { bg: "bg-red-500/10 border-red-500/30", text: "text-red-400", dot: "bg-red-400", label: "Critique" },
};

const prioriteConfig = {
  haute: { bg: "bg-red-500/20 text-red-300 border-red-500/30", label: "🔴 Haute" },
  moyenne: { bg: "bg-amber-500/20 text-amber-300 border-amber-500/30", label: "🟡 Moyenne" },
  faible: { bg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", label: "🟢 Faible" },
};

function ScoreGauge({ score }: { score: number }) {
  const color = score >= 70 ? "#10b981" : score >= 40 ? "#f59e0b" : "#ef4444";
  const label = score >= 70 ? "Bonne santé" : score >= 40 ? "À surveiller" : "Situation critique";

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#1C1F2E" strokeWidth="12" />
          <circle
            cx="50" cy="50" r="40" fill="none"
            stroke={color} strokeWidth="12"
            strokeDasharray={`${(score / 100) * 251} 251`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">{score}</span>
          <span className="text-xs text-gray-400">/100</span>
        </div>
      </div>
      <p className="text-sm font-medium mt-2" style={{ color }}>{label}</p>
    </div>
  );
}

export function FinanceDashboard({ analysis, periode, brandName }: Props) {
  return (
    <div className="space-y-4">
      {/* Header score */}
      <div className="bg-[#1C1F2E] border border-[#2A2D3E] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Rapport financier</p>
            <h2 className="text-white font-bold">{brandName || "Votre entreprise"}</h2>
            <p className="text-xs text-gray-500">Période : {periode}</p>
          </div>
          <ScoreGauge score={analysis.scoreFinancier} />
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">{analysis.resume}</p>
      </div>

      {/* Ratios — 3 blocs */}
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(analysis.ratios).map(([key, ratio]) => {
          const cfg = statutConfig[ratio.statut as keyof typeof statutConfig] || statutConfig.attention;
          const labels: Record<string, string> = { rentabilite: "Rentabilité", liquidite: "Liquidité", solvabilite: "Solvabilité" };
          const entries = Object.entries(ratio).filter(([k]) => k !== "statut");
          return (
            <div key={key} className={`border rounded-xl p-3 ${cfg.bg}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                <span className={`text-xs font-semibold ${cfg.text}`}>{labels[key]}</span>
              </div>
              {entries.map(([k, v]) => (
                <div key={k} className="flex justify-between text-xs py-0.5">
                  <span className="text-gray-500 capitalize">{k.replace(/([A-Z])/g, " $1").toLowerCase()}</span>
                  <span className="text-white font-medium">{v as string}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Indicateurs */}
      <div className="bg-[#1C1F2E] border border-[#2A2D3E] rounded-2xl p-5">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Indicateurs clés</h3>
        <div className="space-y-3">
          {analysis.indicateurs.map((ind, i) => {
            const cfg = statutConfig[ind.statut] || statutConfig.attention;
            return (
              <div key={i} className={`border rounded-xl p-3 ${cfg.bg}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-white">{ind.nom}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${cfg.text}`}>{ind.valeur}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400">{ind.interpretation}</p>
                <p className="text-xs text-gray-500 mt-0.5">📊 {ind.benchmark}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Forces & Risques */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-2">✅ Forces</h3>
          <ul className="space-y-1">
            {analysis.forces.map((f, i) => (
              <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                <span className="text-emerald-500 flex-shrink-0">•</span>{f}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-red-400 uppercase tracking-widest mb-2">⚠️ Risques</h3>
          <ul className="space-y-1">
            {analysis.risques.map((r, i) => (
              <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                <span className="text-red-500 flex-shrink-0">•</span>{r}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommandations */}
      <div className="bg-[#1C1F2E] border border-[#2A2D3E] rounded-2xl p-5">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Plan d'action</h3>
        <div className="space-y-3">
          {analysis.recommandations.map((r, i) => {
            const cfg = prioriteConfig[r.priorite] || prioriteConfig.moyenne;
            return (
              <div key={i} className="border border-[#2A2D3E] rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${cfg.bg}`}>{cfg.label}</span>
                  <span className="text-xs text-gray-500">⏱ {r.delai}</span>
                </div>
                <p className="text-sm text-white font-medium mt-1">{r.action}</p>
                <p className="text-xs text-gray-400 mt-0.5">Impact : {r.impact}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Conformité CGNC */}
      {analysis.conformiteCGNC && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-2">📋 Conformité CGNC</h3>
          <p className="text-xs text-gray-300 mb-2">{analysis.conformiteCGNC.observations}</p>
          {analysis.conformiteCGNC.alertes?.map((a, i) => (
            <p key={i} className="text-xs text-amber-300">⚠ {a}</p>
          ))}
        </div>
      )}

      {/* Conseil Amine */}
      {analysis.tip && (
        <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-4">
          <p className="text-xs text-teal-400 font-semibold mb-1">💡 Conseil d'Amine</p>
          <p className="text-sm text-teal-200/80">{analysis.tip}</p>
        </div>
      )}
    </div>
  );
}
