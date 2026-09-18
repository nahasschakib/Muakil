import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import CreativeStudio from "./CreativeStudio";

export default async function ImanePage() {
  const { orgId } = await auth();
  if (!orgId) redirect("/sign-in");

  const org = await db.organization.findUnique({
    where: { clerkOrgId: orgId },
  });
  if (!org) redirect("/onboarding");

  return <CreativeStudio orgId={org.id} />;
}