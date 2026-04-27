import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getSession } from "@/lib/auth/sessions";
import { usersRepo, bookingsRepo, ordersRepo, notificationsRepo } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { formatPrice, formatDate, formatTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage(): Promise<JSX.Element> {
  const session = await getSession();
  if (!session) redirect("/login?redirect=/dashboard");

  const user = usersRepo.findById(session.user_id);
  if (!user) redirect("/login");

  const bookings = bookingsRepo.listByUser(user.id);
  const orders = ordersRepo.listByUser(user.id);
  const unread = notificationsRepo.countUnread(user.id);

  const upcoming = bookings
    .filter((b) => b.status === "confirmed" && new Date(b.start_at) > new Date())
    .sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime())
    .slice(0, 2);

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div>
          <h1 className="display-h2">
            Hello, {user.display_name.split(" ")[0]}.
          </h1>
          <p className="mt-1 text-ink-light">Welcome to your dashboard.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="float-card p-5">
            <p className="eyebrow">Upcoming bookings</p>
            <p className="mt-1 font-display text-3xl">{upcoming.length}</p>
          </div>
          <div className="float-card p-5">
            <p className="eyebrow">Total orders</p>
            <p className="mt-1 font-display text-3xl">{orders.length}</p>
          </div>
          <div className="float-card p-5">
            <p className="eyebrow">Notifications</p>
            <p className="mt-1 font-display text-3xl">{unread}</p>
          </div>
        </div>

        {upcoming.length > 0 && (
          <div>
            <h2 className="font-display text-xl mb-4">Next up</h2>
            <div className="space-y-3">
              {upcoming.map((b) => (
                <div key={b.id} className="rounded-2xl border border-sage-200 bg-sage-50 p-5">
                  <p className="font-sans text-sm font-medium text-sage-700">
                    {formatDate(b.start_at)} · {formatTime(b.start_at)}
                  </p>
                  <p className="mt-1 font-display text-lg text-ink">{b.service_id}</p>
                  <p className="text-sm text-ink-light">{formatPrice(b.price_cents)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Link href="/book" className="btn-primary">Book appointment</Link>
          <Link href="/shop" className="btn-secondary">Shop products</Link>
        </div>
      </div>
    </DashboardShell>
  );
}
