import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getSession } from "@/lib/auth/sessions";
import { bookingsRepo, servicesRepo, usersRepo } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { BookingsList } from "@/components/dashboard/BookingsList";

export const metadata: Metadata = { title: "My bookings" };

export default async function BookingsPage(): Promise<JSX.Element> {
  const session = await getSession();
  if (!session) redirect("/login?redirect=/dashboard/bookings");

  const bookings = bookingsRepo.listByUser(session.user_id);
  const enriched = bookings.map((b) => ({
    ...b,
    service: servicesRepo.findById(b.service_id),
    provider: usersRepo.findPublicById(b.provider_id),
  }));

  enriched.sort(
    (a, b) => new Date(b.start_at).getTime() - new Date(a.start_at).getTime(),
  );

  return (
    <DashboardShell>
      <h1 className="display-h2 mb-6">My bookings</h1>
      <BookingsList bookings={enriched} />
    </DashboardShell>
  );
}
