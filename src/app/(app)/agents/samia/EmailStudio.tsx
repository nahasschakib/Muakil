"use client";

import { useState } from "react";
import EmailPreview from "./EmailPreview";
import { completeWorkflowStep } from "@/app/(app)/workflows/actions";
import { useRouter } from "next/navigation";

const DESTINATAIRES = ["Client prospect", "Client existant", "Fournisseur", "Partenaire", "Direction / Associés", "Équipe interne", "Banque / Institution"];
const TONS = ["Professionnel", "Chaleureux", "Formel", "Persuasif", "Urgent"];
const OUTPUTS = [
  { id: "email", label: "Email", icon: "✉️" },
  { id: "relance", label: "Relance x3", icon: "📬" },
  { id: "newsletter", label: "Newsletter", icon: "📰" },
];

type EmailStudioProps = {
  orgId: string
  workflowId?: string
  stepId?: string
}

export default function EmailStudio({ orgId, workflowId, stepId }: EmailStudioProps) {
  const [objet, setObjet] = useState("");
  const [destinataire, setDestinataire] = useState(DESTINATAIRES[0]);
  const [contexte, setContexte] = useState("");
  const [ton, setTon] = useState(TONS[0]);
  const [typeOutput, setTypeOutput] = useState("email");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [completingStep, setCompletingStep] = useState(false);
  const router = useRouter();

  async function handleCompleteStep() {
  if (!workflowId || !stepId || !result) return;
  setCompletingStep(true);
  await completeWorkflowStep(workflowId, stepId, {
    typeOutput,
    objet,
    destinataire,
    result: JSON.parse(JSON.stringify(result)),
  });
  router.push(`/workflows/${workflowId}`);
}

  const generate = async () => {
    if (!objet.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/agents/samia/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ objet, destinataire, contexte, ton, typeOutput }),
      });
      const data = await res.json();
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-[#1C1F2E] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-sky-500/50";
  const labelClass = "block text-xs font-medium text-white/60 mb-1";

  const objetPlaceholder: Record<string, string> = {
    email: "ex: Proposition commerciale suite à notre réunion du 15 sept...",
    relance: "ex: Devis envoyé le 10 sept sans réponse, client intéressé...",
    newsletter: "ex: Nouveautés septembre, offre Aïd, lancement nouveau service...",
  };

  return (
    <div className="min-h-screen bg-[#0F1117] text-white">
      <div className="border-b border-white/10 px-6 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-sky-500/20 flex items-center justify-center text-lg">✉️</div>
        <div>
          <h1 className="font-semibold text-white">Samia — Email Studio</h1>
          <p className="text-xs text-white/40">Emails · Relances · Newsletters</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {workflowId && stepId && result && (
            <button onClick={handleCompleteStep} disabled={completingStep}
              className="text-xs bg-[#7C5CFC] hover:bg-[#6B4FDB] disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              {completingStep ? "En cours…" : "Terminer cette étape →"}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        <div className="space-y-4">
          <div>
            <p className={labelClass}>Type de contenu</p>
            <div className="grid grid-cols-3 gap-2">
              {OUTPUTS.map(o => (
                <button key={o.id} onClick={() => { setTypeOutput(o.id); setResult(null); }}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border text-xs font-medium transition-all ${typeOutput === o.id ? "bg-sky-500/20 border-sky-500/50 text-sky-300" : "border-white/10 text-white/50 hover:border-white/20"}`}>
                  <span className="text-lg">{o.icon}</span>
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelClass}>{typeOutput === "newsletter" ? "Thème / actualité *" : "Objet / sujet *"}</label>
            <input className={inputClass} placeholder={objetPlaceholder[typeOutput]} value={objet} onChange={e => setObjet(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Destinataire</label>
            <select className={inputClass} value={destinataire} onChange={e => setDestinataire(e.target.value)}>
              {DESTINATAIRES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Contexte / informations clés</label>
            <textarea className={`${inputClass} resize-none h-20`}
              placeholder="ex: Client rencontré au salon, budget 30k MAD, décision avant fin octobre..."
              value={contexte} onChange={e => setContexte(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Ton</label>
            <div className="grid grid-cols-5 gap-2">
              {TONS.map(t => (
                <button key={t} onClick={() => setTon(t)}
                  className={`py-2 rounded-lg border text-xs font-medium transition-all ${ton === t ? "bg-sky-500/20 border-sky-500/50 text-sky-300" : "border-white/10 text-white/50 hover:border-white/20"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <button onClick={generate} disabled={loading || !objet.trim()}
            className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all">
            {loading ? "Samia rédige..." : `Générer ${OUTPUTS.find(o => o.id === typeOutput)?.label}`}
          </button>
        </div>
        <div className="bg-[#1C1F2E] rounded-xl p-4 min-h-[500px] overflow-y-auto">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-white/40">
              <div className="w-8 h-8 border-2 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" />
              <p className="text-sm">Samia rédige votre email...</p>
            </div>
          ) : (
            <EmailPreview data={result} typeOutput={typeOutput} />
          )}
        </div>
      </div>
    </div>
  );
}