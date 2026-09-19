"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { ProposalPreview } from "./ProposalPreview";
import { saveLivrable } from "@/app/(app)/livrables/actions";
import { completeWorkflowStep } from "@/app/(app)/workflows/actions";
import { useRouter } from "next/navigation";

type ProspectSize = "TPE (1–9)" | "PME (10–50)" | "ETI (50–250)" | "Grande entreprise (250+)";

type ProposalStudioProps = {
  brandName?: string;
  workflowId?: string;
  stepId?: string;
  previousOutput?: Record<string, unknown> | null;
}
const prospectSizes: ProspectSize[] = ["TPE (1–9)", "PME (10–50)", "ETI (50–250)", "Grande entreprise (250+)"];

const budgetRanges = [
  "Moins de 5 000 MAD/mois",
  "5 000 – 15 000 MAD/mois",
  "15 000 – 50 000 MAD/mois",
  "50 000+ MAD/mois",
  "Non communiqué",
];

type Proposal = any;



export function ProposalStudio({ brandName, workflowId, stepId, previousOutput }: ProposalStudioProps) {
  const [prospectName, setProspectName] = useState("");
  const [prospectSector, setProspectSector] = useState((previousOutput?.prospectSector as string) ?? "");
  const [prospectRole, setProspectRole] = useState((previousOutput?.prospectRole as string) ?? "");
  const [prospectSize, setProspectSize] = useState<ProspectSize>("PME (10–50)");
  const [problem, setProblem] = useState("");
  const [services, setServices] = useState("");
  const [budget, setBudget] = useState("Non communiqué");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completingStep, setCompletingStep] = useState(false);
  const router = useRouter();

  async function handleCompleteStep() {
    if (!workflowId || !stepId || !proposal) return;
    setCompletingStep(true);
    await completeWorkflowStep(workflowId, stepId, {
      prospectName,
      prospectSector,
      proposal,
    });
    router.push(`/workflows/${workflowId}`);
  }


  async function autoGenerate(sector: string, role: string) {
    const problemCtx = (previousOutput as any)?.brief?.bant?.need ?? "";
    const servicesCtx = (previousOutput as any)?.brief?.summary ?? "";
    const nameCtx = role;

    setLoading(true);
    setProposal(null);
    setError(null);
    try {
      const res = await fetch("/api/agents/karim/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prospectName: nameCtx,
          prospectSector: sector,
          prospectSize,
          problem: problemCtx,
          services: servicesCtx,
          budget,
          deadline,
        }),
      });
      const data = await res.json();
      if (data.success) setProposal(data.proposal);
      else setError("Erreur lors de la génération. Réessayez.");
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (previousOutput?.prospectSector && previousOutput?.prospectRole) {
      setTimeout(() => autoGenerate(String(previousOutput.prospectSector), String(previousOutput.prospectRole)), 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

    async function handleGenerate() {
    if (!prospectName.trim() || !problem.trim() || !services.trim()) return;
    setLoading(true);
    setProposal(null);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/agents/karim/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospectName, prospectSector, prospectSize, problem, services, budget, deadline }),
      });
      const data = await res.json();
      if (data.success) setProposal(data.proposal);
      else setError("Erreur lors de la génération. Réessayez.");
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!proposal) return;
    const content = `## Proposition commerciale — ${prospectName}

**Situation :** ${proposal.intro}

**Complication :** ${proposal.problem}

**Notre résolution :** ${proposal.approach}

## Options

${proposal.options.map((o: any) => `### ${o.name} — ${o.price}
${o.description}
${o.inclus.map((i: string) => `- ✓ ${i}`).join("\n")}`).join("\n\n")}

## Valeur générée
${proposal.roi}

## Prochaines étapes
${proposal.nextSteps.map((s: string, i: number) => `${i + 1}. ${s}`).join("\n")}

_${proposal.validity}_

💡 **Conseil :** ${proposal.tip}`;

    await saveLivrable({
      agentSlug: "karim",
      title: `Proposition commerciale — ${prospectName}`,
      content,
    });
    setSaved(true);
  }

  function handlePrint() {
    localStorage.setItem("muakil_print_proposal", JSON.stringify({ proposal, prospectName, brandName }));
    window.open("/print/karim", "_blank");
  }

  return (
    <div className="min-h-screen bg-[#0F1117] text-white">
      {/* Header */}
      <div className="border-b border-[#2A2D3E] bg-[#1C1F2E]/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-700 flex items-center justify-center text-sm font-bold">
            K
          </div>
          <div>
            <h1 className="font-semibold text-sm text-white" style={{ fontFamily: "'Bricolage Grotesque', Inter, sans-serif" }}>
              Studio Karim
            </h1>
            <p className="text-xs text-gray-500">ProposalStudio — Propositions commerciales SCR 3 options</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {proposal && (
              <button onClick={handlePrint} className="text-xs border border-[#2A2D3E] hover:border-gray-500 text-gray-300 px-4 py-2 rounded-lg font-medium transition-colors">
                Imprimer / PDF
              </button>
            )}
            {proposal && !saved && (
              <button onClick={handleSave} className="text-xs bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Enregistrer la proposition
              </button>
            )}
            {saved && <span className="text-xs text-emerald-400 font-medium">✓ Enregistrée</span>}
            {workflowId && stepId && proposal && (
              <button onClick={handleCompleteStep} disabled={completingStep}
                className="text-xs bg-[#7C5CFC] hover:bg-[#6B4FDB] disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                {completingStep ? "En cours…" : "Terminer cette étape →"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* Formulaire (2/5) */}
        <div className="lg:col-span-2 space-y-5">
          <section className="space-y-2">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Prospect</h2>
            <input value={prospectName} onChange={(e) => setProspectName(e.target.value)}
              placeholder="Nom de l'entreprise ou du contact"
              className="w-full bg-[#1C1F2E] border border-[#2A2D3E] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 transition-colors" />
            <input value={prospectSector} onChange={(e) => setProspectSector(e.target.value)}
              placeholder="Secteur d'activité"
              className="w-full bg-[#1C1F2E] border border-[#2A2D3E] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 transition-colors" />
          </section>
          <section className="space-y-2">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Taille</h2>
            <div className="flex flex-wrap gap-2">
              {prospectSizes.map((s) => (
                <button key={s} onClick={() => setProspectSize(s)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                    prospectSize === s ? "border-amber-500 bg-amber-500/20 text-amber-300" : "border-[#2A2D3E] text-gray-400 hover:border-gray-500"
                  }`}>{s}</button>
              ))}
            </div>
          </section>
          <section className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Problème identifié</label>
            <textarea value={problem} onChange={(e) => setProblem(e.target.value)} rows={3}
              placeholder="Quel problème ou besoin avez-vous identifié chez ce prospect ?"
              className="w-full bg-[#1C1F2E] border border-[#2A2D3E] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:border-amber-500 transition-colors" />
          </section>
          <section className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Services à proposer</label>
            <textarea value={services} onChange={(e) => setServices(e.target.value)} rows={3}
              placeholder="Ex : Comptabilité mensuelle, audit, conseil fiscal, digitalisation…"
              className="w-full bg-[#1C1F2E] border border-[#2A2D3E] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:border-amber-500 transition-colors" />
          </section>
          <section className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Budget évoqué</label>
            <div className="space-y-1">
              {budgetRanges.map((b) => (
                <button key={b} onClick={() => setBudget(b)}
                  className={`w-full text-left text-xs px-3 py-2 rounded-lg border font-medium transition-all ${
                    budget === b ? "border-amber-500 bg-amber-500/20 text-amber-300" : "border-[#2A2D3E] text-gray-400 hover:border-gray-500"
                  }`}>{b}</button>
              ))}
            </div>
          </section>
          <section className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Délai souhaité <span className="text-gray-600 font-normal normal-case">(optionnel)</span>
            </label>
            <input value={deadline} onChange={(e) => setDeadline(e.target.value)}
              placeholder="Ex : Démarrage janvier 2026, urgent…"
              className="w-full bg-[#1C1F2E] border border-[#2A2D3E] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 transition-colors" />
          </section>
          <button onClick={handleGenerate}
            disabled={loading || !prospectName.trim() || !problem.trim() || !services.trim()}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-amber-600 hover:bg-amber-500 text-white">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Karim prépare votre proposition…
              </span>
            ) : "Générer la proposition"}
          </button>
          {error && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
        </div>

        {/* Aperçu (3/5) */}
        <div className="lg:col-span-3">
          {proposal ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ProposalPreview proposal={proposal} prospectName={prospectName} brandName={brandName} />
            </div>
          ) : (
            <div className="h-full min-h-64 flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-[#2A2D3E] p-12">
              <div className="w-14 h-14 rounded-2xl bg-[#1C1F2E] flex items-center justify-center text-2xl mb-4">📄</div>
              <p className="text-gray-400 text-sm font-medium">Votre proposition apparaîtra ici</p>
              <p className="text-gray-600 text-xs mt-1">Décrivez le prospect, le problème et les services à proposer</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


