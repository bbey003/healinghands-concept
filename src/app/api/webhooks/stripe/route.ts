import { NextRequest } from "next/server";
import { ok, serverError } from "@/lib/api";

export async function POST(req: NextRequest): Promise<Response> {
  try {
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      return ok({ received: true, mock: true });
    }

    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers.get("stripe-signature") ?? "";
    const body = await req.text();

    const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log(`[stripe webhook] ${event.type}`);

    return ok({ received: true });
  } catch (e) {
    return serverError(e);
  }
}
