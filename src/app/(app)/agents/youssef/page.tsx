import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ProspectStudio } from "./ProspectStudio";

export default async function YoussefStudioPage({
  searchParams,
}: {
  searchParams: Promise<{ workflowId?: string; stepId?: string }>
}) {
  const { orgId } = await auth();
  if (!orgId) redirect("/sign-in");

  const org = await db.organization.findUnique({
    where: { clerkOrgId: orgId },
    include: { brandKit: true },
  });

  if (!org?.brandKit) redirect("/onboarding");

  const { workflowId, stepId } = await searchParams;

  return <ProspectStudio workflowId={workflowId} stepId={stepId} />;
}