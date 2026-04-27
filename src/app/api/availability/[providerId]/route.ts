import { NextRequest } from "next/server";
import { ok, err, notFound } from "@/lib/api";
import { servicesRepo } from "@/lib/db";
import { getSession } from "@/lib/auth/sessions";
import { getAvailableSlots } from "@/lib/booking-availability";

interface Params {
  params: Promise<{ providerId: string }>;
}

export async function GET(req: NextRequest, { params }: Params): Promise<Response> {
  const { providerId } = await params;
  const { searchParams } = req.nextUrl;
  const date = searchParams.get("date");
  const serviceId = searchParams.get("service_id");

  if (!date || !serviceId) return err("date and service_id are required");

  const service = servicesRepo.findById(serviceId);
  if (!service) return notFound("Service");

  const session = await getSession();
  const slots = getAvailableSlots(providerId, service, date, session?.user_id);

  return ok({ slots });
}
