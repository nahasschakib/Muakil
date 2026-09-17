import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateCGNCTemplate } from "@/lib/tools/generateCGNCTemplate";

export async function GET() {
  const { orgId } = await auth();
  if (!orgId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const buffer = generateCGNCTemplate();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="balance-cgnc-muakil.xlsx"',
    },
  });
}
