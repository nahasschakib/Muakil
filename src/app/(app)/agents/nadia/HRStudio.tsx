"use client";

import { useState } from "react";
import HRPreview from "./HRPreview";

const SECTEURS = ["Commerce & Distribution", "BTP & Immobilier", "Industrie & Production", "Services & Conseil", "Finance & Assurance", "Santé & Pharmacie", "Transport & Logistique", "IT & Digital", "Tourisme & Hôtellerie", "Agriculture & Agroalimentaire"];
const CONTRATS = ["CDI", "CDD", "Contrat Anapec", "Stage PFE", "Stage d'application", "Freelance"];
const NIVEAUX = ["Débutant (0-2 ans)", "Junior (2-4 ans)", "Confirmé (4-7 ans)", "Senior (7-10 ans)", "Expert (+10 ans)"];
const OUTPUTS = [
  { id: "offre", label: "Offre d'emploi", icon: "📋" },
  { id: "entretien", label: "Grille d'entretien", icon: "🎯" },
  { id: "lettre", label: "Lettre d'embauche", icon: "📄" },
];

export default function HRStudio({ orgId }: { orgId: string }) {
  const [poste, setPoste] = useState("");
  const [secteur, setSecteur] = useState(SECTEURS[0]);
  const [typeContrat, setTypeContrat] = useState(CONTRATS[0]);
  const [niveauExperience, setNiveauExperience] = useState(NIVEAUX[0]);
  const [competences, setCompetences] = useState("");
  const [salaire, setSalaire] = useState("");
  const [typeOutput, setTypeOutput] = useState("offre");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  const generate = async () => {
    if (!poste.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/agents/nadia/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ poste, secteur, typeContrat, niveauExperience, competences, salaire, typeOutput }),
      });
      const data = await res.json();
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-[#1C1F2E] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-teal-500/50";
  const labelClass = "block text-xs font-medium text-white/60 mb-1";

  return (
    <div className="min-h-screen bg-[#0F1117] text-white">
      <div className="border-b border-white/10 px-6 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-teal-500/20 flex items-center justify-center text-lg">👩‍💼</div>
        <div>
          <h1 className="font-semibold text-white">Nadia — HR Studio</h1>
          <p className="text-xs text-white/40">Offres d&apos;emploi · Grilles d&apos;entretien · Lettres d&apos;embauche</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        {/* Formulaire */}
        <div className="space-y-4">
          {/* Type de sortie */}
          <div>
            <p className={labelClass}>Type de document</p>
            <div className="grid grid-cols-3 gap-2">
              {OUTPUTS.map(o => (
                <button
                  key={o.id}
                  onClick={() => setTypeOutput(o.id)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border text-xs font-medium transition-all ${typeOutput === o.id ? "bg-teal-500/20 border-teal-500/50 text-teal-300" : "border-white/10 text-white/50 hover:border-white/20"}`}
                >
                  <span className="text-lg">{o.icon}</span>
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>Intitulé du poste *</label>
            <input className={inputClass} placeholder="ex: Responsable Commercial, Développeur Web..." value={poste} onChange={e => setPoste(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Secteur</label>
              <select className={inputClass} value={secteur} onChange={e => setSecteur(e.target.value)}>
                {SECTEURS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Type de contrat</label>
              <select className={inputClass} value={typeContrat} onChange={e => setTypeContrat(e.target.value)}>
                {CONTRATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Niveau dapos;expérience</label>
              <select className={inputClass} value={niveauExperience} onChange={e => setNiveauExperience(e.target.value)}>
                {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Salaire (MAD/mois)</label>
              <input className={inputClass} placeholder="ex: 5000-8000 MAD" value={salaire} onChange={e => setSalaire(e.target.value)} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Compétences clés</label>
            <textarea className={`${inputClass} resize-none h-20`} placeholder="ex: Excel, relation client, permis B, français courant..." value={competences} onChange={e => setCompetences(e.target.value)} />
          </div>

          <button
            onClick={generate}
            disabled={loading || !poste.trim()}
            className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all"
          >
            {loading ? "Nadia rédige..." : `Générer ${OUTPUTS.find(o => o.id === typeOutput)?.label}`}
          </button>
        </div>

        {/* Aperçu */}
        <div className="bg-[#1C1F2E] rounded-xl p-4 min-h-[500px] overflow-y-auto">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-white/40">
              <div className="w-8 h-8 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
              <p className="text-sm">Nadia prépare le document...</p>
            </div>
          ) : (
            <HRPreview data={result} typeOutput={typeOutput} />
          )}
        </div>
      </div>
    </div>
  );
}