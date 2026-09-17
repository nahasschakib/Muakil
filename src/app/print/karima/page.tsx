"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

function fmt(n: number) {
  return n.toLocaleString("fr-MA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function KarimaPrintPage() {
  const [invoice, setInvoice] = useState<any>(null);
  const [qrCodeSvg, setQrCodeSvg] = useState<string>("");

  useEffect(() => {
    const raw = localStorage.getItem("muakil_print_invoice");
    if (raw) {
      const parsed = JSON.parse(raw);
      setInvoice(parsed);
      if (parsed.qrData) {
        QRCode.toString(parsed.qrData, { type: "svg", width: 80, margin: 1 })
          .then(setQrCodeSvg)
          .catch(() => setQrCodeSvg(""));
      }
    }
  }, []);

  useEffect(() => {
    if (invoice) setTimeout(() => window.print(), 800);
  }, [invoice]);

  if (!invoice) return (
    <div className="flex items-center justify-center min-h-screen text-gray-400">
      Chargement de la facture…
    </div>
  );

  const { emetteur, client, totals } = invoice;

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

      {/* Bouton fermer — masqué à l'impression */}
      <div className="no-print fixed top-4 right-4 flex gap-2 z-50">
        <button onClick={() => window.print()}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium">
          Imprimer / Enregistrer PDF
        </button>
        <button onClick={() => window.close()}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm">
          Fermer
        </button>
      </div>

      <div className="max-w-[210mm] mx-auto p-8 bg-white min-h-screen">

        {/* En-tête */}
        <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-gray-900">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{emetteur.name}</h1>
            {emetteur.formeJuridique && (
              <p className="text-gray-500 text-xs mt-0.5">
                {emetteur.formeJuridique}{emetteur.capital ? ` — Capital : ${emetteur.capital} MAD` : ""}
              </p>
            )}
            <div className="mt-2 text-gray-600 text-xs space-y-0.5">
              {emetteur.address && <p>{emetteur.address}</p>}
              {emetteur.city && <p>{emetteur.city}</p>}
              {emetteur.ice && <p>ICE : {emetteur.ice}</p>}
              {emetteur.if && <p>IF : {emetteur.if}</p>}
              {emetteur.rc && <p>RC : {emetteur.rc}</p>}
              {emetteur.cnss && <p>CNSS : {emetteur.cnss}</p>}
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900 tracking-tight">FACTURE</p>
            <p className="text-gray-500 font-mono text-sm mt-1">N° {invoice.invoiceNumber}</p>
            <div className="mt-3 text-xs text-gray-600 space-y-0.5">
              <p>Date : <strong>{invoice.invoiceDate}</strong></p>
              <p>Échéance : <strong className="text-red-600">{invoice.dueDate}</strong></p>
            </div>
          </div>
        </div>

        {/* Client */}
        <div className="mb-8 bg-gray-50 rounded-lg p-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Facturé à</p>
          <p className="font-bold text-gray-900">{client.name}</p>
          {client.address && <p className="text-gray-600 text-xs">{client.address}</p>}
          {client.city && <p className="text-gray-600 text-xs">{client.city}</p>}
          {client.ice && <p className="text-gray-500 text-xs">ICE : {client.ice}</p>}
        </div>

        {/* Tableau */}
        <table className="w-full mb-6" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#111", color: "white" }}>
              <th className="text-left px-3 py-2 text-xs font-semibold">Désignation</th>
              <th className="text-center px-3 py-2 text-xs font-semibold w-16">Qté</th>
              <th className="text-right px-3 py-2 text-xs font-semibold w-28">P.U. HT</th>
              <th className="text-right px-3 py-2 text-xs font-semibold w-28">Total HT</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lines.map((line: any, i: number) => (
              <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "white" : "#f9fafb" }}>
                <td className="px-3 py-2 text-gray-800">{line.designation}</td>
                <td className="px-3 py-2 text-center text-gray-600">{line.qty}</td>
                <td className="px-3 py-2 text-right text-gray-600">{fmt(line.unitPrice)} MAD</td>
                <td className="px-3 py-2 text-right font-medium">{fmt(line.total)} MAD</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totaux */}
        <div className="flex justify-end mb-6">
          <div className="w-64 space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Total HT</span><span>{fmt(totals.totalHT)} MAD</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>TVA ({totals.tvaRate}%)</span><span>{fmt(totals.tvaAmount)} MAD</span>
            </div>
            <div className="flex justify-between font-medium border-t border-gray-200 pt-1.5">
              <span>Total TTC</span><span>{fmt(totals.totalTTC)} MAD</span>
            </div>
            {totals.withholding && (
              <div className="flex justify-between text-orange-600">
                <span>Retenue à la source (10%)</span>
                <span>− {fmt(totals.withholdingAmount)} MAD</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base border-t-2 border-gray-900 pt-2">
              <span>Net à payer</span><span>{fmt(totals.netAPayer)} MAD</span>
            </div>
          </div>
        </div>

        {/* RIB */}
        {(emetteur.rib || emetteur.banque) && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs">
            <p className="font-semibold text-gray-500 uppercase tracking-wider mb-1">Règlement par virement</p>
            {emetteur.banque && <p className="text-gray-700">Banque : {emetteur.banque}</p>}
            {emetteur.rib && <p className="text-gray-700 font-mono">RIB : {emetteur.rib}</p>}
          </div>
        )}

        {/* Notes */}
        {invoice.notes && (
          <div className="mb-4 text-xs text-gray-500">{invoice.notes}</div>
        )}

        {/* Mentions légales */}
        <div className="border-t border-gray-200 pt-4 text-xs text-gray-400 text-center">
          Conformément à la loi marocaine, tout retard de paiement entraîne des pénalités.
          {emetteur.ice && ` ICE : ${emetteur.ice}.`}
          {emetteur.if && ` IF : ${emetteur.if}.`}
          {emetteur.rc && ` RC : ${emetteur.rc}.`}
        </div>

        {qrCodeSvg && (
          <div className="flex items-start gap-4 mt-4 pt-4 border-t border-gray-200">
            <div dangerouslySetInnerHTML={{ __html: qrCodeSvg }} style={{ width: 80, height: 80 }} />
            <div className="text-xs text-gray-400">
              <p className="font-semibold text-gray-600 mb-1">⚡ e-Facture MUAKIL</p>
              <p>Facture électronique conforme</p>
              <p>Scannez pour vérifier l'authenticité</p>
              <p className="mt-1 font-mono text-gray-300 text-xs">SHA256 vérifié</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
