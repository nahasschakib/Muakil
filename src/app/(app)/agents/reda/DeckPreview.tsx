"use client";

interface Slide {
  numero: number;
  titre: string;
  type: string;
  contenu: string;
  notes: string;
}

interface DeckPreviewProps {
  data: Record<string, unknown> | null;
}

const slideStyles: Record<string, { bg: string; accent: string; icon: string }> = {
  cover:     { bg: "bg-slate-800", accent: "border-violet-400", icon: "🎯" },
  problem:   { bg: "bg-red-50",    accent: "border-red-400",    icon: "⚠️" },
  solution:  { bg: "bg-emerald-50",accent: "border-emerald-400",icon: "✅" },
  value:     { bg: "bg-blue-50",   accent: "border-blue-400",   icon: "⚡" },
  cta:       { bg: "bg-violet-50", accent: "border-violet-400", icon: "🚀" },
  context:   { bg: "bg-gray-50",   accent: "border-gray-400",   icon: "📋" },
  approach:  { bg: "bg-indigo-50", accent: "border-indigo-400", icon: "🧭" },
  offer:     { bg: "bg-amber-50",  accent: "border-amber-400",  icon: "💼" },
  next:      { bg: "bg-teal-50",   accent: "border-teal-400",   icon: "📅" },
  agenda:    { bg: "bg-gray-50",   accent: "border-gray-400",   icon: "📝" },
  decisions: { bg: "bg-green-50",  accent: "border-green-400",  icon: "✔️" },
  actions:   { bg: "bg-orange-50", accent: "border-orange-400", icon: "🎯" },
};

export default function DeckPreview({ data }: DeckPreviewProps) {
  if (!data) return (
    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
      La présentation apparaîtra ici après génération
    </div>
  );

  const slides = data.slides as Slide[];
  const tip = data.tip as string;

  return (
    <div className="space-y-3 text-sm">
      <h2 className="text-base font-bold text-white/80 mb-4">
        📊 {slides?.length} slides générées
      </h2>

      {slides?.map((slide) => {
        const style = slideStyles[slide.type] || { bg: "bg-gray-50", accent: "border-gray-300", icon: "📄" };
        const isCover = slide.type === "cover";

        return (
          <div
            key={slide.numero}
            className={`rounded-xl border-l-4 ${style.accent} overflow-hidden`}
          >
            {/* Header slide */}
            <div className={`${isCover ? "bg-slate-800" : "bg-white"} px-4 py-3`}>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isCover ? "bg-white/10 text-white/60" : "bg-gray-100 text-gray-500"}`}>
                  {slide.numero}
                </span>
                <span className="text-sm">{style.icon}</span>
                <h3 className={`font-semibold text-sm ${isCover ? "text-white" : "text-gray-800"}`}>
                  {slide.titre}
                </h3>
              </div>
              <p className={`mt-2 text-sm ${isCover ? "text-white/80" : "text-gray-600"} leading-relaxed`}>
                {slide.contenu}
              </p>
            </div>

            {/* Note orateur */}
            {slide.notes && (
              <div className="bg-yellow-50 border-t border-yellow-100 px-4 py-2">
                <p className="text-xs text-yellow-700 italic">
                  🎤 <span className="font-medium">Orateur :</span> {slide.notes}
                </p>
              </div>
            )}
          </div>
        );
      })}

      {tip && (
        <div className="bg-violet-900/30 border-l-4 border-violet-400 p-3 rounded mt-4">
          <p className="text-violet-300 text-xs font-medium">💡 Conseil Reda</p>
          <p className="text-violet-200 text-xs mt-1">{tip}</p>
        </div>
      )}
    </div>
  );
}