import { NextRequest } from "next/server";
import { ok, err, unauthorized, forbidden, notFound, serverError } from "@/lib/api";
import { bookingsRepo } from "@/lib/db";
import { getSession } from "@/lib/auth/sessions";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(_req: NextRequest, { params }: Params): Promise<Response> {
  try {
    const session = await getSession();
    if (!session) return unauthorized();
    if (session.role !== "admin" && session.role !== "moderator" && session.role !== "provider") {
      return forbidden();
    }

    const { id } = await params;
    const booking = bookingsRepo.findById(id);
    if (!booking) return notFound("Booking");
    if (booking.status !== "confirmed") return err("Booking is not in confirmed status.");

    const updated = bookingsRepo.update(id, { status: "completed" });
    return ok({ booking: updated });
  } catch (e) {
    return serverError(e);
  }
}
