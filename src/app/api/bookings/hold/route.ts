import { NextRequest } from "next/server";
import { ok, err, unauthorized, serverError } from "@/lib/api";
import { servicesRepo, holdsRepo, bookingsRepo } from "@/lib/db";
import { getSession } from "@/lib/auth/sessions";
import { bookingHoldSchema } from "@/lib/validation";

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const session = await getSession();
    if (!session) return unauthorized();

    const body = await req.json() as unknown;
    const parsed = bookingHoldSchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.errors[0]?.message ?? "Invalid input");

    const { service_id, start_at } = parsed.data;
    const service = servicesRepo.findById(service_id);
    if (!service) return err("Service not found", 404);

    const end_at = new Date(new Date(start_at).getTime() + service.duration_minutes * 60_000).toISOString();

    if (bookingsRepo.isSlotTaken(service.provider_id, start_at, end_at)) {
      return err("This slot has already been booked.");
    }

    const slot_key = `${service.provider_id}_${start_at}`;
    const hold = holdsRepo.create({
      slot_key,
      user_id: session.user_id,
      service_id,
      start_at,
    });

    return ok({ hold: { slot_key: hold.slot_key, expires_at: hold.expires_at } });
  } catch (e) {
    return serverError(e);
  }
}
