"use client";

import { useEffect } from "react";

const statutColors: Record<string, React.CSSProperties> = {
  bon:     { background: "#d1fae5", color: "#065f46", border: "1px solid #6ee7b7" },
  moyen:   { background: "#fef3c7", color: "#92400e", border: "1px solid #fcd34d" },
  mauvais: { background: "#fee2e2", color: "#991b1b", border: "1px solid #fca5a5" },
};
const prioriteColors: Record<string, React.CSSProperties> = {
  haute:   { background: "#fee2e2", color: "#991b1b" },
  moyenne: { background: "#fef3c7", color: "#92400e" },
  basse:   { background: "#dbeafe", color: "#1e40af" },
};

function getPrintData() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("muakil_print_kamal");
  if (!raw) return null;
  const parsed = JSON.parse(raw);
  return {
    payload: parsed.data as Record<string, unknown>,
    typeOutput: parsed.typeOutput as string,
    brandName: (parsed.brandName || "MUAKIL") as string,
  };
}

export default function KamalPrintPage() {
  const data = getPrintData();

  useEffect(() => {
    if (!data) return;
    const t = setTimeout(() => window.print(), 800);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!data) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", color: "#9ca3af" }}>
      Chargement du rapport…
    </div>
  );

  const { payload, typeOutput, brandName } = data;
  const today = new Date().toLocaleDateString("fr-MA", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <>
      <style>{`
        @page { size: A4; margin: 15mm; }
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
        body { font-family: Inter, Arial, sans-serif; font-size: 12px; color: #111; background: white; }
      `}</style>

      <div className="no-print" style={{ position: "fixed", top: 16, right: 16, display: "flex", gap: 8, zIndex: 50 }}>
        <button onClick={() => window.print()}
          style={{ background: "#111", color: "white", padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer" }}>
          Imprimer / Enregistrer PDF
        </button>
        <button onClick={() => window.close()}
          style={{ background: "#f3f4f6", color: "#374151", padding: "8px 16px", borderRadius: 8, fontSize: 13, border: "none", cursor: "pointer" }}>
          Fermer
        </button>
      </div>

      <div style={{ maxWidth: "210mm", margin: "0 auto", padding: 32, background: "white", minHeight: "100vh" }}>

        {/* En-tête */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, paddingBottom: 16, borderBottom: "2px solid #111" }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111", margin: 0 }}>{brandName}</h1>
            <p style={{ fontSize: 10, color: "#9ca3af", marginTop: 4 }}>Rapport Analytics — MUAKIL</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>Date</p>
            <p style={{ fontWeight: 600, color: "#1f2937", margin: 0 }}>{today}</p>
          </div>
        </div>

        {/* KPIs */}
        {typeOutput === "kpis" && (() => {
          const d = payload as {
            kpis: { nom: string; description: string; unite: string; frequence: string; cible: string }[];
            outil: string; priorite: string; tip: string;
          };
          return (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#c2410c", marginBottom: 16 }}>📊 Tableau de bord KPIs</h2>
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
                <thead>
                  <tr style={{ background: "#111", color: "white" }}>
                    {["KPI", "Description", "Unité", "Fréquence", "Cible"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {d.kpis?.map((kpi, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? "white" : "#f9fafb" }}>
                      <td style={{ padding: "8px 12px", fontWeight: 600, fontSize: 11 }}>{kpi.nom}</td>
                      <td style={{ padding: "8px 12px", color: "#6b7280", fontSize: 10 }}>{kpi.description}</td>
                      <td style={{ padding: "8px 12px", fontSize: 10 }}>{kpi.unite}</td>
                      <td style={{ padding: "8px 12px", fontSize: 10 }}>{kpi.frequence}</td>
                      <td style={{ padding: "8px 12px", color: "#ea580c", fontWeight: 500, fontSize: 10 }}>{kpi.cible}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div style={{ background: "#eff6ff", borderRadius: 8, padding: 12 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#1d4ed8", marginBottom: 4 }}>🛠️ Outil recommandé</p>
                  <p style={{ fontSize: 12, color: "#1e40af" }}>{d.outil}</p>
                </div>
                <div style={{ background: "#fff7ed", borderRadius: 8, padding: 12 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#c2410c", marginBottom: 4 }}>⚡ KPI prioritaire</p>
                  <p style={{ fontSize: 12, color: "#9a3412" }}>{d.priorite}</p>
                </div>
              </div>
              <div style={{ background: "#fff7ed", borderLeft: "4px solid #f97316", padding: 12, borderRadius: 4 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#c2410c" }}>💡 Conseil Kamal</p>
                <p style={{ fontSize: 11, color: "#9a3412", marginTop: 4 }}>{d.tip}</p>
              </div>
            </div>
          );
        })()}

        {/* Analyse */}
        {typeOutput === "analyse" && (() => {
          const d = payload as {
            synthese: string;
            points_forts: string[];
            points_faibles: string[];
            tendance: string;
            actions: { priorite: string; action: string }[];
            alerte: string;
            tip: string;
          };
          return (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#c2410c", marginBottom: 16 }}>🔍 Analyse de performance</h2>
              <div style={{ background: "#1e293b", color: "white", borderRadius: 8, padding: 16, marginBottom: 12 }}>
                <p style={{ fontSize: 9, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Synthèse dirigeant</p>
                <p style={{ fontSize: 12, lineHeight: 1.6 }}>{d.synthese}</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#059669", marginBottom: 8, textTransform: "uppercase" }}>✅ Points forts</p>
                  {d.points_forts?.map((p, i) => (
                    <p key={i} style={{ fontSize: 11, color: "#374151", marginBottom: 4 }}>+ {p}</p>
                  ))}
                </div>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#dc2626", marginBottom: 8, textTransform: "uppercase" }}>⚠️ Points faibles</p>
                  {d.points_faibles?.map((p, i) => (
                    <p key={i} style={{ fontSize: 11, color: "#374151", marginBottom: 4 }}>− {p}</p>
                  ))}
                </div>
              </div>
              <div style={{ background: "#eff6ff", borderRadius: 8, padding: 12, marginBottom: 12 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#1d4ed8", marginBottom: 4 }}>📈 Tendance</p>
                <p style={{ fontSize: 12, color: "#1e40af" }}>{d.tendance}</p>
              </div>
              <div style={{ marginBottom: 12 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#374151", textTransform: "uppercase", marginBottom: 8 }}>🎯 Actions recommandées</p>
                {d.actions?.map((a, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
                    <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 9999, fontWeight: 600, flexShrink: 0, ...(prioriteColors[a.priorite] ?? {}) }}>
                      {a.priorite}
                    </span>
                    <p style={{ fontSize: 11, color: "#374151", margin: 0 }}>{a.action}</p>
                  </div>
                ))}
              </div>
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: 12, marginBottom: 8 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#dc2626" }}>🚨 Alerte</p>
                <p style={{ fontSize: 11, color: "#991b1b", marginTop: 4 }}>{d.alerte}</p>
              </div>
              <div style={{ background: "#fff7ed", borderLeft: "4px solid #f97316", padding: 12, borderRadius: 4 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#c2410c" }}>💡 Conseil Kamal</p>
                <p style={{ fontSize: 11, color: "#9a3412", marginTop: 4 }}>{d.tip}</p>
              </div>
            </div>
          );
        })()}

        {/* Rapport mensuel */}
        {typeOutput === "rapport" && (() => {
          const d = payload as {
            titre: string;
            resume_executif: string;
            sections: { titre: string; contenu: string; statut: string }[];
            decision: string;
            tip: string;
          };
          return (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#c2410c", marginBottom: 16 }}>📋 {d.titre}</h2>
              <div style={{ background: "#1e293b", color: "white", borderRadius: 8, padding: 16, marginBottom: 12 }}>
                <p style={{ fontSize: 9, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Résumé exécutif</p>
                <p style={{ fontSize: 12, lineHeight: 1.6 }}>{d.resume_executif}</p>
              </div>
              <div style={{ marginBottom: 12 }}>
                {d.sections?.map((s, i) => (
                  <div key={i} style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden", marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "#f9fafb" }}>
                      <p style={{ fontWeight: 600, fontSize: 12, margin: 0 }}>{s.titre}</p>
                      <span style={{ fontSize: 10, padding: "2px 10px", borderRadius: 9999, fontWeight: 600, ...(statutColors[s.statut] ?? {}) }}>
                        {s.statut}
                      </span>
                    </div>
                    <div style={{ padding: "8px 12px" }}>
                      <p style={{ fontSize: 11, color: "#4b5563", margin: 0 }}>{s.contenu}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: "#ea580c", color: "white", borderRadius: 8, padding: 16, marginBottom: 8 }}>
                <p style={{ fontSize: 9, color: "#fed7aa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Décision du mois</p>
                <p style={{ fontSize: 13, fontWeight: 700 }}>{d.decision}</p>
              </div>
              <div style={{ background: "#fff7ed", borderLeft: "4px solid #f97316", padding: 12, borderRadius: 4 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#c2410c" }}>💡 Conseil Kamal</p>
                <p style={{ fontSize: 11, color: "#9a3412", marginTop: 4 }}>{d.tip}</p>
              </div>
            </div>
          );
        })()}

        {/* Footer */}
        <div style={{ borderTop: "1px solid #e5e7eb", marginTop: 32, paddingTop: 12, textAlign: "center", fontSize: 10, color: "#9ca3af" }}>
          Généré par MUAKIL · {brandName} · {today}
        </div>
      </div>
    </>
  );
}