"use client";

import { useState } from "react";
import { SequencePreview } from "./SequencePreview";
import { saveLivrable } from "@/app/(app)/livrables/actions";
import { completeWorkflowStep } from "@/app/(app)/workflows/actions";
import { useRouter } from "next/navigation";
import type { BrandKit } from "@prisma/client";



type Channel = "WhatsApp" | "LinkedIn" | "Email" | "SMS";
type Objective = "Décrocher un RDV" | "Présenter une offre" | "Demander une démo" | "Relancer un prospect froid";
type Tone = "Professionnel" | "Chaleureux" | "Direct" | "Consultant";

type Sequence = {
  messages: { step: string; day: number; text: string; subject?: string }[];
  channel: string;
  tip: string;
};

const channels: { id: Channel; emoji: string; desc: string }[] = [
  { id: "WhatsApp", emoji: "💬", desc: "Canal #1 B2B au Maroc" },
  { id: "LinkedIn", emoji: "💼", desc: "Profils corporate & décideurs" },
  { id: "Email", emoji: "✉️", desc: "Prospection froide structurée" },
  { id: "SMS", emoji: "📱", desc: "Relance courte & directe" },
];

const objectives: Objective[] = [
  "Décrocher un RDV",
  "Présenter une offre",
  "Demander une démo",
  "Relancer un prospect froid",
];

const tones: Tone[] = ["Professionnel", "Chaleureux", "Direct", "Consultant"];
const companySizes = ["TPE (1–9)", "PME (10–50)", "ETI (50–250)", "Grande entreprise (250+)"];

type ProspectStudioProps = {
  workflowId?: string
  stepId?: string
  brandKit?: BrandKit | null
}

