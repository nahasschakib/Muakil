import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ContentStudio } from "./ContentStudio";
import { db } from "@/lib/db";

export default async function SalmaStudioPage({
  searchParams,
}: {
  searchParams: Promise<{ workflowId?: string; stepId?: string }>;
}) {
  const { orgId } = await auth();
  if (!orgId) redirect("/sign-in");

  const org = await db.organization.findUnique({
    where: { clerkOrgId: orgId },
    include: { brandKit: true },
  });
  if (!org?.brandKit) redirect("/onboarding");

  const { workflowId, stepId } = await searchParams;

  return (
    <ContentStudio
      brandName={org.brandKit.brandName}
      tone={org.brandKit.tone}
      icpProfile={org.brandKit.icpProfile}
      workflowId={workflowId}
      stepId={stepId}
    />
  );
}
