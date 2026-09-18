"use client";

interface HRPreviewProps {
  data: Record<string, unknown> | null;
  typeOutput: string;
}

export default function HRPreview({ data, typeOutput }: HRPreviewProps) {
  if (!data) return (
    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
      L&apos;aperçu apparaîtra ici après génération
    </div>
  );

  if (typeOutput === "offre") {
    const d = data as {
      titre: string; intro: string; missions: string[];
      profil: string[]; avantages: string[]; processus: string; tip: string;
    };
    return (
      <div className="bg-white text-gray-900 rounded-xl p-6 space-y-5 text-sm shadow-lg">
        <div className="border-b-2 border-teal-500 pb-3">
          <h2 className="text-xl font-bold text-teal-700">{d.titre}</h2>
        </div>
        <p className="text-gray-600 italic">{d.intro}</p>
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">📋 Missions</h3>
          <ul className="space-y-1">
            {d.missions?.map((m, i) => <li key={i} className="flex gap-2"><span className="text-teal-500">→</span>{m}</li>)}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">🎯 Profil recherché</h3>
          <ul className="space-y-1">
            {d.profil?.map((p, i) => <li key={i} className="flex gap-2"><span className="text-teal-500">✓</span>{p}</li>)}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">🎁 Avantages</h3>
          <div className="flex flex-wrap gap-2">
            {d.avantages?.map((a, i) => (
              <span key={i} className="bg-teal-50 text-teal-700 px-2 py-1 rounded-full text-xs font-medium">{a}</span>
            ))}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <h3 className="font-semibold text-gray-800 mb-1">📩 Comment postuler</h3>
          <p className="text-gray-600">{d.processus}</p>
        </div>
        <div className="bg-teal-50 border-l-4 border-teal-400 p-3 rounded">
          <p className="text-teal-700 text-xs font-medium">💡 Conseil Nadia</p>
          <p className="text-teal-600 text-xs mt-1">{d.tip}</p>
        </div>
      </div>
    );
  }

  if (typeOutput === "entretien") {
    const d = data as {
      questions: { categorie: string; question: string; indice: string }[];
      scorecard: string[]; tip: string;
    };
    const catColors: Record<string, string> = {
      "Motivation": "bg-purple-100 text-purple-700",
      "Expérience": "bg-blue-100 text-blue-700",
      "Compétences techniques": "bg-green-100 text-green-700",
      "Comportemental": "bg-orange-100 text-orange-700",
      "Mise en situation": "bg-red-100 text-red-700",
      "Culture fit": "bg-teal-100 text-teal-700",
    };
    return (
      <div className="bg-white text-gray-900 rounded-xl p-6 space-y-4 text-sm shadow-lg">
        <h2 className="text-lg font-bold text-teal-700 border-b-2 border-teal-500 pb-2">Grille d&apos;entretien</h2>
        <div className="space-y-3">
          {d.questions?.map((q, i) => (
            <div key={i} className="border border-gray-100 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${catColors[q.categorie] || "bg-gray-100 text-gray-600"}`}>
                  {q.categorie}
                </span>
              </div>
              <p className="font-medium text-gray-800">❓ {q.question}</p>
              <p className="text-xs text-gray-500 mt-1 italic">→ {q.indice}</p>
            </div>
          ))}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">📊 Scorecard</h3>
          <div className="space-y-1">
            {d.scorecard?.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-gray-400 text-xs">{s}</span>
                <div className="flex gap-1 ml-auto">
                  {[1,2,3,4,5].map(n => <div key={n} className="w-5 h-5 border border-gray-300 rounded text-xs flex items-center justify-center text-gray-400">{n}</div>)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-teal-50 border-l-4 border-teal-400 p-3 rounded">
          <p className="text-teal-700 text-xs font-medium">💡 Conseil Nadia</p>
          <p className="text-teal-600 text-xs mt-1">{d.tip}</p>
        </div>
      </div>
    );
  }

  if (typeOutput === "lettre") {
    const d = data as { objet: string; corps: string; mentions: string[]; tip: string };
    return (
      <div className="bg-white text-gray-900 rounded-xl p-6 space-y-4 text-sm shadow-lg font-serif">
        <div className="border-b-2 border-teal-500 pb-2">
          <p className="font-bold text-gray-700">Objet : {d.objet}</p>
        </div>
        <div className="whitespace-pre-line text-gray-700 leading-relaxed">{d.corps}</div>
        <div className="bg-gray-50 rounded-lg p-3 mt-4">
          <h3 className="font-semibold text-gray-700 mb-2 text-xs uppercase tracking-wide">Mentions légales</h3>
          <ul className="space-y-1">
            {d.mentions?.map((m, i) => <li key={i} className="text-xs text-gray-500 flex gap-1"><span>•</span>{m}</li>)}
          </ul>
        </div>
        <div className="bg-teal-50 border-l-4 border-teal-400 p-3 rounded">
          <p className="text-teal-700 text-xs font-medium">💡 Conseil Nadia</p>
          <p className="text-teal-600 text-xs mt-1">{d.tip}</p>
        </div>
      </div>
    );
  }

  return null;
}