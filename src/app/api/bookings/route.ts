import { NextRequest } from "next/server";
import { ok, err, unauthorized, serverError } from "@/lib/api";
import { servicesRepo, bookingsRepo, holdsRepo, notificationsRepo } from "@/lib/db";
import { getSession } from "@/lib/auth/sessions";
import { bookingCreateSchema } from "@/lib/validation";
import { isMockPayment } from "@/lib/stripe";

export async function GET(): Promise<Response> {
  try {
    const session = await getSession();
    if (!session) return unauthorized();

    let bookings;
    if (session.role === "admin" || session.role === "moderator") {
      bookings = bookingsRepo.listAll();
    } else if (session.role === "provider") {
      bookings = bookingsRepo.listByProvider(session.user_id);
    } else {
      bookings = bookingsRepo.listByUser(session.user_id);
    }
    return ok({ bookings });
  } catch (e) {
    return serverError(e);
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const session = await getSession();
    if (!session) return unauthorized();

    const body = await req.json() as unknown;
    const parsed = bookingCreateSchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.errors[0]?.message ?? "Invalid input");

    const { service_id, start_at, notes, payment_intent_id } = parsed.data;
    const service = servicesRepo.findById(service_id);
    if (!service) return err("Service not found", 404);

    const end_at = new Date(new Date(start_at).getTime() + service.duration_minutes * 60_000).toISOString();

    if (!isMockPayment(payment_intent_id) && !payment_intent_id.startsWith("pi_")) {
      return err("Invalid payment intent.");
    }

    if (bookingsRepo.isSlotTaken(service.provider_id, start_at, end_at)) {
      return err("This slot is no longer available.");
    }

    const booking = bookingsRepo.create({
      user_id: session.user_id,
      provider_id: service.provider_id,
      service_id,
      start_at,
      end_at,
      status: "confirmed",
      notes: notes ?? "",
      price_cents: service.price_cents,
      stripe_payment_intent_id: payment_intent_id,
      cancellation_reason: null,
      refund_status: "none",
    });

    const slot_key = `${service.provider_id}_${start_at}`;
    holdsRepo.release(slot_key);

    notificationsRepo.create({
      user_id: session.user_id,
      type: "booking_confirmed",
      title: `${service.name} confirmed`,
      body: `Your appointment is confirmed for ${new Date(start_at).toLocaleString()}.`,
      action_url: "/dashboard/bookings",
      image_url: null,
      data: { booking_id: booking.id },
      is_read: false,
      read_at: null,
      is_dismissed: false,
    });

    return ok({ booking }, 201);
  } catch (e) {
    return serverError(e);
  }
}
