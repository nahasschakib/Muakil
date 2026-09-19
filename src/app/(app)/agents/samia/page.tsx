import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import EmailStudio from "./EmailStudio";

export default async function SamiaPage({
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

  let previousOutput: Record<string, unknown> | null = null;
  if (workflowId) {
    const karimStep = await db.workflowStep.findFirst({
      where: { workflowId, order: 3, status: "COMPLETED" },
      select: { output: true },
    });
    if (karimStep?.output) {
      previousOutput = karimStep.output as Record<string, unknown>;
    }
  }

  return (
    <EmailStudio
      orgId={org.id}
      workflowId={workflowId}
      stepId={stepId}
      previousOutput={previousOutput}
    />
  );
}