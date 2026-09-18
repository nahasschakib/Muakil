import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import AnalyticsStudio from "./AnalyticsStudio";

export default async function KamalPage() {
  const { orgId } = await auth();
  if (!orgId) redirect("/sign-in");

  const org = await db.organization.findUnique({
    where: { clerkOrgId: orgId },
  });
  if (!org) redirect("/onboarding");

  return <AnalyticsStudio orgId={org.id} />;
}