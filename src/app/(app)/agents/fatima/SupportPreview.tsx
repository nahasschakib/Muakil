"use client";

interface SupportPreviewProps {
  data: Record<string, unknown> | null;
  typeOutput: string;
}

export default function SupportPreview({ data, typeOutput }: SupportPreviewProps) {
  if (!data) return (
    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
      La réponse apparaîtra ici après génération
    </div>
  );

  if (typeOutput === "reclamation") {
    const d = data as {
      objet: string; reponse: string;
      gestes: string[]; aEviter: string[]; tip: string;
    };
    return (
      <div className="bg-white text-gray-900 rounded-xl p-5 space-y-4 text-sm shadow-lg">
        <h2 className="text-lg font-bold text-cyan-700 border-b-2 border-cyan-500 pb-2">
          📨 Réponse réclamation
        </h2>
        {d.objet && (
          <div className="bg-gray-50 rounded-lg px-3 py-2">
            <p className="text-xs text-gray-500 font-medium">Objet</p>
            <p className="text-sm text-gray-800 font-medium">{d.objet}</p>
          </div>
        )}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{d.reponse}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-semibold text-emerald-700 mb-2 uppercase tracking-wide">🎁 Gestes possibles</p>
            <ul className="space-y-1">
              {d.gestes?.map((g, i) => (
                <li key={i} className="text-xs text-gray-600 flex gap-1"><span className="text-emerald-500">✓</span>{g}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-red-600 mb-2 uppercase tracking-wide">⛔ À éviter</p>
            <ul className="space-y-1">
              {d.aEviter?.map((a, i) => (
                <li key={i} className="text-xs text-gray-600 flex gap-1"><span className="text-red-400">✗</span>{a}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="bg-cyan-50 border-l-4 border-cyan-400 p-3 rounded">
          <p className="text-cyan-700 text-xs font-medium">💡 Conseil Fatima</p>
          <p className="text-cyan-600 text-xs mt-1">{d.tip}</p>
        </div>
      </div>
    );
  }

  if (typeOutput === "faq") {
    const d = data as {
      faqs: { question: string; reponse: string }[];
      tip: string;
    };
    return (
      <div className="bg-white text-gray-900 rounded-xl p-5 space-y-3 text-sm shadow-lg">
        <h2 className="text-lg font-bold text-cyan-700 border-b-2 border-cyan-500 pb-2">
          ❓ FAQ générée
        </h2>
        <div className="space-y-3">
          {d.faqs?.map((faq, i) => (
            <div key={i} className="border border-gray-100 rounded-lg overflow-hidden">
              <div className="bg-cyan-50 px-4 py-2">
                <p className="font-semibold text-cyan-800 text-sm">Q : {faq.question}</p>
              </div>
              <div className="px-4 py-3">
                <p className="text-gray-600 text-sm">R : {faq.reponse}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-cyan-50 border-l-4 border-cyan-400 p-3 rounded">
          <p className="text-cyan-700 text-xs font-medium">💡 Conseil Fatima</p>
          <p className="text-cyan-600 text-xs mt-1">{d.tip}</p>
        </div>
      </div>
    );
  }

  if (typeOutput === "script") {
    const d = data as {
      etapes: { phase: string; agent: string; client: string }[];
      objections: { objection: string; reponse: string }[];
      tip: string;
    };
    return (
      <div className="bg-white text-gray-900 rounded-xl p-5 space-y-4 text-sm shadow-lg">
        <h2 className="text-lg font-bold text-cyan-700 border-b-2 border-cyan-500 pb-2">
          📞 Script d&apos;appel
        </h2>
        <div className="space-y-2">
          {d.etapes?.map((e, i) => (
            <div key={i} className="border border-gray-100 rounded-lg overflow-hidden">
              <div className="bg-slate-800 px-3 py-1.5">
                <span className="text-xs font-bold text-white/80 uppercase tracking-wide">{e.phase}</span>
              </div>
              <div className="p-3 space-y-2">
                <div className="flex gap-2">
                  <span className="text-xs font-bold text-cyan-600 w-12 shrink-0">Agent</span>
                  <p className="text-xs text-gray-700 bg-cyan-50 rounded px-2 py-1 flex-1">{e.agent}</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs font-bold text-gray-400 w-12 shrink-0">Client</span>
                  <p className="text-xs text-gray-500 bg-gray-50 rounded px-2 py-1 flex-1 italic">{e.client}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {d.objections?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">⚡ Gestion objections</p>
            <div className="space-y-2">
              {d.objections?.map((o, i) => (
                <div key={i} className="bg-orange-50 border border-orange-100 rounded-lg p-3">
                  <p className="text-xs font-medium text-orange-700">❝ {o.objection}</p>
                  <p className="text-xs text-orange-600 mt-1">→ {o.reponse}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="bg-cyan-50 border-l-4 border-cyan-400 p-3 rounded">
          <p className="text-cyan-700 text-xs font-medium">💡 Conseil Fatima</p>
          <p className="text-cyan-600 text-xs mt-1">{d.tip}</p>
        </div>
      </div>
    );
  }

  return null;
}