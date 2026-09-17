"use client";

type ProductSheet = {
  titre: string;
  sousTitre: string;
  description: string;
  avantages: string[];
  caracteristiques: string[];
  prix: string;
  badge?: string;
  cta: string;
  seoKeywords: string[];
};

type VideoScript = {
  hook: string;
  intro: string;
  demo: string;
  temoignage: string;
  cta: string;
  hashtags: string[];
  duration: string;
};

type Content = {
  productSheet: ProductSheet;
  videoScript: VideoScript;
  tip: string;
};

type Props = {
  content: Content;
  productName: string;
  price: string;
  platform: string;
  contentType: string;
  productImage?: string | null;
};

const platformConfig: Record<string, { color: string; bg: string; badge: string }> = {
  Jumia: { color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20", badge: "bg-orange-500" },
  Hmizate: { color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", badge: "bg-blue-500" },
  "Site propre": { color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20", badge: "bg-violet-500" },
  "Instagram Shop": { color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/20", badge: "bg-pink-500" },
  "WhatsApp Business": { color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", badge: "bg-emerald-500" },
};

export function ProductPreview({ content, productName, price, platform, contentType, productImage }: Props) {
  const cfg = platformConfig[platform] || platformConfig["Site propre"];
  const { productSheet, videoScript } = content;

  return (
    <div className="space-y-4">
      {/* Fiche produit */}
      {(contentType === "fiche" || contentType === "les deux") && (
        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
          {/* Header fiche */}
          <div className="bg-[#1C1F2E] px-5 py-4 flex items-center justify-between">
            <span className={`text-xs font-bold px-3 py-1 rounded-full text-white ${cfg.badge}`}>
              {platform}
            </span>
            {productSheet.badge && (
              <span className="text-xs font-bold bg-red-500 text-white px-3 py-1 rounded-full">
                {productSheet.badge}
              </span>
            )}
          </div>

          {/* Image */}
          <div className="h-48 overflow-hidden">
            {productImage ? (
              <img src={productImage} alt={productName} className="w-full h-full object-cover" />
            ) : (
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-4xl mb-1">🛍️</p>
                  <p className="text-xs text-gray-500">{productName}</p>
                </div>
              </div>
            )}
          </div>

          {/* Contenu fiche */}
          <div className="p-5 space-y-4">
            <div>
              <h2 className="font-bold text-gray-900 text-base leading-tight">{productSheet.titre}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{productSheet.sousTitre}</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-gray-900">{productSheet.prix}</span>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className="text-yellow-400 text-sm">★</span>
                ))}
                <span className="text-xs text-gray-400 ml-1">(4.8)</span>
              </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{productSheet.description}</p>

            {/* Avantages */}
            <div className="space-y-1.5">
              {productSheet.avantages.map((a, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-emerald-500 flex-shrink-0">✓</span>
                  {a}
                </div>
              ))}
            </div>

            {/* CTA */}
            <button className={`w-full py-3 rounded-xl font-bold text-white text-sm ${cfg.badge}`}>
              {productSheet.cta}
            </button>

            {/* SEO Keywords */}
            <div className="flex flex-wrap gap-1 pt-1">
              {productSheet.seoKeywords.map((k, i) => (
                <span key={i} className={`text-xs px-2 py-0.5 rounded border ${cfg.bg} ${cfg.color}`}>
                  {k}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Script vidéo */}
      {(contentType === "script" || contentType === "les deux") && (
        <div className="bg-[#1C1F2E] border border-[#2A2D3E] rounded-2xl overflow-hidden">
          <div className="bg-[#0F1117] px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-red-500 text-lg">▶</span>
              <span className="text-sm font-semibold text-white">Script Vidéo</span>
            </div>
            <span className="text-xs text-gray-400">{videoScript.duration}</span>
          </div>

          <div className="p-5 space-y-4">
            {[
              { label: "🎣 Hook", color: "border-red-500/30 bg-red-500/5", content: videoScript.hook },
              { label: "👋 Intro", color: "border-blue-500/30 bg-blue-500/5", content: videoScript.intro },
              { label: "🎬 Démo", color: "border-violet-500/30 bg-violet-500/5", content: videoScript.demo },
              { label: "⭐ Témoignage", color: "border-amber-500/30 bg-amber-500/5", content: videoScript.temoignage },
              { label: "📣 CTA Final", color: "border-emerald-500/30 bg-emerald-500/5", content: videoScript.cta },
            ].map((section, i) => (
              <div key={i} className={`border rounded-xl p-3 ${section.color}`}>
                <p className="text-xs font-semibold text-gray-400 mb-1">{section.label}</p>
                <p className="text-sm text-gray-200 leading-relaxed">{section.content}</p>
              </div>
            ))}

            {/* Hashtags */}
            <div className="flex flex-wrap gap-1 pt-1">
              {videoScript.hashtags.map((h, i) => (
                <span key={i} className="text-xs text-pink-400 font-medium">#{h}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Conseil Yasmine */}
      {content.tip && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4">
          <p className="text-xs text-rose-400 font-semibold mb-1">💡 Conseil de Yasmine</p>
          <p className="text-sm text-rose-200/80">{content.tip}</p>
        </div>
      )}
    </div>
  );
}
