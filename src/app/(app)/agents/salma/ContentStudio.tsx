"use client";

import { useState } from "react";
import { PostPreview } from "./PostPreview";
import { saveLivrable } from "@/app/(app)/livrables/actions";
import { useOrganization } from "@clerk/nextjs";
import { completeWorkflowStep } from "@/app/(app)/workflows/actions";
import { Prisma } from "@prisma/client";

type Network = "Instagram" | "LinkedIn" | "Facebook";
type Tone = "Professionnel" | "Décontracté" | "Inspirant" | "Humoristique" | "Éducatif";

type Post = {
  caption: string;
  hashtags: string[];
  visualSuggestion: string;
  hook: string;
};

type Props = {
    brandName?: string;
  tone?: string | null;
  icpProfile?: string | null;
  workflowId?: string;
  stepId?: string;
};

const networks: { id: Network; emoji: string; desc: string }[] = [
  { id: "Instagram", emoji: "📸", desc: "Visuel · Storytelling · Reels" },
  { id: "LinkedIn", emoji: "💼", desc: "B2B · Expertise · Réseau pro" },
  { id: "Facebook", emoji: "👥", desc: "Communauté · Portée · Partage" },
];

const tones: Tone[] = ["Professionnel", "Décontracté", "Inspirant", "Humoristique", "Éducatif"];

export function ContentStudio({ brandName, tone: brandTone, icpProfile, workflowId, stepId }: Props) {
  const { organization } = useOrganization();
  const [network, setNetwork] = useState<Network>("Instagram");
  const [theme, setTheme] = useState("");
  const [tone, setTone] = useState<Tone>(
    (brandTone && tones.includes(brandTone as Tone)) ? brandTone as Tone : "Professionnel"
  );
  const [cta, setCta] = useState("");
  const [targetAudience, setTargetAudience] = useState(icpProfile ?? "");
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState<Post | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isWorkflow = !!workflowId && !!stepId;

  async function handleGenerate() {
    if (!theme.trim()) return;
    setLoading(true);
    setPost(null);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch("/api/agents/salma/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ network, theme, tone, cta, targetAudience }),
      });
      const data = await res.json();
      if (data.success) {
        setPost(data.post);
      } else {
        setError("Erreur lors de la génération. Réessayez.");
      }
    } catch {
      setError("Erreur réseau. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!post) return;
    const content = `**Réseau :** ${network}\n**Ton :** ${tone}\n\n**Caption :**\n${post.caption}\n\n**Hashtags :** ${post.hashtags.map(h => `#${h}`).join(" ")}\n\n**Visuel suggéré :** ${post.visualSuggestion}`;
    await saveLivrable({
      agentSlug: "salma",
      content,
      title: `Post ${network} — ${theme.slice(0, 40)}`,
    });
    setSaved(true);
  }

  return (
    <div className="min-h-screen bg-[#0F1117] text-white">
      {/* Header Studio */}
      <div className="border-b border-[#2A2D3E] bg-[#1C1F2E]/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-sm font-bold">
            S
          </div>
          <div>
            <h1 className="font-semibold text-sm text-white" style={{ fontFamily: "'Bricolage Grotesque', Inter, sans-serif" }}>
              Studio Salma
            </h1>
            <p className="text-xs text-gray-500">ContentStudio — Génération de contenu social</p>
          </div>
          {post && !saved && (
            <button
              onClick={handleSave}
              className="ml-auto text-xs bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Enregistrer le post
            </button>
          )}
          {saved && (
            <span className="ml-auto text-xs text-emerald-400 font-medium">✓ Enregistré dans les livrables</span>
          )}
         {isWorkflow && post && (
  <button
    onClick={async () => {
      await completeWorkflowStep(workflowId!, stepId!, post as unknown as Prisma.InputJsonValue);
      window.location.href = `/workflows/${workflowId}`;
    }}
    className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all"
  >
    Terminer cette étape →
  </button>
)}
        </div>
      </div>

      {/* Corps — 2 colonnes */}
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* Colonne gauche — Formulaire (2/5) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Choix réseau */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Réseau cible</h2>
            <div className="space-y-2">
              {networks.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setNetwork(n.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    network === n.id
                      ? "border-violet-500 bg-violet-500/10"
                      : "border-[#2A2D3E] bg-[#1C1F2E] hover:border-[#3A3D4E]"
                  }`}
                >
                  <span className="text-lg">{n.emoji}</span>
                  <div>
                    <p className="text-sm font-medium text-white">{n.id}</p>
                    <p className="text-xs text-gray-500">{n.desc}</p>
                  </div>
                  {network === n.id && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-violet-400" />
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Thème */}
          <section className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Thème du post
            </label>
            <textarea
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="Ex : Lancement de notre nouveau service de comptabilité digitale pour PME…"
              rows={3}
              className="w-full bg-[#1C1F2E] border border-[#2A2D3E] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:border-violet-500 transition-colors"
            />
          </section>

          {/* Ton */}
          <section className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Ton</label>
            <div className="flex flex-wrap gap-2">
              {tones.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                    tone === t
                      ? "border-violet-500 bg-violet-500/20 text-violet-300"
                      : "border-[#2A2D3E] text-gray-400 hover:border-gray-500"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Call-to-action <span className="text-gray-600 normal-case font-normal">(optionnel)</span>
            </label>
            <input
              value={cta}
              onChange={(e) => setCta(e.target.value)}
              placeholder="Ex : Contactez-nous sur WhatsApp"
              className="w-full bg-[#1C1F2E] border border-[#2A2D3E] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </section>

          {/* Audience */}
          <section className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Audience <span className="text-gray-600 normal-case font-normal">(optionnel)</span>
            </label>
            <input
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="Ex : Gérants de PME marocaines"
              className="w-full bg-[#1C1F2E] border border-[#2A2D3E] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </section>

          {/* Bouton générer */}
          <button
            onClick={handleGenerate}
            disabled={loading || !theme.trim()}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-violet-600 hover:bg-violet-500 text-white relative overflow-hidden"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Salma génère votre post…
              </span>
            ) : (
              "Générer le post"
            )}
          </button>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>

        {/* Colonne droite — Aperçu (3/5) */}
        <div className="lg:col-span-3">
          {post ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <PostPreview post={post} network={network} brandName={brandName || organization?.name} />

              {/* Texte copyable */}
              <div className="mt-4 bg-[#1C1F2E] border border-[#2A2D3E] rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Texte prêt à copier</h3>
                <p className="text-sm text-gray-200 whitespace-pre-line leading-relaxed">{post.caption}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {post.hashtags.map((tag, i) => (
                    <span key={i} className="text-xs text-violet-400 font-medium">#{tag}</span>
                  ))}
                </div>
                <button
                  onClick={() => {
                    const text = `${post.caption}\n\n${post.hashtags.map(h => `#${h}`).join(" ")}`;
                    navigator.clipboard.writeText(text);
                  }}
                  className="text-xs text-gray-400 hover:text-white border border-[#2A2D3E] hover:border-gray-500 px-3 py-1.5 rounded-lg transition-all"
                >
                  Copier le texte
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-64 flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-[#2A2D3E] p-12">
              <div className="w-14 h-14 rounded-2xl bg-[#1C1F2E] flex items-center justify-center text-2xl mb-4">
                ✨
              </div>
              <p className="text-gray-400 text-sm font-medium">Votre post apparaîtra ici</p>
              <p className="text-gray-600 text-xs mt-1">Choisissez un réseau, décrivez votre thème, et générez</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
