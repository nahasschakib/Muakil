"use client";

type ProspectResult = {
  nom: string;
  dirigeant?: string;
  secteur?: string;
  ville?: string;
  telephone?: string;
  email?: string;
  site?: string;
  description?: string;
  source?: string;
};

type ActualiteResult = {
  titre: string;
  source: string;
  url: string;
  date?: string;
  resume: string;
  pertinence?: string;
};

type MarcheResult = {
  titre: string;
  detail: string;
  source?: string;
  impact?: string;
};

type SearchData = {
  type: string;
  query: string;
  results: (ProspectResult | ActualiteResult | MarcheResult)[];
  total: number;
  tip?: string;
};

type Props = { data: SearchData };

function ProspectCard({ r }: { r: ProspectResult }) {
  return (
    <div className="bg-[#1C1F2E] border border-[#2A2D3E] rounded-xl p-4 hover:border-violet-500/40 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-white text-sm leading-tight">{r.nom}</h3>
        {r.site && (
          <a
            href={r.site.startsWith("http") ? r.site : `https://${r.site}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-violet-400 hover:text-violet-300 ml-2 flex-shrink-0"
          >
            ↗ Site
          </a>
        )}
      </div>
      {r.description && (
        <p className="text-xs text-gray-400 mb-3 leading-relaxed">{r.description}</p>
      )}
      <div className="space-y-1">
        {r.dirigeant && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500 w-16 flex-shrink-0">Dirigeant</span>
            <span className="text-gray-300">{r.dirigeant}</span>
          </div>
        )}
        {r.secteur && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500 w-16 flex-shrink-0">Secteur</span>
            <span className="text-gray-300">{r.secteur}</span>
          </div>
        )}
        {r.ville && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500 w-16 flex-shrink-0">Ville</span>
            <span className="text-gray-300">{r.ville}</span>
          </div>
        )}
        {r.telephone && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500 w-16 flex-shrink-0">Tél</span>
            <a href={`tel:${r.telephone}`} className="text-emerald-400 hover:text-emerald-300">
              {r.telephone}
            </a>
          </div>
        )}
        {r.email && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500 w-16 flex-shrink-0">Email</span>
            <a href={`mailto:${r.email}`} className="text-blue-400 hover:text-blue-300 truncate">
              {r.email}
            </a>
          </div>
        )}
      </div>
      {r.source && (
        <div className="mt-3 pt-3 border-t border-[#2A2D3E]">
          <a
            href={r.source}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-600 hover:text-gray-400 truncate block"
          >
            Source : {r.source.replace(/^https?:\/\//, "").slice(0, 50)}…
          </a>
        </div>
      )}
    </div>
  );
}

function ActualiteCard({ r }: { r: ActualiteResult }) {
  return (
    <div className="bg-[#1C1F2E] border border-[#2A2D3E] rounded-xl p-4 hover:border-amber-500/40 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-white text-sm leading-tight flex-1">{r.titre}</h3>
        {r.url && (
          <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-amber-400 hover:text-amber-300 ml-2 flex-shrink-0"
          >
            ↗ Lire
          </a>
        )}
      </div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-gray-500">{r.source}</span>
        {r.date && <span className="text-xs text-gray-600">· {r.date}</span>}
      </div>
      <p className="text-xs text-gray-400 leading-relaxed mb-2">{r.resume}</p>
      {r.pertinence && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
          <p className="text-xs text-amber-300">💡 {r.pertinence}</p>
        </div>
      )}
    </div>
  );
}

function MarcheCard({ r }: { r: MarcheResult }) {
  return (
    <div className="bg-[#1C1F2E] border border-[#2A2D3E] rounded-xl p-4 hover:border-emerald-500/40 transition-colors">
      <h3 className="font-semibold text-white text-sm mb-2">{r.titre}</h3>
      <p className="text-xs text-gray-400 leading-relaxed mb-2">{r.detail}</p>
      {r.impact && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2 mb-2">
          <p className="text-xs text-emerald-300">📈 {r.impact}</p>
        </div>
      )}
      {r.source && (
        <a
          href={r.source}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-600 hover:text-gray-400"
        >
          ↗ Source
        </a>
      )}
    </div>
  );
}

export function ResultCards({ data }: Props) {
  const isProspect = data.type === "prospects" || data.type === "concurrents";
  const isActualite = data.type === "actualites";

  return (
    <div className="space-y-4">
      {/* Header résultats */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400">
            <span className="text-white font-semibold">{data.total}</span> résultats pour{" "}
            <span className="text-violet-400">"{data.query}"</span>
          </p>
        </div>
        <span className="text-xs text-gray-500 capitalize">{data.type}</span>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-3">
        {data.results.map((r, i) => (
          <div key={i}>
            {isProspect && <ProspectCard r={r as ProspectResult} />}
            {isActualite && <ActualiteCard r={r as ActualiteResult} />}
            {!isProspect && !isActualite && <MarcheCard r={r as MarcheResult} />}
          </div>
        ))}
      </div>

      {/* Conseil Nour */}
      {data.tip && (
        <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
          <p className="text-xs text-violet-400 font-semibold mb-1">💡 Conseil de Nour</p>
          <p className="text-sm text-violet-200/80">{data.tip}</p>
        </div>
      )}
    </div>
  );
}
