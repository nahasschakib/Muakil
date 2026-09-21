"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { ProductPreview } from "./ProductPreview";
import { saveLivrable } from "@/app/(app)/livrables/actions";
import { completeWorkflowStep } from "@/app/(app)/workflows/actions";
import { Prisma } from "@prisma/client";

type Platform =
  | "Jumia"
  | "Hmizate"
  | "Site propre"
  | "Instagram Shop"
  | "WhatsApp Business";
type Season = "Toute saison" | "Ramadan" | "Aïd" | "Rentrée" | "Été" | "Hiver";
type ContentType = "fiche" | "script" | "les deux";

const platforms: { id: Platform; emoji: string; desc: string }[] = [
  { id: "Jumia", emoji: "🛒", desc: "Marketplace #1 Maroc" },
  { id: "Hmizate", emoji: "💰", desc: "Deals & promotions" },
  { id: "Site propre", emoji: "🌐", desc: "Boutique en ligne" },
  { id: "Instagram Shop", emoji: "📸", desc: "Social commerce" },
  { id: "WhatsApp Business", emoji: "💬", desc: "Vente directe" },
];

const seasons: Season[] = [
  "Toute saison",
  "Ramadan",
  "Aïd",
  "Rentrée",
  "Été",
  "Hiver",
];
const contentTypes: { id: ContentType; label: string; desc: string }[] = [
  {
    id: "fiche",
    label: "Fiche produit",
    desc: "Description + avantages + SEO",
  },
  { id: "script", label: "Script vidéo", desc: "Reels / TikTok / YouTube" },
  { id: "les deux", label: "Les deux", desc: "Fiche + script complets" },
];

const categories = [
  "Mode & Vêtements",
  "Beauté & Cosmétiques",
  "Électronique",
  "Maison & Déco",
  "Alimentation",
  "Sport & Fitness",
  "Enfants & Jouets",
  "Bijoux & Accessoires",
  "Auto & Moto",
  "Services",
];

type Content = any;

type EcomStudioProps = {
  icpProfile?: string | null;
  workflowId?: string;
  stepId?: string;
};

