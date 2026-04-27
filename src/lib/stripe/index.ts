import { generateId } from "@/lib/db/store";

interface PaymentIntentResult {
  payment_intent_id: string;
  client_secret: string | null;
  mock: boolean;
}

export async function createPaymentIntent(
  amount_cents: number,
  metadata?: Record<string, string>,
): Promise<PaymentIntentResult> {
  if (!process.env.STRIPE_SECRET_KEY) {
    const id = `pi_mock_${generateId()}`;
    return { payment_intent_id: id, client_secret: `${id}_secret_mock`, mock: true };
  }

  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const intent = await stripe.paymentIntents.create({
    amount: amount_cents,
    currency: "usd",
    metadata: metadata ?? {},
  });
  return {
    payment_intent_id: intent.id,
    client_secret: intent.client_secret,
    mock: false,
  };
}

export function isMockPayment(payment_intent_id: string): boolean {
  return payment_intent_id.startsWith("pi_mock_");
}
