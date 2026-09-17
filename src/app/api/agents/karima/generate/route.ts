import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { orgId } = await auth();
  if (!orgId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const org = await db.organization.findUnique({ where: { clerkOrgId: orgId } });
  const brandKit = org ? await db.brandKit.findUnique({ where: { organizationId: org.id } }) : null;

  const {
    invoiceNumber,
    invoiceDate,
    dueDate,
    clientName,
    clientAddress,
    clientCity,
    clientICE,
    lines,
    tvaRate,
    withholding,
    notes,
  } = await req.json();

  // Calculs
  const subtotal = lines.reduce((sum: number, l: { qty: number; unitPrice: number }) => sum + l.qty * l.unitPrice, 0);
  const tvaAmount = subtotal * (tvaRate / 100);
  const totalHT = subtotal;
  const totalTTC = subtotal + tvaAmount;
  const withholdingAmount = withholding ? subtotal * 0.1 : 0;
  const netAPayer = totalTTC - withholdingAmount;

  const invoice = {
    // En-tête émetteur (depuis BrandKit)
    emetteur: {
      name: brandKit?.brandName || org?.name || "",
      address: brandKit?.siegeSocial || "",
      city: brandKit?.city || "",
      ice: brandKit?.ice || "",
      if: brandKit?.ifFiscal || "",
      rc: brandKit?.rc || "",
      cnss: brandKit?.cnss || "",
      rib: brandKit?.rib || "",
      banque: brandKit?.banque || "",
      formeJuridique: brandKit?.formeJuridique || "",
      capital: brandKit?.capitalSocial || "",
    },
    // Client
    client: {
      name: clientName,
      address: clientAddress,
      city: clientCity,
      ice: clientICE || "",
    },
    // Méta
    invoiceNumber,
    invoiceDate,
    dueDate,
    // Lignes
    lines: lines.map((l: { designation: string; qty: number; unitPrice: number }) => ({
      designation: l.designation,
      qty: l.qty,
      unitPrice: l.unitPrice,
      total: l.qty * l.unitPrice,
    })),
    // Totaux
    totals: {
      subtotal: Math.round(subtotal * 100) / 100,
      tvaRate,
      tvaAmount: Math.round(tvaAmount * 100) / 100,
      totalHT: Math.round(totalHT * 100) / 100,
      totalTTC: Math.round(totalTTC * 100) / 100,
      withholding,
      withholdingAmount: Math.round(withholdingAmount * 100) / 100,
      netAPayer: Math.round(netAPayer * 100) / 100,
    },
    notes,
  };

  return NextResponse.json({ success: true, invoice });
}
