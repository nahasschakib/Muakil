"use client";

interface EmailPreviewProps {
  data: Record<string, unknown> | null;
  typeOutput: string;
}

export default function EmailPreview({ data, typeOutput }: EmailPreviewProps) {
  if (!data) return (
    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
      L&apos;email apparaîtra ici après génération
    </div>
  );

  if (typeOutput === "email") {
    const d = data as { objet: string; corps: string; variante: string; tip: string };
    return (
      <div className="space-y-4 text-sm">
        <div className="bg-white text-gray-900 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
            <p className="text-xs text-gray-500 font-medium">Objet</p>
            <p className="font-semibold text-gray-800">{d.objet}</p>
          </div>
          <div className="p-5">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{d.corps}</p>
          </div>
        </div>
        <div className="bg-white text-gray-900 rounded-xl shadow-lg overflow-hidden opacity-80">
          <div className="bg-blue-50 px-4 py-2 border-b border-blue-100">
            <p className="text-xs text-blue-600 font-semibold">✂️ Version courte alternative</p>
          </div>
          <div className="p-4">
            <p className="text-gray-600 leading-relaxed whitespace-pre-line text-xs">{d.variante}</p>
          </div>
        </div>
        <div className="bg-sky-900/30 border-l-4 border-sky-400 p-3 rounded">
          <p className="text-sky-300 text-xs font-medium">💡 Conseil Samia</p>
          <p className="text-sky-200 text-xs mt-1">{d.tip}</p>
        </div>
      </div>
    );
  }

  if (typeOutput === "relance") {
    const d = data as {
      relances: { delai: string; objet: string; corps: string }[];
      tip: string;
    };
    const delaiColors = ["bg-blue-500", "bg-indigo-500", "bg-slate-600"];
    return (
      <div className="space-y-4 text-sm">
        <h2 className="text-base font-bold text-sky-300 mb-2">📬 Séquence de relance</h2>
        {d.relances?.map((r, i) => (
          <div key={i} className="bg-white text-gray-900 rounded-xl shadow-lg overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-100">
              <span className={`${delaiColors[i]} text-white text-xs font-bold px-2 py-0.5 rounded-full`}>
                {r.delai}
              </span>
              <p className="font-semibold text-gray-700 text-sm">{r.objet}</p>
            </div>
            <div className="p-4">
              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">{r.corps}</p>
            </div>
          </div>
        ))}
        <div className="bg-sky-900/30 border-l-4 border-sky-400 p-3 rounded">
          <p className="text-sky-300 text-xs font-medium">💡 Conseil Samia</p>
          <p className="text-sky-200 text-xs mt-1">{d.tip}</p>
        </div>
      </div>
    );
  }

  if (typeOutput === "newsletter") {
    const d = data as {
      objet: string; preheader: string;
      sections: { titre: string; contenu: string; cta: string }[];
      signature: string; tip: string;
    };
    return (
      <div className="space-y-4 text-sm">
        <div className="bg-white text-gray-900 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 space-y-1">
            <div>
              <p className="text-xs text-gray-500">Objet</p>
              <p className="font-semibold text-gray-800">{d.objet}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Prévisualisation</p>
              <p className="text-xs text-gray-500 italic">{d.preheader}</p>
            </div>
          </div>
          <div className="p-5 space-y-5">
            {d.sections?.map((s, i) => (
              <div key={i} className={`${i < d.sections.length - 1 ? "border-b border-gray-100 pb-4" : ""}`}>
                <h3 className="font-bold text-gray-800 mb-2">{s.titre}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{s.contenu}</p>
                {s.cta && (
                  <div className="mt-3">
                    <span className="bg-sky-600 text-white px-4 py-1.5 rounded-full text-xs font-semibold">
                      {s.cta}
                    </span>
                  </div>
                )}
              </div>
            ))}
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500 italic">{d.signature}</p>
            </div>
          </div>
        </div>
        <div className="bg-sky-900/30 border-l-4 border-sky-400 p-3 rounded">
          <p className="text-sky-300 text-xs font-medium">💡 Conseil Samia</p>
          <p className="text-sky-200 text-xs mt-1">{d.tip}</p>
        </div>
      </div>
    );
  }

  return null;
}