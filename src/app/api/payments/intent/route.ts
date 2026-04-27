import { NextRequest } from "next/server";
import { ok, err, unauthorized, serverError } from "@/lib/api";
import { servicesRepo } from "@/lib/db";
import { getSession } from "@/lib/auth/sessions";
import { createPaymentIntent } from "@/lib/stripe";

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const session = await getSession();
    if (!session) return unauthorized();

    const body = (await req.json()) as { kind: string; service_id?: string; amount_cents?: number };
    const { kind, service_id, amount_cents } = body;

    let amount: number;
    if (kind === "booking") {
      if (!service_id) return err("service_id required for booking payment");
      const service = servicesRepo.findById(service_id);
      if (!service) return err("Service not found", 404);
      amount = service.price_cents;
    } else if (kind === "order") {
      if (!amount_cents || amount_cents <= 0) return err("amount_cents required for order payment");
      amount = amount_cents;
    } else {
      return err("Invalid payment kind");
    }

    const result = await createPaymentIntent(amount, {
      kind,
      user_id: session.user_id,
    });

    return ok(result);
  } catch (e) {
    return serverError(e);
  }
}
