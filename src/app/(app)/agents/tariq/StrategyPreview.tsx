"use client";

interface StrategyPreviewProps {
  data: Record<string, unknown> | null;
  typeOutput: string;
}

export default function StrategyPreview({ data, typeOutput }: StrategyPreviewProps) {
  if (!data) return (
    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
      L&apos;analyse apparaîtra ici après génération
    </div>
  );

  if (typeOutput === "swot") {
    const d = data as {
      forces: string[]; faiblesses: string[];
      opportunites: string[]; menaces: string[];
      priorite: string; tip: string;
    };
    const quadrants = [
      { label: "Forces", icon: "💪", items: d.forces, bg: "bg-emerald-50", border: "border-emerald-400", text: "text-emerald-700", badge: "bg-emerald-100 text-emerald-700" },
      { label: "Faiblesses", icon: "⚠️", items: d.faiblesses, bg: "bg-red-50", border: "border-red-400", text: "text-red-700", badge: "bg-red-100 text-red-700" },
      { label: "Opportunités", icon: "🚀", items: d.opportunites, bg: "bg-blue-50", border: "border-blue-400", text: "text-blue-700", badge: "bg-blue-100 text-blue-700" },
      { label: "Menaces", icon: "🛡️", items: d.menaces, bg: "bg-orange-50", border: "border-orange-400", text: "text-orange-700", badge: "bg-orange-100 text-orange-700" },
    ];
    return (
      <div className="bg-white text-gray-900 rounded-xl p-5 space-y-4 text-sm shadow-lg">
        <h2 className="text-lg font-bold text-slate-800 border-b-2 border-slate-600 pb-2">Analyse SWOT</h2>
        <div className="grid grid-cols-2 gap-3">
          {quadrants.map(q => (
            <div key={q.label} className={`${q.bg} border-l-4 ${q.border} rounded-lg p-3`}>
              <p className={`font-semibold ${q.text} mb-2 text-xs uppercase tracking-wide`}>{q.icon} {q.label}</p>
              <ul className="space-y-1">
                {q.items?.map((item, i) => (
                  <li key={i} className="text-xs text-gray-700 flex gap-1"><span className={q.text}>•</span>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="bg-slate-800 text-white rounded-lg p-3">
          <p className="text-xs font-semibold text-slate-300 mb-1">🎯 Priorité stratégique</p>
          <p className="text-sm">{d.priorite}</p>
        </div>
        <div className="bg-slate-50 border-l-4 border-slate-400 p-3 rounded">
          <p className="text-slate-700 text-xs font-medium">💡 Conseil Tariq</p>
          <p className="text-slate-600 text-xs mt-1">{d.tip}</p>
        </div>
      </div>
    );
  }

  if (typeOutput === "plan90") {
    const d = data as {
      mois1: { theme: string; actions: string[] };
      mois2: { theme: string; actions: string[] };
      mois3: { theme: string; actions: string[] };
      kpis: string[]; risque: string; tip: string;
    };
    const mois = [
      { key: "mois1", data: d.mois1, color: "bg-blue-500", light: "bg-blue-50 border-blue-300" },
      { key: "mois2", data: d.mois2, color: "bg-indigo-500", light: "bg-indigo-50 border-indigo-300" },
      { key: "mois3", data: d.mois3, color: "bg-slate-600", light: "bg-slate-50 border-slate-300" },
    ];
    return (
      <div className="bg-white text-gray-900 rounded-xl p-5 space-y-4 text-sm shadow-lg">
        <h2 className="text-lg font-bold text-slate-800 border-b-2 border-slate-600 pb-2">Plan stratégique 90 jours</h2>
        <div className="space-y-3">
          {mois.map((m, idx) => (
            <div key={m.key} className={`border ${m.light} rounded-lg p-3`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`${m.color} text-white text-xs font-bold px-2 py-0.5 rounded-full`}>Mois {idx + 1}</span>
                <span className="font-semibold text-gray-800 text-sm">{m.data?.theme}</span>
              </div>
              <ul className="space-y-1">
                {m.data?.actions?.map((a, i) => (
                  <li key={i} className="flex gap-2 text-xs text-gray-600">
                    <span className="text-gray-400">→</span>{a}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">📊 KPIs à suivre</p>
          <div className="flex flex-wrap gap-2">
            {d.kpis?.map((k, i) => (
              <span key={i} className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-xs font-medium">{k}</span>
            ))}
          </div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-xs text-orange-700">
          <span className="font-semibold">⚡ Risque principal : </span>{d.risque}
        </div>
        <div className="bg-slate-50 border-l-4 border-slate-400 p-3 rounded">
          <p className="text-slate-700 text-xs font-medium">💡 Conseil Tariq</p>
          <p className="text-slate-600 text-xs mt-1">{d.tip}</p>
        </div>
      </div>
    );
  }

  if (typeOutput === "positionnement") {
    const d = data as {
      proposition: string; cible: string;
      differenciateurs: string[]; messages: string[];
      canaux: string[]; tip: string;
    };
    return (
      <div className="bg-white text-gray-900 rounded-xl p-5 space-y-4 text-sm shadow-lg">
        <h2 className="text-lg font-bold text-slate-800 border-b-2 border-slate-600 pb-2">Positionnement concurrentiel</h2>
        <div className="bg-slate-800 text-white rounded-xl p-4 text-center">
          <p className="text-xs text-slate-400 mb-1 uppercase tracking-wide">Proposition de valeur</p>
          <p className="text-base font-semibold leading-snug">{d.proposition}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs font-semibold text-blue-700 mb-1">🎯 Client cible</p>
          <p className="text-sm text-blue-800">{d.cible}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">⚡ Différenciateurs</p>
          <ul className="space-y-1">
            {d.differenciateurs?.map((diff, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700"><span className="text-slate-500 font-bold">{i + 1}.</span>{diff}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">💬 Messages clés</p>
          <div className="space-y-1">
            {d.messages?.map((msg, i) => (
              <div key={i} className="bg-gray-50 rounded px-3 py-2 text-xs text-gray-700 italic">&quot;{msg}&quot;</div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">📡 Canaux prioritaires</p>
          <div className="flex flex-wrap gap-2">
            {d.canaux?.map((c, i) => (
              <span key={i} className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full text-xs font-medium">{c}</span>
            ))}
          </div>
        </div>
        <div className="bg-slate-50 border-l-4 border-slate-400 p-3 rounded">
          <p className="text-slate-700 text-xs font-medium">💡 Conseil Tariq</p>
          <p className="text-slate-600 text-xs mt-1">{d.tip}</p>
        </div>
      </div>
    );
  }

  return null;
}