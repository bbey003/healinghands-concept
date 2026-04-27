import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getSession } from "@/lib/auth/sessions";
import { usersRepo, bookingsRepo, ordersRepo } from "@/lib/db";
import { AdminShell } from "@/components/admin/AdminShell";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin" };

export default async function AdminPage(): Promise<JSX.Element> {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "admin" && session.role !== "moderator") redirect("/dashboard");

  const users = usersRepo.list();
  const bookings = bookingsRepo.listAll();
  const orders = ordersRepo.listAll();
  const revenue = bookings
    .filter((b) => b.status === "confirmed" || b.status === "completed")
    .reduce((s, b) => s + b.price_cents, 0);

  return (
    <AdminShell>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total users", value: users.length },
          { label: "Total bookings", value: bookings.length },
          { label: "Total orders", value: orders.length },
          { label: "Booking revenue", value: formatPrice(revenue) },
        ].map((stat) => (
          <div key={stat.label} className="float-card p-5">
            <p className="eyebrow">{stat.label}</p>
            <p className="mt-1 font-display text-3xl">{stat.value}</p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
