"use client";

type Option = {
  name: string;
  tagline: string;
  price: string;
  description: string;
  inclus: string[];
  ideal: string;
  highlight: boolean;
};

type Proposal = {
  intro: string;
  problem: string;
  approach: string;
  options: Option[];
  roi: string;
  nextSteps: string[];
  validity: string;
  tip: string;
};

type Props = {
  proposal: Proposal;
  prospectName: string;
  brandName?: string;
};

export function ProposalPreview({ proposal, prospectName, brandName }: Props) {
  return (
    <div className="space-y-4">

      {/* En-tête proposition */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-[#1C1F2E] px-6 py-5 flex items-start justify-between">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Proposition commerciale</p>
            <h2 className="text-white text-lg font-bold">{brandName || "Votre entreprise"}</h2>
            <p className="text-gray-400 text-sm mt-0.5">À l&apos;attention de <span className="text-white font-medium">{prospectName}</span></p>
          </div>
          <div className="text-right">
            <p className="text-amber-400 text-xs font-semibold">{proposal.validity}</p>
            <p className="text-gray-500 text-xs mt-1">{new Date().toLocaleDateString("fr-MA")}</p>
          </div>
        </div>

        {/* SCR */}
        <div className="p-6 space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Situation</p>
            <p className="text-gray-700 text-sm leading-relaxed">{proposal.intro}</p>
          </div>
          <div className="bg-red-50 border-l-4 border-red-400 px-4 py-3 rounded-r-xl">
            <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-1">Complication</p>
            <p className="text-gray-700 text-sm leading-relaxed">{proposal.problem}</p>
          </div>
          <div className="bg-emerald-50 border-l-4 border-emerald-500 px-4 py-3 rounded-r-xl">
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">Notre résolution</p>
            <p className="text-gray-700 text-sm leading-relaxed">{proposal.approach}</p>
          </div>
        </div>
      </div>

      {/* 3 Options */}
      <div className="grid grid-cols-3 gap-3">
        {proposal.options.map((opt, i) => (
          <div key={i} className={`rounded-2xl overflow-hidden border-2 transition-all ${
            opt.highlight
              ? "border-violet-500 shadow-lg shadow-violet-500/20"
              : "border-[#2A2D3E]"
          }`}>
            {opt.highlight && (
              <div className="bg-violet-600 text-white text-center text-xs font-semibold py-1.5 tracking-wider">
                ✦ RECOMMANDÉ
              </div>
            )}
            <div className={`p-4 h-full ${opt.highlight ? "bg-[#1C1F2E]" : "bg-[#16191F]"}`}>
              <div className="mb-3">
                <h3 className="text-white font-bold text-base">{opt.name}</h3>
                <p className="text-gray-400 text-xs">{opt.tagline}</p>
              </div>
              <div className="mb-3">
                <p className="text-2xl font-bold text-white">{opt.price}</p>
              </div>
              <p className="text-gray-400 text-xs mb-3 leading-relaxed">{opt.description}</p>
              <ul className="space-y-1.5 mb-4">
                {opt.inclus.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs text-gray-300">
                    <span className={`mt-0.5 flex-shrink-0 ${opt.highlight ? "text-violet-400" : "text-emerald-400"}`}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className={`text-xs px-2 py-1.5 rounded-lg ${opt.highlight ? "bg-violet-500/20 text-violet-300" : "bg-white/5 text-gray-400"}`}>
                {opt.ideal}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ROI + Prochaines étapes */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#1C1F2E] border border-[#2A2D3E] rounded-2xl p-4">
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">📈 Valeur générée</p>
          <p className="text-sm text-gray-300 leading-relaxed">{proposal.roi}</p>
        </div>
        <div className="bg-[#1C1F2E] border border-[#2A2D3E] rounded-2xl p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Prochaines étapes</p>
          <div className="space-y-2">
            {proposal.nextSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-xs text-gray-300">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conseil Karim */}
      {proposal.tip && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <p className="text-xs text-amber-400 font-semibold mb-1">💡 Conseil de Karim</p>
          <p className="text-sm text-amber-200/80">{proposal.tip}</p>
        </div>
      )}
    </div>
  );
}
