"use client";

import { useState } from "react";
import Link from "next/link";
import type { Booking, Service, PublicUser } from "@/types";
import { formatPrice, formatDate, formatTime } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Loading";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

interface EnrichedBooking extends Booking {
  service: Service | null;
  provider: PublicUser | null;
}

interface BookingsListProps {
  bookings: EnrichedBooking[];
}

const statusColors: Record<string, string> = {
  confirmed: "bg-sage-100 text-sage-700",
  completed: "bg-cream-200 text-ink-light",
  cancelled: "bg-red-50 text-red-600",
  held: "bg-tan-100 text-tan-600",
};

export function BookingsList({ bookings }: BookingsListProps): JSX.Element {
  const toast = useToast();
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [localBookings, setLocalBookings] = useState(bookings);

  const handleCancel = async (id: string): Promise<void> => {
    setCancelling(id);
    try {
      const res = await fetch(`/api/bookings/${id}/cancel`, { method: "PATCH" });
      const j = (await res.json()) as { ok: boolean; error?: string };
      if (!j.ok) {
        toast.push("error", j.error ?? "Could not cancel booking.");
        return;
      }
      setLocalBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)),
      );
      toast.push("success", "Booking cancelled.");
    } catch {
      toast.push("error", "Network error.");
    } finally {
      setCancelling(null);
    }
  };

  if (localBookings.length === 0) {
    return (
      <EmptyState
        title="No bookings yet"
        description="Book your first appointment."
        action={
          <Link href="/book" className="btn-primary mt-2">
            Book now
          </Link>
        }
      />
    );
  }

  const upcoming = localBookings.filter(
    (b) => b.status === "confirmed" && new Date(b.start_at) > new Date(),
  );
  const past = localBookings.filter(
    (b) => b.status !== "confirmed" || new Date(b.start_at) <= new Date(),
  );

  const renderBooking = (b: EnrichedBooking): JSX.Element => (
    <div key={b.id} className="rounded-2xl border border-cream-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="font-display text-lg text-ink">
            {b.service?.name ?? "Service"}
          </p>
          <p className="mt-0.5 text-sm text-ink-light">
            with {b.provider?.display_name ?? "—"}
          </p>
          <p className="mt-1 text-sm text-ink">
            {formatDate(b.start_at)} · {formatTime(b.start_at)}
          </p>
          <p className="text-sm text-ink-light">
            {b.service?.duration_minutes ?? "—"} min · {formatPrice(b.price_cents)}
          </p>
        </div>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium",
            statusColors[b.status] ?? "bg-cream-100 text-ink",
          )}
        >
          {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
        </span>
      </div>
      {b.status === "confirmed" && new Date(b.start_at) > new Date() && (
        <div className="mt-4">
          <Button
            size="sm"
            variant="danger"
            loading={cancelling === b.id}
            onClick={() => void handleCancel(b.id)}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {upcoming.length > 0 && (
        <section>
          <h2 className="font-display text-xl mb-4">Upcoming</h2>
          <div className="space-y-4">{upcoming.map(renderBooking)}</div>
        </section>
      )}
      {past.length > 0 && (
        <section>
          <h2 className="font-display text-xl mb-4">Past</h2>
          <div className="space-y-4">{past.map(renderBooking)}</div>
        </section>
      )}
    </div>
  );
}
