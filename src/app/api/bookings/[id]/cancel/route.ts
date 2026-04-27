import { NextRequest } from "next/server";
import { ok, err, unauthorized, forbidden, notFound, serverError } from "@/lib/api";
import { bookingsRepo, servicesRepo, notificationsRepo } from "@/lib/db";
import { getSession } from "@/lib/auth/sessions";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: Params): Promise<Response> {
  try {
    const session = await getSession();
    if (!session) return unauthorized();

    const { id } = await params;
    const booking = bookingsRepo.findById(id);
    if (!booking) return notFound("Booking");

    const isOwner = booking.user_id === session.user_id;
    const isAdmin = session.role === "admin" || session.role === "moderator";
    if (!isOwner && !isAdmin) return forbidden();

    if (booking.status !== "confirmed") return err("Only confirmed bookings can be cancelled.");

    const service = servicesRepo.findById(booking.service_id);
    const cutoffHours = service?.cancellation_cutoff_hours ?? 24;
    const cutoffMs = cutoffHours * 60 * 60 * 1000;
    if (!isAdmin && new Date(booking.start_at).getTime() - Date.now() < cutoffMs) {
      return err(`Cancellations must be made at least ${cutoffHours} hours in advance.`);
    }

    const updated = bookingsRepo.update(id, {
      status: "cancelled",
      cancellation_reason: "Cancelled by user",
      refund_status: "pending",
    });

    notificationsRepo.create({
      user_id: booking.user_id,
      type: "booking_cancelled",
      title: "Booking cancelled",
      body: `Your ${service?.name ?? "appointment"} has been cancelled.`,
      action_url: "/dashboard/bookings",
      image_url: null,
      data: { booking_id: id },
      is_read: false,
      read_at: null,
      is_dismissed: false,
    });

    return ok({ booking: updated });
  } catch (e) {
    return serverError(e);
  }
}