export function EcomStudio({
  icpProfile,
  workflowId,
  stepId,
}: EcomStudioProps) {
  const [platform, setPlatform] = useState<Platform>("Instagram Shop");
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("Mode & Vêtements");
  const [price, setPrice] = useState("");
  const [season, setSeason] = useState<Season>("Toute saison");
  const [contentType, setContentType] = useState<ContentType>("les deux");
  const [description, setDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState(icpProfile ?? "");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<Content | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productImage, setProductImage] = useState<string | null>(null);

  const isWorkflow = !!workflowId && !!stepId;

  async function handleGenerate() {
    if (!productName.trim() || !price.trim()) return;
    setLoading(true);
    setContent(null);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch("/api/agents/yasmine/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          category,
          price,
          platform,
          season,
          contentType,
          description,
          targetAudience,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setContent(data.content);
      } else {
        setError("Erreur lors de la génération. Réessayez.");
      }
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!content) return;
    const ps = content.productSheet;
    const vs = content.videoScript;
    const text = `## ${ps.titre}\n\n${ps.description}\n\n**Avantages :**\n${ps.avantages.map((a: string) => `- ${a}`).join("\n")}\n\n**Prix :** ${ps.prix}\n\n---\n\n## Script Vidéo\n\n🎣 **Hook :** ${vs.hook}\n👋 **Intro :** ${vs.intro}\n🎬 **Démo :** ${vs.demo}\n⭐ **Témoignage :** ${vs.temoignage}\n📣 **CTA :** ${vs.cta}\n\n💡 **Conseil :** ${content.tip}`;
    await saveLivrable({
      agentSlug: "yasmine",
      title: `${ps.titre} — ${platform}`,
      content: text,
    });
    setSaved(true);
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProductImage(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div className="min-h-screen bg-[#0F1117] text-white">
      {/* Header */}
      <div className="border-b border-[#2A2D3E] bg-[#1C1F2E]/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-700 flex items-center justify-center text-sm font-bold">
            Y
          </div>
          <div>
            <h1
              className="font-semibold text-sm text-white"
              style={{ fontFamily: "'Bricolage Grotesque', Inter, sans-serif" }}
            >
              Studio Yasmine
            </h1>
            <p className="text-xs text-gray-500">
              EcomStudio — Fiches produits & scripts vidéo pour le marché
              marocain
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {content && !saved && (
              <button
                onClick={handleSave}
                className="text-xs bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Enregistrer
              </button>
            )}
            {saved && (
              <span className="text-xs text-emerald-400 font-medium">
                ✓ Enregistré
              </span>
            )}
          </div>
          {isWorkflow && content && (
  <button
    onClick={async () => {
      await completeWorkflowStep(workflowId!, stepId!, content as unknown as Prisma.InputJsonValue);
      window.location.href = `/workflows/${workflowId}`;
    }}
    className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all"
  >
    Terminer cette étape →
  </button>
)}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Formulaire (2/5) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Plateforme */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Plateforme
            </h2>
            <div className="space-y-2">
              {platforms.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    platform === p.id
                      ? "border-rose-500 bg-rose-500/10"
                      : "border-[#2A2D3E] bg-[#1C1F2E] hover:border-[#3A3D4E]"
                  }`}
                >
                  <span className="text-lg">{p.emoji}</span>
                  <div>
                    <p className="text-sm font-medium text-white">{p.id}</p>
                    <p className="text-xs text-gray-500">{p.desc}</p>
                  </div>
                  {platform === p.id && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-rose-400" />
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Type de contenu */}
          <section className="space-y-2">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Type de contenu
            </h2>
            <div className="space-y-1">
              {contentTypes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setContentType(t.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                    contentType === t.id
                      ? "border-rose-500 bg-rose-500/20 text-rose-300"
                      : "border-[#2A2D3E] text-gray-400 hover:border-gray-500"
                  }`}
                >
                  {t.label}{" "}
                  <span className="text-gray-500 font-normal">— {t.desc}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Produit */}
          <section className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Nom du produit
            </label>
            <input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Ex : Robe Caftan brodée main…"
              className="w-full bg-[#1C1F2E] border border-[#2A2D3E] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-rose-500 transition-colors"
            />
          </section>

          {/* Photo produit */}
          <section className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Photo produit{" "}
              <span className="text-gray-600 font-normal normal-case">
                (optionnel)
              </span>
            </label>
            {productImage ? (
              <div className="relative">
                <img
                  src={productImage}
                  alt="produit"
                  className="w-full h-40 object-cover rounded-xl border border-[#2A2D3E]"
                />
                <button
                  onClick={() => setProductImage(null)}
                  className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg"
                >
                  Supprimer
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-[#2A2D3E] rounded-xl cursor-pointer hover:border-rose-500 transition-colors">
                <span className="text-2xl mb-1">📷</span>
                <span className="text-xs text-gray-500">
                  Cliquer pour uploader une photo
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </section>

          {/* Catégorie */}
          <section className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Catégorie
            </label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    category === c
                      ? "border-rose-500 bg-rose-500/20 text-rose-300"
                      : "border-[#2A2D3E] text-gray-400 hover:border-gray-500"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </section>

          {/* Prix */}
          <section className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Prix (MAD)
            </label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              min="0"
              placeholder="Ex : 299"
              className="w-full bg-[#1C1F2E] border border-[#2A2D3E] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-rose-500 transition-colors"
            />
          </section>

          {/* Saison */}
          <section className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Saison / Occasion
            </label>
            <div className="flex flex-wrap gap-2">
              {seasons.map((s) => (
                <button
                  key={s}
                  onClick={() => setSeason(s)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                    season === s
                      ? "border-rose-500 bg-rose-500/20 text-rose-300"
                      : "border-[#2A2D3E] text-gray-400 hover:border-gray-500"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </section>

          {/* Description */}
          <section className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Description{" "}
              <span className="text-gray-600 font-normal normal-case">
                (optionnel)
              </span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Caractéristiques, matières, dimensions…"
              className="w-full bg-[#1C1F2E] border border-[#2A2D3E] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:border-rose-500 transition-colors"
            />
          </section>

          {/* Audience */}
          <section className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Audience{" "}
              <span className="text-gray-600 font-normal normal-case">
                (optionnel)
              </span>
            </label>
            <input
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="Ex : Femmes 25-45 ans, Casablanca…"
              className="w-full bg-[#1C1F2E] border border-[#2A2D3E] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-rose-500 transition-colors"
            />
          </section>

          <button
            onClick={handleGenerate}
            disabled={loading || !productName.trim() || !price.trim()}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-rose-600 hover:bg-rose-500 text-white"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Yasmine prépare votre contenu…
              </span>
            ) : (
              "Générer le contenu"
            )}
          </button>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>

        {/* Aperçu (3/5) */}
        <div className="lg:col-span-3">
          {content ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ProductPreview
                content={content}
                productName={productName}
                price={price}
                platform={platform}
                contentType={contentType}
                productImage={productImage}
              />
            </div>
          ) : (
            <div className="h-full min-h-64 flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-[#2A2D3E] p-12">
              <div className="w-14 h-14 rounded-2xl bg-[#1C1F2E] flex items-center justify-center text-2xl mb-4">
                🛍️
              </div>
              <p className="text-gray-400 text-sm font-medium">
                Votre fiche produit apparaîtra ici
              </p>
              <p className="text-gray-600 text-xs mt-1">
                Décrivez votre produit et choisissez la plateforme
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
