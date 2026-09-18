"use client";

interface CreativePreviewProps {
  data: Record<string, unknown> | null;
  typeOutput: string;
}

export default function CreativePreview({ data, typeOutput }: CreativePreviewProps) {
  if (!data) return (
    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
      La création apparaîtra ici après génération
    </div>
  );

  if (typeOutput === "slogan") {
    const d = data as {
      slogans: { texte: string; angle: string }[];
      tagline: string; territoire: string; tip: string;
    };
    return (
      <div className="bg-white text-gray-900 rounded-xl p-5 space-y-4 text-sm shadow-lg">
        <h2 className="text-lg font-bold text-fuchsia-700 border-b-2 border-fuchsia-500 pb-2">
          ✨ Slogans & Taglines
        </h2>
        <div className="space-y-3">
          {d.slogans?.map((s, i) => (
            <div key={i} className="border border-fuchsia-100 rounded-xl p-4 hover:bg-fuchsia-50 transition-colors">
              <p className="text-lg font-bold text-gray-800 leading-snug">{s.texte}</p>
              <p className="text-xs text-fuchsia-500 mt-1 italic">{s.angle}</p>
            </div>
          ))}
        </div>
        <div className="bg-fuchsia-700 text-white rounded-xl p-4 text-center">
          <p className="text-xs text-fuchsia-200 uppercase tracking-widest mb-1">Tagline recommandée</p>
          <p className="text-xl font-bold">{d.tagline}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs font-semibold text-gray-600 mb-1">🗺️ Territoire de marque</p>
          <p className="text-sm text-gray-700 italic">{d.territoire}</p>
        </div>
        <div className="bg-fuchsia-50 border-l-4 border-fuchsia-400 p-3 rounded">
          <p className="text-fuchsia-700 text-xs font-medium">💡 Conseil Imane</p>
          <p className="text-fuchsia-600 text-xs mt-1">{d.tip}</p>
        </div>
      </div>
    );
  }

  if (typeOutput === "brief") {
    const d = data as {
      objectif: string; cibleDetail: string; message: string;
      ton: string; elements: string[]; aEviter: string[];
      inspiration: string; tip: string;
    };
    return (
      <div className="bg-white text-gray-900 rounded-xl p-5 space-y-4 text-sm shadow-lg">
        <h2 className="text-lg font-bold text-fuchsia-700 border-b-2 border-fuchsia-500 pb-2">
          📋 Brief créatif
        </h2>
        <div className="grid grid-cols-1 gap-3">
          <div className="bg-fuchsia-50 rounded-lg p-3">
            <p className="text-xs font-bold text-fuchsia-700 uppercase tracking-wide mb-1">🎯 Objectif</p>
            <p className="text-sm text-gray-700">{d.objectif}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1">👤 Cible</p>
            <p className="text-sm text-gray-700">{d.cibleDetail}</p>
          </div>
          <div className="bg-slate-800 text-white rounded-lg p-4 text-center">
            <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Message central</p>
            <p className="text-base font-bold">{d.message}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">🎨 Ton & Style</p>
            <p className="text-sm text-gray-700">{d.ton}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">⚡ Éléments créatifs clés</p>
            <ul className="space-y-1">
              {d.elements?.map((e, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700">
                  <span className="text-fuchsia-500 font-bold">{i + 1}.</span>{e}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-bold text-red-600 uppercase tracking-wide mb-1">⛔ À éviter</p>
              <ul className="space-y-1">
                {d.aEviter?.map((a, i) => (
                  <li key={i} className="text-xs text-gray-600 flex gap-1"><span className="text-red-400">✗</span>{a}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-1">💫 Inspiration</p>
              <p className="text-xs text-gray-600 italic">{d.inspiration}</p>
            </div>
          </div>
        </div>
        <div className="bg-fuchsia-50 border-l-4 border-fuchsia-400 p-3 rounded">
          <p className="text-fuchsia-700 text-xs font-medium">💡 Conseil Imane</p>
          <p className="text-fuchsia-600 text-xs mt-1">{d.tip}</p>
        </div>
      </div>
    );
  }

  if (typeOutput === "pub") {
    const d = data as {
      titre: string; sousTitre: string; corps: string; cta: string;
      variantes: { version: string; titre: string; cta: string }[];
      tip: string;
    };
    return (
      <div className="bg-white text-gray-900 rounded-xl p-5 space-y-4 text-sm shadow-lg">
        <h2 className="text-lg font-bold text-fuchsia-700 border-b-2 border-fuchsia-500 pb-2">
          📢 Texte publicitaire
        </h2>
        <div className="border-2 border-fuchsia-200 rounded-xl p-5 space-y-3 bg-gradient-to-br from-fuchsia-50 to-white">
          <p className="text-2xl font-black text-gray-900 leading-tight">{d.titre}</p>
          <p className="text-base font-semibold text-fuchsia-700">{d.sousTitre}</p>
          <p className="text-sm text-gray-600 leading-relaxed">{d.corps}</p>
          <div className="pt-2">
            <span className="bg-fuchsia-600 text-white px-4 py-2 rounded-full text-sm font-bold">
              {d.cta}
            </span>
          </div>
        </div>
        <div>
          <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">🔄 Variantes A/B</p>
          <div className="grid grid-cols-1 gap-2">
            {d.variantes?.map((v, i) => (
              <div key={i} className="border border-gray-100 rounded-lg p-3">
                <p className="text-xs font-semibold text-fuchsia-600 mb-1">{v.version}</p>
                <p className="text-sm font-bold text-gray-800">{v.titre}</p>
                <span className="mt-1 inline-block bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  CTA : {v.cta}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-fuchsia-50 border-l-4 border-fuchsia-400 p-3 rounded">
          <p className="text-fuchsia-700 text-xs font-medium">💡 Conseil Imane</p>
          <p className="text-fuchsia-600 text-xs mt-1">{d.tip}</p>
        </div>
      </div>
    );
  }

  return null;
}