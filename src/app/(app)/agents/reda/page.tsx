import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import DeckStudio from "./DeckStudio";

export default async function RedaPage() {
  const { orgId } = await auth();
  if (!orgId) redirect("/sign-in");

  const org = await db.organization.findUnique({
    where: { clerkOrgId: orgId },
  });
  if (!org) redirect("/onboarding");

  return <DeckStudio orgId={org.id} />;
}