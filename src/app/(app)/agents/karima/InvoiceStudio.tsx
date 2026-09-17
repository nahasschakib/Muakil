"use client";

import { useState } from "react";
import { InvoicePreview } from "./InvoicePreview";
import { saveLivrable } from "@/app/(app)/livrables/actions";

type Line = { designation: string; qty: number; unitPrice: number };
type Invoice = any;

const TVA_RATES = [20, 14, 10, 7, 0];

function today() {
  return new Date().toISOString().split("T")[0];
}

function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export function InvoiceStudio() {
  const [invoiceNumber, setInvoiceNumber] = useState("FA-001");
  const [invoiceDate, setInvoiceDate] = useState(today());
  const [dueDate, setDueDate] = useState(addDays(today(), 30));
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientCity, setClientCity] = useState("");
  const [clientICE, setClientICE] = useState("");
  const [lines, setLines] = useState<Line[]>([{ designation: "", qty: 1, unitPrice: 0 }]);
  const [tvaRate, setTvaRate] = useState(20);
  const [withholding, setWithholding] = useState(false);
  const [notes, setNotes] = useState("");
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addLine() {
    setLines([...lines, { designation: "", qty: 1, unitPrice: 0 }]);
  }

  function removeLine(i: number) {
    setLines(lines.filter((_, idx) => idx !== i));
  }

  function updateLine(i: number, field: keyof Line, value: string | number) {
    const updated = [...lines];
    updated[i] = { ...updated[i], [field]: value };
    setLines(updated);
  }

  async function handleGenerate() {
    if (!clientName.trim() || lines.every((l) => !l.designation.trim())) return;
    setLoading(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch("/api/agents/karima/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceNumber, invoiceDate, dueDate,
          clientName, clientAddress, clientCity, clientICE,
          lines, tvaRate, withholding, notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setInvoice(data.invoice);
      } else {
        setError("Erreur lors de la génération.");
      }
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!invoice) return;
    const content = `**Facture ${invoice.invoiceNumber}** — ${invoice.client.name}\n\nDate : ${invoice.invoiceDate}\nÉchéance : ${invoice.dueDate}\n\n**Lignes :**\n${invoice.lines.map((l: any) => `- ${l.designation} × ${l.qty} = ${l.total} MAD`).join("\n")}\n\n**Total HT :** ${invoice.totals.totalHT} MAD\n**TVA (${invoice.totals.tvaRate}%) :** ${invoice.totals.tvaAmount} MAD\n**Total TTC :** ${invoice.totals.totalTTC} MAD${invoice.totals.withholding ? `\n**Retenue source :** −${invoice.totals.withholdingAmount} MAD` : ""}\n**Net à payer :** ${invoice.totals.netAPayer} MAD`;
    await saveLivrable({
      agentSlug: "karima",
      title: `Facture ${invoice.invoiceNumber} — ${invoice.client.name}`,
      content,
    });
    setSaved(true);
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="min-h-screen bg-[#0F1117] text-white">
      {/* Header */}
      <div className="border-b border-[#2A2D3E] bg-[#1C1F2E]/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-700 flex items-center justify-center text-sm font-bold">
            K
          </div>
          <div>
            <h1 className="font-semibold text-sm text-white" style={{ fontFamily: "'Bricolage Grotesque', Inter, sans-serif" }}>
              Studio Karima
            </h1>
            <p className="text-xs text-gray-500">InvoiceStudio — Factures conformes législation marocaine</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {invoice && (
              <>
                <button onClick={handlePrint} className="text-xs border border-[#2A2D3E] hover:border-gray-500 text-gray-300 px-4 py-2 rounded-lg font-medium transition-colors">
                  Imprimer / PDF
                </button>
                {!saved ? (
                  <button onClick={handleSave} className="text-xs bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Enregistrer
                  </button>
                ) : (
                  <span className="text-xs text-emerald-400 font-medium">✓ Enregistré</span>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* Formulaire (2/5) */}
        <div className="lg:col-span-2 space-y-5">

          {/* Numéro + dates */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Facture</h2>
            <input
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              placeholder="N° Facture"
              className="w-full bg-[#1C1F2E] border border-[#2A2D3E] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-rose-500 transition-colors"
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Date</label>
                <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full bg-[#1C1F2E] border border-[#2A2D3E] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Échéance</label>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-[#1C1F2E] border border-[#2A2D3E] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors" />
              </div>
            </div>
          </section>

          {/* Client */}
          <section className="space-y-2">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Client</h2>
            <input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Nom / Raison sociale"
              className="w-full bg-[#1C1F2E] border border-[#2A2D3E] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-rose-500 transition-colors" />
            <input value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} placeholder="Adresse"
              className="w-full bg-[#1C1F2E] border border-[#2A2D3E] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-rose-500 transition-colors" />
            <div className="grid grid-cols-2 gap-2">
              <input value={clientCity} onChange={(e) => setClientCity(e.target.value)} placeholder="Ville"
                className="w-full bg-[#1C1F2E] border border-[#2A2D3E] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-rose-500 transition-colors" />
              <input value={clientICE} onChange={(e) => setClientICE(e.target.value)} placeholder="ICE client"
                className="w-full bg-[#1C1F2E] border border-[#2A2D3E] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-rose-500 transition-colors" />
            </div>
          </section>

          {/* Lignes */}
          <section className="space-y-2">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Prestations</h2>
            {lines.map((line, i) => (
              <div key={i} className="bg-[#1C1F2E] border border-[#2A2D3E] rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Ligne {i + 1}</span>
                  {lines.length > 1 && (
                    <button onClick={() => removeLine(i)} className="text-xs text-red-400 hover:text-red-300">Supprimer</button>
                  )}
                </div>
                <input
                  value={line.designation}
                  onChange={(e) => updateLine(i, "designation", e.target.value)}
                  placeholder="Désignation"
                  className="w-full bg-[#0F1117] border border-[#2A2D3E] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-rose-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number" min="1" value={line.qty}
                    onChange={(e) => updateLine(i, "qty", Number(e.target.value))}
                    placeholder="Qté"
                    className="w-full bg-[#0F1117] border border-[#2A2D3E] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                  <input
                    type="number" min="0" value={line.unitPrice}
                    onChange={(e) => updateLine(i, "unitPrice", Number(e.target.value))}
                    placeholder="Prix unitaire HT"
                    className="w-full bg-[#0F1117] border border-[#2A2D3E] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <p className="text-xs text-gray-500 text-right">
                  Total : <span className="text-white font-medium">{(line.qty * line.unitPrice).toLocaleString("fr-MA")} MAD</span>
                </p>
              </div>
            ))}
            <button onClick={addLine} className="w-full text-xs border border-dashed border-[#2A2D3E] hover:border-rose-500 text-gray-400 hover:text-rose-400 py-2 rounded-xl transition-all">
              + Ajouter une ligne
            </button>
          </section>

          {/* TVA + Retenue */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Taxes</h2>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Taux TVA</label>
              <div className="flex gap-2 flex-wrap">
                {TVA_RATES.map((r) => (
                  <button key={r} onClick={() => setTvaRate(r)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${tvaRate === r ? "border-rose-500 bg-rose-500/20 text-rose-300" : "border-[#2A2D3E] text-gray-400 hover:border-gray-500"}`}>
                    {r === 0 ? "Exonéré" : `${r}%`}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setWithholding(!withholding)}
                className={`w-10 h-5 rounded-full transition-colors relative ${withholding ? "bg-rose-500" : "bg-[#2A2D3E]"}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow ${withholding ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
              <span className="text-sm text-gray-300">Retenue à la source (10%)</span>
            </label>
          </section>

          {/* Notes */}
          <section className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Notes <span className="text-gray-600 font-normal normal-case">(optionnel)</span>
            </label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
              placeholder="Conditions de paiement, mentions particulières…"
              className="w-full bg-[#1C1F2E] border border-[#2A2D3E] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:border-rose-500 transition-colors" />
          </section>

          <button onClick={handleGenerate} disabled={loading || !clientName.trim()}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-rose-600 hover:bg-rose-500 text-white">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Génération…
              </span>
            ) : "Générer la facture"}
          </button>

          {error && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
        </div>

        {/* Aperçu (3/5) */}
        <div className="lg:col-span-3">
          {invoice ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <InvoicePreview invoice={invoice} />
            </div>
          ) : (
            <div className="h-full min-h-64 flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-[#2A2D3E] p-12">
              <div className="w-14 h-14 rounded-2xl bg-[#1C1F2E] flex items-center justify-center text-2xl mb-4">🧾</div>
              <p className="text-gray-400 text-sm font-medium">Votre facture apparaîtra ici</p>
              <p className="text-gray-600 text-xs mt-1">Remplissez les informations client et les prestations</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
