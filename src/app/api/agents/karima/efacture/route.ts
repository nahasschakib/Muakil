import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { generateXML, generateQRData, type EFactureData } from "@/lib/tools/generateEFacture";

export async function POST(req: NextRequest) {
  const { orgId } = await auth();
  if (!orgId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const org = await db.organization.findUnique({ where: { clerkOrgId: orgId } });
  const brandKit = org ? await db.brandKit.findUnique({ where: { organizationId: org.id } }) : null;

  const { invoice } = await req.json();

  if (!invoice) return NextResponse.json({ error: "Données facture manquantes" }, { status: 400 });

  const eFactureData: EFactureData = {
    emetteur: {
      ice: brandKit?.ice || "",
      if: brandKit?.ifFiscal || "",
      rc: brandKit?.rc || "",
      raisonSociale: brandKit?.brandName || org?.name || "",
      adresse: brandKit?.siegeSocial || "",
      ville: brandKit?.city || "",
    },
    client: {
      ice: invoice.client.ice || "",
      raisonSociale: invoice.client.name,
      adresse: invoice.client.address || "",
      ville: invoice.client.city || "",
    },
    facture: {
      numero: invoice.invoiceNumber,
      date: invoice.invoiceDate,
      echeance: invoice.dueDate,
      devise: "MAD",
    },
    lignes: invoice.lines.map((l: any) => ({
      designation: l.designation,
      quantite: l.qty,
      prixUnitaireHT: l.unitPrice,
      tauxTVA: invoice.totals.tvaRate,
      montantHT: l.total,
      montantTVA: Math.round(l.total * invoice.totals.tvaRate) / 100,
      montantTTC: Math.round(l.total * (1 + invoice.totals.tvaRate / 100) * 100) / 100,
    })),
    totaux: {
      totalHT: invoice.totals.totalHT,
      totalTVA: invoice.totals.tvaAmount,
      totalTTC: invoice.totals.totalTTC,
      retenuSource: invoice.totals.withholding ? invoice.totals.withholdingAmount : undefined,
      netAPayer: invoice.totals.netAPayer,
    },
  };

  const xml = generateXML(eFactureData);
  const qrData = generateQRData(eFactureData);

  return NextResponse.json({ success: true, xml, qrData });
}
