import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import StrategyStudio from "./StrategyStudio";

export default async function TariqPage() {
  const { orgId } = await auth();
  if (!orgId) redirect("/sign-in");

  const org = await db.organization.findUnique({
    where: { clerkOrgId: orgId },
  });
  if (!org) redirect("/onboarding");

  return <StrategyStudio orgId={org.id} />;
}