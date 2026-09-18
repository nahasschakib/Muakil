import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import HRStudio from "./HRStidio";


export default async function NadiaPage() {
  const { orgId } = await auth();
  if (!orgId) redirect("/sign-in");

  const org = await db.organization.findUnique({
    where: { clerkOrgId: orgId },
  });
  if (!org) redirect("/onboarding");

  return <HRStudio orgId={org.id} />;
}