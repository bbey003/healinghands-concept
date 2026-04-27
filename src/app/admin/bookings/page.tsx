import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getSession } from "@/lib/auth/sessions";
import { bookingsRepo, servicesRepo, usersRepo } from "@/lib/db";
import { AdminShell } from "@/components/admin/AdminShell";
import { formatPrice, formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin — Bookings" };

export default async function AdminBookingsPage(): Promise<JSX.Element> {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "admin" && session.role !== "moderator") redirect("/dashboard");

  const bookings = bookingsRepo.listAll().sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return (
    <AdminShell>
      <h2 className="font-display text-2xl mb-6">Bookings ({bookings.length})</h2>
      <div className="overflow-x-auto rounded-2xl border border-cream-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="border-b border-cream-200 bg-cream-50">
            <tr>
              {["Client", "Service", "Date", "Status", "Amount"].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-sans text-xs uppercase tracking-wider text-ink-subtle">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-100">
            {bookings.map((b) => {
              const user = usersRepo.findById(b.user_id);
              const service = servicesRepo.findById(b.service_id);
              return (
                <tr key={b.id} className="hover:bg-cream-50">
                  <td className="px-4 py-3 text-ink">{user?.display_name ?? b.user_id}</td>
                  <td className="px-4 py-3 text-ink-light">{service?.name ?? b.service_id}</td>
                  <td className="px-4 py-3 text-ink-light">{formatDateTime(b.start_at)}</td>
                  <td className="px-4 py-3 capitalize text-ink-light">{b.status}</td>
                  <td className="px-4 py-3">{formatPrice(b.price_cents)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