export function ProspectStudio({ workflowId, stepId, brandKit }: ProspectStudioProps) {
  const [channel, setChannel] = useState<Channel>("WhatsApp");
  const [sector, setSector] = useState(brandKit?.sector ?? "");
  const [tone, setTone] = useState<Tone>((brandKit?.tone as Tone) ?? "Professionnel");
  const [prospectRole, setProspectRole] = useState("");
  const [companySize, setCompanySize] = useState("PME (10–50)");
  const [objective, setObjective] = useState<Objective>("Décrocher un RDV");
   const [loading, setLoading] = useState(false);
  const [sequence, setSequence] = useState<Sequence | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [completingStep, setCompletingStep] = useState(false);
  const router = useRouter();

  async function handleCompleteStep() {
    if (!workflowId || !stepId || !sequence) return;
    setCompletingStep(true);
    await completeWorkflowStep(workflowId, stepId, {
      channel,
      sector,
      prospectRole,
      sequence,
    });
    router.push(`/workflows/${workflowId}`);
  }

  async function handleGenerate() {
    if (!sector.trim() || !prospectRole.trim()) return;
    setLoading(true);
    setSequence(null);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch("/api/agents/youssef/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel, sector, prospectRole, companySize, objective, tone }),
      });
      const data = await res.json();
      if (data.success) {
        setSequence(data.sequence);
      } else {
        setError("Erreur lors de la génération. Réessayez.");
      }
    } catch {
      setError("Erreur réseau. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(text.slice(0, 20));
    setTimeout(() => setCopied(null), 2000);
  }

  async function handleSave() {
    if (!sequence) return;
    const content = sequence.messages
      .map((m) => `**${m.step} (${m.day === 0 ? "Aujourd'hui" : `J+${m.day}`})**${m.subject ? `\nObjet : ${m.subject}` : ""}\n\n${m.text}`)
      .join("\n\n---\n\n");
    await saveLivrable({
      agentSlug: "youssef",
      title: `Séquence ${channel} — ${sector.slice(0, 40)}`,
      content: `${content}\n\n💡 **Conseil :** ${sequence.tip}`,
    });
    setSaved(true);
  }

  return (
    <div className="min-h-screen bg-[#0F1117] text-white">
      {/* Header */}
      <div className="border-b border-[#2A2D3E] bg-[#1C1F2E]/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-sm font-bold">
            Y
          </div>
          <div>
            <h1 className="font-semibold text-sm text-white" style={{ fontFamily: "'Bricolage Grotesque', Inter, sans-serif" }}>
              Studio Youssef
            </h1>
            <p className="text-xs text-gray-500">ProspectStudio — Séquences de prospection B2B multi-canal</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {sequence && !saved && (
              <button onClick={handleSave} className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Enregistrer la séquence
              </button>
            )}
            {saved && <span className="text-xs text-emerald-400 font-medium">✓ Enregistré dans les livrables</span>}
            {copied && <span className="text-xs text-blue-400 font-medium">✓ Copié !</span>}
            {workflowId && stepId && sequence && (
              <button
                onClick={handleCompleteStep}
                disabled={completingStep}
                className="text-xs bg-[#7C5CFC] hover:bg-[#6B4FDB] disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {completingStep ? "En cours…" : "Terminer cette étape →"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Corps — inchangé */}
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="space-y-3">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Canal</h2>
            <div className="space-y-2">
              {channels.map((c) => (
                <button key={c.id} onClick={() => setChannel(c.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    channel === c.id ? "border-emerald-500 bg-emerald-500/10" : "border-[#2A2D3E] bg-[#1C1F2E] hover:border-[#3A3D4E]"
                  }`}>
                  <span className="text-lg">{c.emoji}</span>
                  <div>
                    <p className="text-sm font-medium text-white">{c.id}</p>
                    <p className="text-xs text-gray-500">{c.desc}</p>
                  </div>
                  {channel === c.id && <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400" />}
                </button>
              ))}
            </div>
          </section>
          <section className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Secteur cible</label>
            <input value={sector} onChange={(e) => setSector(e.target.value)}
              placeholder="Ex : Cabinets comptables, Promoteurs immobiliers…"
              className="w-full bg-[#1C1F2E] border border-[#2A2D3E] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors" />
          </section>
          <section className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Poste du prospect</label>
            <input value={prospectRole} onChange={(e) => setProspectRole(e.target.value)}
              placeholder="Ex : Directeur Général, DAF, Gérant…"
              className="w-full bg-[#1C1F2E] border border-[#2A2D3E] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors" />
          </section>
          <section className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Taille entreprise</label>
            <div className="flex flex-wrap gap-2">
              {companySizes.map((s) => (
                <button key={s} onClick={() => setCompanySize(s)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                    companySize === s ? "border-emerald-500 bg-emerald-500/20 text-emerald-300" : "border-[#2A2D3E] text-gray-400 hover:border-gray-500"
                  }`}>{s}</button>
              ))}
            </div>
          </section>
          <section className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Objectif</label>
            <div className="space-y-1">
              {objectives.map((o) => (
                <button key={o} onClick={() => setObjective(o)}
                  className={`w-full text-left text-xs px-3 py-2 rounded-lg border font-medium transition-all ${
                    objective === o ? "border-emerald-500 bg-emerald-500/20 text-emerald-300" : "border-[#2A2D3E] text-gray-400 hover:border-gray-500"
                  }`}>{o}</button>
              ))}
            </div>
          </section>
          <section className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Ton</label>
            <div className="flex flex-wrap gap-2">
              {tones.map((t) => (
                <button key={t} onClick={() => setTone(t)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                    tone === t ? "border-emerald-500 bg-emerald-500/20 text-emerald-300" : "border-[#2A2D3E] text-gray-400 hover:border-gray-500"
                  }`}>{t}</button>
              ))}
            </div>
          </section>
          <button onClick={handleGenerate} disabled={loading || !sector.trim() || !prospectRole.trim()}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-emerald-600 hover:bg-emerald-500 text-white">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Youssef prépare votre séquence…
              </span>
            ) : "Générer la séquence"}
          </button>
          {error && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
        </div>
        <div className="lg:col-span-3">
          {sequence ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <SequencePreview sequence={sequence} onCopy={handleCopy} />
            </div>
          ) : (
            <div className="h-full min-h-64 flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-[#2A2D3E] p-12">
              <div className="w-14 h-14 rounded-2xl bg-[#1C1F2E] flex items-center justify-center text-2xl mb-4">🎯</div>
              <p className="text-gray-400 text-sm font-medium">Votre séquence apparaîtra ici</p>
              <p className="text-gray-600 text-xs mt-1">Choisissez un canal, décrivez votre cible, et générez</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}