import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { MeetingStudio } from "./MeetingStudio";

export default async function MehdiStudioPage({
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
    const youssefStep = await db.workflowStep.findFirst({
      where: { workflowId, order: 1, status: "COMPLETED" },
      select: { output: true },
    });
    if (youssefStep?.output) {
      previousOutput = youssefStep.output as Record<string, unknown>;
    }
  }

  return (
    <MeetingStudio
    workflowId={workflowId}
    stepId={stepId}
    previousOutput={previousOutput}
    brandKit={org.brandKit}
  />
  );
}