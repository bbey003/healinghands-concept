"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Service, PublicUser } from "@/types";
import { LoadingScreen, EmptyState, Spinner } from "@/components/ui/Loading";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ui/Toast";
import { formatPrice, formatDate, formatTime, cn } from "@/lib/utils";

interface ServiceWithProvider extends Service {
  provider: PublicUser | null;
}

interface Slot {
  start_at: string;
  end_at: string;
  status: "available" | "booked" | "held";
}

type Step = "service" | "datetime" | "review" | "done";

export function BookingFlow(): JSX.Element {
  const search = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const toast = useToast();

  const [services, setServices] = useState<ServiceWithProvider[] | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    search.get("service"),
  );
  const [step, setStep] = useState<Step>(
    search.get("service") ? "datetime" : "service",
  );

  const [calendarMonth, setCalendarMonth] = useState<Date>(() => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // YYYY-MM-DD
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const [hold, setHold] = useState<{ slot_key: string; expires_at: string } | null>(null);
  const [holdRemaining, setHoldRemaining] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [notes, setNotes] = useState("");
  const [bookingId, setBookingId] = useState<string | null>(null);

  const selectedService = useMemo(
    () => services?.find((s) => s.id === selectedServiceId) ?? null,
    [services, selectedServiceId],
  );

  // Fetch services
  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then(
        (j: {
          ok: boolean;
          data?: { services: ServiceWithProvider[] };
        }) => {
          if (j.ok && j.data) setServices(j.data.services);
          else setServices([]);
        },
      );
  }, []);

  // Fetch slots when date / service changes
  useEffect(() => {
    if (!selectedService || !selectedDate) {
      setSlots(null);
      return;
    }
    setSlotsLoading(true);
    fetch(
      `/api/availability/${selectedService.provider_id}?date=${selectedDate}&service_id=${selectedService.id}`,
    )
      .then((r) => r.json())
      .then((j: { ok: boolean; data?: { slots: Slot[] } }) => {
        if (j.ok && j.data) setSlots(j.data.slots);
        else setSlots([]);
      })
      .finally(() => setSlotsLoading(false));
  }, [selectedDate, selectedService]);

  // Hold countdown
  useEffect(() => {
    if (!hold) return;
    const tick = (): void => {
      const remaining = Math.max(
        0,
        new Date(hold.expires_at).getTime() - Date.now(),
      );
      setHoldRemaining(remaining);
      if (remaining === 0) {
        toast.push("info", "Your reservation expired. Please pick a new slot.");
        setHold(null);
        setSelectedSlot(null);
        setStep("datetime");
        // Re-fetch slots
        if (selectedDate && selectedService) {
          fetch(
            `/api/availability/${selectedService.provider_id}?date=${selectedDate}&service_id=${selectedService.id}`,
          )
            .then((r) => r.json())
            .then((j: { ok: boolean; data?: { slots: Slot[] } }) => {
              if (j.ok && j.data) setSlots(j.data.slots);
            });
      }
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [hold, selectedDate, selectedService, toast]);

  if (authLoading || services === null) {
    return <LoadingScreen label="Loading..." />;
  }
  if (services.length === 0) {
    return <EmptyState title="No services available" description="Please check back soon." />;
  }

  // ---------- STEP: service selection ----------
  if (step === "service") {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {services.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              setSelectedServiceId(s.id);
              setStep("datetime");
            }}
            className="float-card group p-6 text-left transition-all hover:shadow-floathover"
          >
            <p className="eyebrow">
              {s.duration_minutes} min · with {s.provider?.display_name ?? "—"}
            </p>
            <h3 className="mt-2 font-display text-2xl text-ink">{s.name}</h3>
            <p className="mt-3 line-clamp-3 text-sm text-ink-light">{s.description}</p>
            <div className="mt-6 flex items-center justify-between border-t border-cream-200 pt-4">
              <span className="font-display text-xl text-sage-700">
                {formatPrice(s.price_cents)}
              </span>
              <span className="font-sans text-xs uppercase tracking-wider text-sage-700 group-hover:text-sage-800">
                Choose →
              </span>
            </div>
          </button>
        ))}
      </div>
    );
  }

  // ---------- STEP: date + time selection ----------
  if (step === "datetime" && selectedService) {
    const monthYear = calendarMonth.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    const firstDay = new Date(calendarMonth);
    const lastDay = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0);
    const days: { date: Date; iso: string; isCurrentMonth: boolean; isPast: boolean }[] = [];
    const startWeekday = firstDay.getDay();
    // Pad start
    for (let i = 0; i < startWeekday; i++) {
      const d = new Date(firstDay);
      d.setDate(firstDay.getDate() - (startWeekday - i));
      days.push({
        date: d,
        iso: toIsoDate(d),
        isCurrentMonth: false,
        isPast: true,
      });
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), i);
      const isPast = d.getTime() < new Date().setHours(0, 0, 0, 0);
      days.push({
        date: d,
        iso: toIsoDate(d),
        isCurrentMonth: true,
        isPast,
      });
    }
    // Pad end so total cells make full weeks
    while (days.length % 7 !== 0) {
      const last = days[days.length - 1];
      if (!last) break;
      const d = new Date(last.date);
      d.setDate(last.date.getDate() + 1);
      days.push({
        date: d,
        iso: toIsoDate(d),
        isCurrentMonth: false,
        isPast: false,
      });
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => setStep("service")}
            className="btn-ghost"
          >
            <ChevronLeft className="h-4 w-4" /> Change service
          </button>
          <div className="rounded-full bg-sage-100 px-5 py-2 text-sm">
            <span className="text-ink-light">Selected:</span>{" "}
            <strong className="text-sage-700">{selectedService.name}</strong> ·{" "}
            {formatPrice(selectedService.price_cents)}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="float-card p-6">
            <div className="mb-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() =>
                  setCalendarMonth((d) => {
                    const next = new Date(d);
                    next.setMonth(d.getMonth() - 1);
                    return next;
                  })
                }
                aria-label="Previous month"
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-cream-200"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <h3 className="font-display text-xl">{monthYear}</h3>
              <button
                type="button"
                onClick={() =>
                  setCalendarMonth((d) => {
                    const next = new Date(d);
                    next.setMonth(d.getMonth() + 1);
                    return next;
                  })
                }
                aria-label="Next month"
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-cream-200"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs uppercase tracking-wider text-ink-subtle">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <div key={i} className="py-2">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((d) => {
                const disabled = !d.isCurrentMonth || d.isPast;
                const isSelected = selectedDate === d.iso;
                return (
                  <button
                    key={d.iso + d.isCurrentMonth}
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      setSelectedDate(d.iso);
                      setSelectedSlot(null);
                    }}
                    className={cn(
                      "aspect-square rounded-full text-sm transition-colors",
                      disabled && "text-ink-subtle/40 cursor-not-allowed",
                      !disabled && !isSelected && "hover:bg-sage-100 text-ink",
                      isSelected && "bg-sage-700 text-cream-50",
                    )}
                  >
                    {d.date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="float-card p-6">
            <h3 className="font-display text-xl">
              {selectedDate
                ? formatDate(selectedDate + "T12:00:00")
                : "Choose a date first"}
            </h3>
            {!selectedDate ? (
              <p className="mt-4 text-sm text-ink-light">
                Pick a date on the calendar to view available times.
              </p>
            ) : slotsLoading ? (
              <div className="flex items-center gap-3 py-8">
                <Spinner /> <span className="text-sm text-ink-light">Loading slots...</span>
              </div>
            ) : !slots || slots.length === 0 ? (
              <p className="mt-4 text-sm text-ink-light">
                No availability on this day. Please choose another date.
              </p>
            ) : (
              <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {slots.map((slot) => {
                  const isSelected = selectedSlot === slot.start_at;
                  const disabled = slot.status !== "available";
                  return (
                    <button
                      key={slot.start_at}
                      type="button"
                      onClick={() => setSelectedSlot(slot.start_at)}
                      disabled={disabled}
                      title={
                        slot.status === "held"
                          ? "Held by another guest"
                          : slot.status === "booked"
                            ? "Booked"
                            : ""
                      }
                      className={cn(
                        "rounded-lg border px-2 py-2.5 text-sm transition-colors",
                        disabled && "cursor-not-allowed border-cream-200 text-ink-subtle/40 line-through",
                        !disabled && !isSelected && "border-cream-300 hover:border-sage-500 hover:bg-sage-50",
                        isSelected && "border-sage-700 bg-sage-700 text-cream-50",
                      )}
                    >
                      {formatTime(slot.start_at)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            disabled={!selectedSlot}
            loading={submitting}
            onClick={async () => {
              if (!selectedService || !selectedSlot) return;
              if (!user) {
                router.push(`/login?redirect=/book?service=${selectedService.id}`);
                return;
              }
              setSubmitting(true);
              try {
                const res = await fetch("/api/bookings/hold", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    service_id: selectedService.id,
                    start_at: selectedSlot,
                  }),
                });
                const j = (await res.json()) as {
                  ok: boolean;
                  error?: string;
                  data?: {
                    hold: { slot_key: string; expires_at: string };
                  };
                };
                if (!j.ok || !j.data) {
                  toast.push("error", j.error ?? "Could not hold this slot.");
                  return;
                }
                setHold(j.data.hold);
                setStep("review");
              } catch {
                toast.push("error", "Network error.");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  // ---------- STEP: review + confirm ----------
  if (step === "review" && selectedService && selectedSlot && hold) {
    const minutes = Math.floor(holdRemaining / 60_000);
    const seconds = Math.floor((holdRemaining % 60_000) / 1000);

    const handleConfirm = async (): Promise<void> => {
      setSubmitting(true);
      try {
        // Create payment intent
        const intentRes = await fetch("/api/payments/intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kind: "booking",
            service_id: selectedService.id,
          }),
        });
        const intentJson = (await intentRes.json()) as {
          ok: boolean;
          data?: { payment_intent_id: string; mock: boolean };
          error?: string;
        };
        if (!intentJson.ok || !intentJson.data) {
          toast.push("error", intentJson.error ?? "Payment setup failed.");
          return;
        }

        // (In live mode, the Stripe Payment Element would confirm here.)
        // Mock mode: payment is auto-succeeded server-side, so go straight to booking.

        const bookRes = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service_id: selectedService.id,
            start_at: selectedSlot,
            notes,
            payment_intent_id: intentJson.data.payment_intent_id,
          }),
        });
        const bookJson = (await bookRes.json()) as {
          ok: boolean;
          error?: string;
          data?: { booking: { id: string } };
        };
        if (!bookJson.ok || !bookJson.data) {
          toast.push("error", bookJson.error ?? "Could not complete booking.");
          return;
        }
        setBookingId(bookJson.data.booking.id);
        setStep("done");
      } catch {
        toast.push("error", "Network error.");
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="float-card p-6 md:p-8">
            <h3 className="font-display text-2xl">Review your appointment</h3>
            <dl className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between border-b border-cream-200 pb-3">
                <dt className="text-ink-light">Service</dt>
                <dd className="text-ink">{selectedService.name}</dd>
              </div>
              <div className="flex justify-between border-b border-cream-200 pb-3">
                <dt className="text-ink-light">Therapist</dt>
                <dd className="text-ink">{selectedService.provider?.display_name}</dd>
              </div>
              <div className="flex justify-between border-b border-cream-200 pb-3">
                <dt className="text-ink-light">Date</dt>
                <dd className="text-ink">{formatDate(selectedSlot)}</dd>
              </div>
              <div className="flex justify-between border-b border-cream-200 pb-3">
                <dt className="text-ink-light">Time</dt>
                <dd className="text-ink">{formatTime(selectedSlot)}</dd>
              </div>
              <div className="flex justify-between border-b border-cream-200 pb-3">
                <dt className="text-ink-light">Duration</dt>
                <dd className="text-ink">{selectedService.duration_minutes} min</dd>
              </div>
              <div className="flex justify-between font-display text-lg">
                <dt>Total</dt>
                <dd>{formatPrice(selectedService.price_cents)}</dd>
              </div>
            </dl>
          </div>

          <div className="float-card p-6 md:p-8">
            <Textarea
              label="Notes for your therapist (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any specific tension, allergies, pressure preferences?"
              rows={4}
              maxLength={500}
            />
          </div>

          <div className="float-card p-6 md:p-8">
            <h4 className="font-display text-lg">Payment</h4>
            <p className="mt-2 rounded-lg border border-tan-200 bg-tan-100 p-4 text-sm text-ink-light">
              <strong className="text-ink">Demo mode:</strong> No real payment is
              processed. In production, Stripe's Payment Element would appear
              here, handling cards and 3DS securely.
            </p>
          </div>
        </div>

        <aside>
          <div className="sticky top-28 space-y-4">
            <div className="rounded-2xl border border-sage-300 bg-sage-50 p-5">
              <p className="font-sans text-xs uppercase tracking-wider text-sage-700">
                Slot reserved for
              </p>
              <p className="mt-1 font-display text-3xl text-sage-700 tabular-nums">
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </p>
              <p className="mt-2 text-xs text-ink-light">
                Complete your booking before the timer ends.
              </p>
            </div>
            <Button onClick={() => void handleConfirm()} loading={submitting} fullWidth>
              Confirm booking
            </Button>
            <button
              type="button"
              onClick={() => {
                setHold(null);
                setStep("datetime");
              }}
              className="block w-full text-center text-xs uppercase tracking-wider text-ink-subtle hover:text-ink"
            >
              Cancel and pick a different time
            </button>
          </div>
        </aside>
      </div>
    );
  }

  // ---------- STEP: done ----------
  if (step === "done" && bookingId) {
    return (
      <div className="float-card mx-auto max-w-xl p-12 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-sage-100">
          <span className="text-3xl text-sage-700">✓</span>
        </div>
        <h2 className="display-h2">You're booked.</h2>
        <p className="mt-3 text-ink-light">
          A confirmation has been sent to your email. We'll see you soon.
        </p>
        <p className="mt-2 text-xs text-ink-subtle">
          Booking ID: {bookingId.slice(0, 8)}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/dashboard/bookings" className="btn-primary">
            View my bookings
          </Link>
          <Link href="/" className="btn-secondary">
            Done
          </Link>
        </div>
      </div>
    );
  }

  return <LoadingScreen />;
}

function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
