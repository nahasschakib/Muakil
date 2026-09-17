import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { ContentStudio } from "./ContentStudio";
import { db } from "@/lib/db";

export default async function SalmaStudioPage() {
  const { orgId } = await auth();
  if (!orgId) redirect("/sign-in");

  const org = await db.organization.findUnique({
    where: { clerkOrgId: orgId },
    include: { brandKit: true },
  });

  if (!org?.brandKit) redirect("/onboarding");

  return (
    <ContentStudio brandName={org.brandKit.brandName} />
  );
}
