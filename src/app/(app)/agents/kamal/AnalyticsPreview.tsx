"use client";

interface AnalyticsPreviewProps {
  data: Record<string, unknown> | null;
  typeOutput: string;
}

const statutColors: Record<string, string> = {
  bon: "bg-emerald-100 text-emerald-700 border-emerald-300",
  moyen: "bg-amber-100 text-amber-700 border-amber-300",
  mauvais: "bg-red-100 text-red-700 border-red-300",
};

const prioriteColors: Record<string, string> = {
  haute: "bg-red-100 text-red-700",
  moyenne: "bg-amber-100 text-amber-700",
  basse: "bg-blue-100 text-blue-700",
};

export default function AnalyticsPreview({ data, typeOutput }: AnalyticsPreviewProps) {
  if (!data) return (
    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
      L&apos;analyse apparaîtra ici après génération
    </div>
  );

  if (typeOutput === "kpis") {
    const d = data as {
      kpis: { nom: string; description: string; unite: string; frequence: string; cible: string }[];
      outil: string; priorite: string; tip: string;
    };
    return (
      <div className="bg-white text-gray-900 rounded-xl p-5 space-y-4 text-sm shadow-lg">
        <h2 className="text-lg font-bold text-orange-700 border-b-2 border-orange-500 pb-2">
          📊 Tableau de bord KPIs
        </h2>
        <div className="space-y-2">
          {d.kpis?.map((kpi, i) => (
            <div key={i} className="border border-gray-100 rounded-lg p-3 hover:bg-orange-50 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-gray-800 text-sm">{kpi.nom}</p>
                <div className="flex gap-2">
                  <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full font-medium">{kpi.unite}</span>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{kpi.frequence}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">{kpi.description}</p>
              <p className="text-xs text-orange-600 font-medium mt-1">🎯 Cible : {kpi.cible}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs font-semibold text-blue-700 mb-1">🛠️ Outil recommandé</p>
            <p className="text-sm text-blue-800 font-medium">{d.outil}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <p className="text-xs font-semibold text-orange-700 mb-1">⚡ KPI prioritaire</p>
            <p className="text-sm text-orange-800 font-medium">{d.priorite}</p>
          </div>
        </div>
        <div className="bg-orange-50 border-l-4 border-orange-400 p-3 rounded">
          <p className="text-orange-700 text-xs font-medium">💡 Conseil Kamal</p>
          <p className="text-orange-600 text-xs mt-1">{d.tip}</p>
        </div>
      </div>
    );
  }

  if (typeOutput === "analyse") {
    const d = data as {
      synthese: string;
      points_forts: string[]; points_faibles: string[];
      tendance: string;
      actions: { priorite: string; action: string }[];
      alerte: string; tip: string;
    };
    return (
      <div className="bg-white text-gray-900 rounded-xl p-5 space-y-4 text-sm shadow-lg">
        <h2 className="text-lg font-bold text-orange-700 border-b-2 border-orange-500 pb-2">
          🔍 Analyse de performance
        </h2>
        <div className="bg-slate-800 text-white rounded-lg p-4">
          <p className="text-xs text-slate-400 mb-1 uppercase tracking-wide">Synthèse dirigeant</p>
          <p className="text-sm leading-relaxed">{d.synthese}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-semibold text-emerald-700 mb-2 uppercase tracking-wide">✅ Points forts</p>
            <ul className="space-y-1">
              {d.points_forts?.map((p, i) => (
                <li key={i} className="text-xs text-gray-600 flex gap-1"><span className="text-emerald-500">+</span>{p}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-red-600 mb-2 uppercase tracking-wide">⚠️ Points faibles</p>
            <ul className="space-y-1">
              {d.points_faibles?.map((p, i) => (
                <li key={i} className="text-xs text-gray-600 flex gap-1"><span className="text-red-400">−</span>{p}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-xs font-semibold text-blue-700 mb-1">📈 Tendance</p>
          <p className="text-sm text-blue-800">{d.tendance}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">🎯 Actions recommandées</p>
          <div className="space-y-2">
            {d.actions?.map((a, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${prioriteColors[a.priorite] || "bg-gray-100 text-gray-600"}`}>
                  {a.priorite}
                </span>
                <p className="text-xs text-gray-700">{a.action}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-xs font-semibold text-red-700">🚨 Alerte</p>
          <p className="text-xs text-red-600 mt-1">{d.alerte}</p>
        </div>
        <div className="bg-orange-50 border-l-4 border-orange-400 p-3 rounded">
          <p className="text-orange-700 text-xs font-medium">💡 Conseil Kamal</p>
          <p className="text-orange-600 text-xs mt-1">{d.tip}</p>
        </div>
      </div>
    );
  }

  if (typeOutput === "rapport") {
    const d = data as {
      titre: string; resume_executif: string;
      sections: { titre: string; contenu: string; statut: string }[];
      decision: string; tip: string;
    };
    return (
      <div className="bg-white text-gray-900 rounded-xl p-5 space-y-4 text-sm shadow-lg">
        <h2 className="text-lg font-bold text-orange-700 border-b-2 border-orange-500 pb-2">
          📋 {d.titre}
        </h2>
        <div className="bg-slate-800 text-white rounded-lg p-4">
          <p className="text-xs text-slate-400 mb-1 uppercase tracking-wide">Résumé exécutif</p>
          <p className="text-sm leading-relaxed">{d.resume_executif}</p>
        </div>
        <div className="space-y-2">
          {d.sections?.map((s, i) => (
            <div key={i} className={`border rounded-lg overflow-hidden ${statutColors[s.statut] || "border-gray-200"}`}>
              <div className="flex items-center justify-between px-3 py-2 bg-white/70">
                <p className="font-semibold text-gray-800 text-sm">{s.titre}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${statutColors[s.statut] || "bg-gray-100 text-gray-600 border-gray-300"}`}>
                  {s.statut}
                </span>
              </div>
              <div className="px-3 py-2">
                <p className="text-xs text-gray-600">{s.contenu}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-orange-600 text-white rounded-lg p-4">
          <p className="text-xs text-orange-200 mb-1 uppercase tracking-wide">Décision du mois</p>
          <p className="text-sm font-semibold">{d.decision}</p>
        </div>
        <div className="bg-orange-50 border-l-4 border-orange-400 p-3 rounded">
          <p className="text-orange-700 text-xs font-medium">💡 Conseil Kamal</p>
          <p className="text-orange-600 text-xs mt-1">{d.tip}</p>
        </div>
      </div>
    );
  }

  return null;
}