import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ResearchStudio } from "./ResearchStudio";

export default async function NourStudioPage() {
  const { orgId } = await auth();
  if (!orgId) redirect("/sign-in");

  const org = await db.organization.findUnique({
    where: { clerkOrgId: orgId },
    include: { brandKit: true },
  });

  if (!org?.brandKit) redirect("/onboarding");

  return <ResearchStudio />;
}
