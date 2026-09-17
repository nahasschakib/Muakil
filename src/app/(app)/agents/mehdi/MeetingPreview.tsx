"use client";

type BANT = {
  budget: string;
  authority: string;
  need: string;
  timeline: string;
};

type Question = {
  category: string;
  question: string;
};

type Objection = {
  objection: string;
  reponse: string;
};

type Brief = {
  summary: string;
  bant: BANT;
  questions: Question[];
  objections: Objection[];
  agenda: string[];
  tip: string;
};

type Props = {
  brief: Brief;
  meetingType: string;
  prospectRole: string;
  prospectSector: string;
};

const bantLabels = {
  budget: { label: "Budget", icon: "💰", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  authority: { label: "Décideur", icon: "👤", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  need: { label: "Besoin", icon: "🎯", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
  timeline: { label: "Calendrier", icon: "📅", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
};

const categoryColors: Record<string, string> = {
  "Découverte": "bg-blue-500/20 text-blue-300",
  "BANT": "bg-violet-500/20 text-violet-300",
  "Objection": "bg-orange-500/20 text-orange-300",
};

export function MeetingPreview({ brief, meetingType, prospectRole, prospectSector }: Props) {
  return (
    <div className="space-y-4">
      {/* Header fiche */}
      <div className="bg-[#1C1F2E] border border-[#2A2D3E] rounded-2xl p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">{meetingType}</span>
            <h2 className="text-white font-semibold mt-1">{prospectRole} · {prospectSector}</h2>
          </div>
          <span className="text-2xl">📋</span>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">{brief.summary}</p>
      </div>

      {/* Agenda */}
      <div className="bg-[#1C1F2E] border border-[#2A2D3E] rounded-2xl p-5">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Déroulé suggéré</h3>
        <div className="space-y-2">
          {brief.agenda.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-gray-200">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* BANT */}
      <div className="bg-[#1C1F2E] border border-[#2A2D3E] rounded-2xl p-5">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Qualification BANT</h3>
        <div className="grid grid-cols-1 gap-3">
          {(Object.keys(bantLabels) as (keyof typeof bantLabels)[]).map((key) => {
            const cfg = bantLabels[key];
            return (
              <div key={key} className={`border rounded-xl p-3 ${cfg.bg}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span>{cfg.icon}</span>
                  <span className={`text-xs font-semibold uppercase tracking-wider ${cfg.color}`}>{cfg.label}</span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{brief.bant[key]}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Questions */}
      <div className="bg-[#1C1F2E] border border-[#2A2D3E] rounded-2xl p-5">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Questions clés</h3>
        <div className="space-y-2">
          {brief.questions.map((q, i) => (
            <div key={i} className="flex items-start gap-3 py-2 border-b border-[#2A2D3E] last:border-0">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 mt-0.5 ${categoryColors[q.category] || "bg-gray-500/20 text-gray-300"}`}>
                {q.category}
              </span>
              <p className="text-sm text-gray-200">{q.question}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Objections */}
      <div className="bg-[#1C1F2E] border border-[#2A2D3E] rounded-2xl p-5">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Objections & réponses</h3>
        <div className="space-y-3">
          {brief.objections.map((o, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-start gap-2">
                <span className="text-orange-400 text-xs mt-0.5 flex-shrink-0">⚠</span>
                <p className="text-sm text-orange-200 font-medium">{o.objection}</p>
              </div>
              <div className="flex items-start gap-2 pl-4">
                <span className="text-emerald-400 text-xs mt-0.5 flex-shrink-0">→</span>
                <p className="text-sm text-gray-300">{o.reponse}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conseil Mehdi */}
      {brief.tip && (
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
          <p className="text-xs text-indigo-400 font-semibold mb-1">💡 Conseil de Mehdi</p>
          <p className="text-sm text-indigo-200/80">{brief.tip}</p>
        </div>
      )}
    </div>
  );
}
