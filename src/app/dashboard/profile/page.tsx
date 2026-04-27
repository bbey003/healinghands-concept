import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getSession } from "@/lib/auth/sessions";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ProfileForm } from "@/components/dashboard/ProfileForm";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage(): Promise<JSX.Element> {
  const session = await getSession();
  if (!session) redirect("/login?redirect=/dashboard/profile");

  return (
    <DashboardShell>
      <h1 className="display-h2 mb-6">Profile</h1>
      <ProfileForm />
    </DashboardShell>
  );
}
