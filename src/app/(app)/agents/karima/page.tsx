import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { InvoiceStudio } from "./InvoiceStudio";

export default async function KarimaStudioPage({
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
  let prospectNameFromNour = "";
    if (workflowId) {
    const [samiaStep, nourStep] = await Promise.all([
      db.workflowStep.findFirst({
        where: { workflowId, order: 4, status: "COMPLETED" },
        select: { output: true },
      }),
      db.workflowStep.findFirst({
        where: { workflowId, order: 0, status: "COMPLETED" },
        select: { output: true },
      }),
    ]);
    if (samiaStep?.output) {
      previousOutput = samiaStep.output as Record<string, unknown>;
    }
    if (nourStep?.output) {
      const nourOutput = nourStep.output as Record<string, unknown>;
      prospectNameFromNour = (nourOutput.prospectName as string) ?? "";
    }
  }

  return (
     <InvoiceStudio
      workflowId={workflowId}
      stepId={stepId}
      previousOutput={previousOutput}
      brandKit={org.brandKit}
      prospectNameFromNour={prospectNameFromNour}
    />
  );
}