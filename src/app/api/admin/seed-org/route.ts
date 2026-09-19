import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const clerkOrgId = searchParams.get("clerkOrgId");
  const name = searchParams.get("name");

  if (!clerkOrgId || !name) {
    return NextResponse.json({ error: "clerkOrgId et name requis" }, { status: 400 });
  }

  const org = await db.organization.upsert({
    where: { clerkOrgId },
    update: { name },
    create: { clerkOrgId, name },
  });

  return NextResponse.json({ success: true, org });
}