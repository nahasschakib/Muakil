import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { parseBalanceXLSX, parseBalanceCSV } from "@/lib/tools/parseCGNC";

export async function POST(req: NextRequest) {
  const { orgId } = await auth();
  if (!orgId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) return NextResponse.json({ error: "Aucun fichier" }, { status: 400 });

  const filename = file.name.toLowerCase();
  const arrayBuffer = await file.arrayBuffer();

  let data;

  if (filename.endsWith(".csv")) {
    const text = new TextDecoder("utf-8").decode(arrayBuffer);
    data = parseBalanceCSV(text);
  } else if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
    data = parseBalanceXLSX(arrayBuffer);
  } else {
    return NextResponse.json({ error: "Format non supporté. Utilisez .xlsx ou .csv" }, { status: 400 });
  }

  if (data.erreurs.length > 0 && data.ca === 0) {
    return NextResponse.json({ error: data.erreurs[0], erreurs: data.erreurs }, { status: 422 });
  }

  return NextResponse.json({ success: true, data });
}
