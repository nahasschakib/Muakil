"use client";

import { useEffect, useState } from "react";

export default function KarimPrintPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const raw = localStorage.getItem("muakil_print_proposal");
    if (raw) setData(JSON.parse(raw));
  }, []);

  useEffect(() => {
    if (data) setTimeout(() => window.print(), 800);
  }, [data]);

  if (!data) return (
    <div className="flex items-center justify-center min-h-screen text-gray-400">
      Chargement de la proposition…
    </div>
  );

  const { proposal, prospectName, brandName } = data;

  return (
    <>
      <style>{`
        @page { size: A4; margin: 15mm; }
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
        body { font-family: Inter, Arial, sans-serif; font-size: 12px; color: #111; background: white; }
        .option-highlight { background-color: #1e1b4b; color: white; }
        .option-normal { background-color: #f9fafb; color: #111; }
      `}</style>

      <div className="no-print fixed top-4 right-4 flex gap-2 z-50">
        <button onClick={() => window.print()}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium">
          Imprimer / Enregistrer PDF
        </button>
        <button onClick={() => window.close()}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm">
          Fermer
        </button>
      </div>

      <div className="max-w-[210mm] mx-auto p-8 bg-white min-h-screen">

        {/* En-tête */}
        <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-gray-900">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Proposition commerciale</p>
            <h1 className="text-2xl font-bold text-gray-900">{brandName || "Votre entreprise"}</h1>
            <p className="text-gray-500 text-sm mt-1">
              À l'attention de <strong>{prospectName}</strong>
            </p>
          </div>
          <div className="text-right text-xs text-gray-500">
            <p className="text-orange-600 font-semibold">{proposal.validity}</p>
            <p className="mt-1">{new Date().toLocaleDateString("fr-MA")}</p>
          </div>
        </div>

        {/* SCR */}
        <div className="mb-8 space-y-4">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Situation</p>
            <p className="text-gray-700 text-sm leading-relaxed">{proposal.intro}</p>
          </div>
          <div className="border-l-4 border-red-400 pl-4 py-2 bg-red-50 rounded-r">
            <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">Complication</p>
            <p className="text-gray-700 text-sm leading-relaxed">{proposal.problem}</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50 rounded-r">
            <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">Notre résolution</p>
            <p className="text-gray-700 text-sm leading-relaxed">{proposal.approach}</p>
          </div>
        </div>

        {/* Options */}
        <div className="mb-8">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Nos offres</p>
          <div className="grid grid-cols-3 gap-3">
            {proposal.options.map((opt: any, i: number) => (
              <div key={i} className={`rounded-lg p-4 border-2 ${opt.highlight ? "border-indigo-800 bg-indigo-950 text-white" : "border-gray-200 bg-gray-50 text-gray-900"}`}>
                {opt.highlight && (
                  <p className="text-xs text-center text-indigo-300 font-semibold mb-2 uppercase tracking-wider">✦ Recommandé</p>
                )}
                <h3 className={`font-bold text-base ${opt.highlight ? "text-white" : "text-gray-900"}`}>{opt.name}</h3>
                <p className={`text-xs mb-2 ${opt.highlight ? "text-indigo-300" : "text-gray-400"}`}>{opt.tagline}</p>
                <p className={`text-xl font-bold mb-2 ${opt.highlight ? "text-white" : "text-gray-900"}`}>{opt.price}</p>
                <ul className="space-y-1">
                  {opt.inclus.map((item: string, j: number) => (
                    <li key={j} className={`text-xs flex items-start gap-1.5 ${opt.highlight ? "text-indigo-200" : "text-gray-600"}`}>
                      <span className={opt.highlight ? "text-indigo-400" : "text-green-500"}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ROI + Prochaines étapes */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">Valeur générée</p>
            <p className="text-xs text-gray-700 leading-relaxed">{proposal.roi}</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Prochaines étapes</p>
            <ol className="space-y-1">
              {proposal.nextSteps.map((step: string, i: number) => (
                <li key={i} className="text-xs text-gray-700 flex items-start gap-2">
                  <span className="font-bold text-indigo-600 flex-shrink-0">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Pied de page */}
        <div className="border-t border-gray-200 pt-4 text-xs text-gray-400 text-center">
          {proposal.validity} — Document confidentiel établi par {brandName || "votre entreprise"} pour {prospectName}
        </div>
      </div>
    </>
  );
}
