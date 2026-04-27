import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getSession } from "@/lib/auth/sessions";
import { ordersRepo } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { EmptyState } from "@/components/ui/Loading";
import { formatPrice, formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "My orders" };

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}): Promise<JSX.Element> {
  const session = await getSession();
  if (!session) redirect("/login?redirect=/dashboard/orders");

  const orders = ordersRepo.listByUser(session.user_id).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
  const { success } = await searchParams;

  return (
    <DashboardShell>
      <h1 className="display-h2 mb-6">My orders</h1>
      {success && (
        <div className="mb-6 rounded-2xl border border-sage-200 bg-sage-50 p-5 text-sm text-sage-700">
          Order placed! You'll receive an email confirmation shortly.
        </div>
      )}
      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="Browse the shop to find something you love."
          action={
            <Link href="/shop" className="btn-primary mt-2">
              Shop now
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="float-card p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-sans text-xs uppercase tracking-wider text-ink-subtle">
                    Order #{o.id.slice(0, 8)}
                  </p>
                  <p className="mt-1 text-sm text-ink-light">
                    {formatDateTime(o.created_at)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-xl">{formatPrice(o.total_cents)}</p>
                  <p className="text-xs capitalize text-ink-light">{o.status}</p>
                </div>
              </div>
              <ul className="mt-3 space-y-1 border-t border-cream-200 pt-3">
                {o.items.map((item, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span className="text-ink-light">
                      {item.name} ×{item.quantity}
                    </span>
                    <span>{formatPrice(item.price_cents * item.quantity)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
