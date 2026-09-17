"use client";

type InvoiceLine = {
  designation: string;
  qty: number;
  unitPrice: number;
  total: number;
};

type Invoice = {
  emetteur: {
    name: string;
    address: string;
    city: string;
    ice: string;
    if: string;
    rc: string;
    cnss: string;
    rib: string;
    banque: string;
    formeJuridique: string;
    capital: string;
  };
  client: {
    name: string;
    address: string;
    city: string;
    ice: string;
  };
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  lines: InvoiceLine[];
  totals: {
    subtotal: number;
    tvaRate: number;
    tvaAmount: number;
    totalHT: number;
    totalTTC: number;
    withholding: boolean;
    withholdingAmount: number;
    netAPayer: number;
  };
  notes: string;
};

type Props = { invoice: Invoice };

function fmt(n: number) {
  return n.toLocaleString("fr-MA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function InvoicePreview({ invoice }: Props) {
  const { emetteur, client, totals } = invoice;

  return (
    <div
      id="invoice-preview"
      className="bg-white text-gray-900 rounded-2xl shadow-2xl overflow-hidden"
      style={{ fontFamily: "Inter, sans-serif", fontSize: "13px" }}
    >
      {/* Bande supérieure */}
      <div className="bg-[#1C1F2E] px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-white text-xl font-bold tracking-tight">{emetteur.name}</h1>
          {emetteur.formeJuridique && (
            <p className="text-gray-400 text-xs mt-0.5">{emetteur.formeJuridique}{emetteur.capital ? ` — Capital : ${emetteur.capital} MAD` : ""}</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-violet-400 text-2xl font-bold">FACTURE</p>
          <p className="text-gray-300 text-sm font-mono">N° {invoice.invoiceNumber}</p>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* Bloc émetteur + client + dates */}
        <div className="grid grid-cols-3 gap-6">
          {/* Émetteur */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Émetteur</p>
            {emetteur.address && <p className="text-gray-700">{emetteur.address}</p>}
            {emetteur.city && <p className="text-gray-700">{emetteur.city}</p>}
            {emetteur.ice && <p className="text-gray-500">ICE : {emetteur.ice}</p>}
            {emetteur.if && <p className="text-gray-500">IF : {emetteur.if}</p>}
            {emetteur.rc && <p className="text-gray-500">RC : {emetteur.rc}</p>}
            {emetteur.cnss && <p className="text-gray-500">CNSS : {emetteur.cnss}</p>}
          </div>

          {/* Client */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Facturé à</p>
            <p className="font-semibold text-gray-900">{client.name}</p>
            {client.address && <p className="text-gray-700">{client.address}</p>}
            {client.city && <p className="text-gray-700">{client.city}</p>}
            {client.ice && <p className="text-gray-500">ICE : {client.ice}</p>}
          </div>

          {/* Dates */}
          <div className="space-y-2 text-right">
            <div>
              <p className="text-xs text-gray-400">Date de facture</p>
              <p className="font-semibold">{invoice.invoiceDate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Échéance</p>
              <p className="font-semibold text-red-600">{invoice.dueDate}</p>
            </div>
          </div>
        </div>

        {/* Tableau des lignes */}
        <div className="overflow-hidden rounded-xl border border-gray-100">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Désignation</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">Qté</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">P.U. HT</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">Total HT</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lines.map((line, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                  <td className="px-4 py-3 text-gray-800">{line.designation}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{line.qty}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{fmt(line.unitPrice)} MAD</td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">{fmt(line.total)} MAD</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totaux */}
        <div className="flex justify-end">
          <div className="w-72 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Total HT</span>
              <span>{fmt(totals.totalHT)} MAD</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>TVA ({totals.tvaRate}%)</span>
              <span>{fmt(totals.tvaAmount)} MAD</span>
            </div>
            <div className="flex justify-between text-gray-800 font-medium border-t border-gray-100 pt-2">
              <span>Total TTC</span>
              <span>{fmt(totals.totalTTC)} MAD</span>
            </div>
            {totals.withholding && (
              <div className="flex justify-between text-orange-600">
                <span>Retenue à la source (10%)</span>
                <span>− {fmt(totals.withholdingAmount)} MAD</span>
              </div>
            )}
            <div className="flex justify-between bg-[#1C1F2E] text-white px-4 py-3 rounded-xl font-bold text-base">
              <span>Net à payer</span>
              <span>{fmt(totals.netAPayer)} MAD</span>
            </div>
          </div>
        </div>

        {/* RIB / Banque */}
        {(emetteur.rib || emetteur.banque) && (
          <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Règlement par virement</p>
            {emetteur.banque && <p className="text-gray-700">Banque : {emetteur.banque}</p>}
            {emetteur.rib && <p className="text-gray-700 font-mono">RIB : {emetteur.rib}</p>}
          </div>
        )}

        {/* Notes */}
        {invoice.notes && (
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-500 leading-relaxed">{invoice.notes}</p>
          </div>
        )}

        {/* Mentions légales */}
        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs text-gray-400 leading-relaxed text-center">
            Conformément à la loi marocaine, tout retard de paiement entraîne des pénalités.
            {emetteur.ice && ` ICE : ${emetteur.ice}.`}
            {emetteur.if && ` IF : ${emetteur.if}.`}
            {emetteur.rc && ` RC : ${emetteur.rc}.`}
          </p>
        </div>
      </div>
    </div>
  );
}
