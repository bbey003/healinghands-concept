"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/CartProvider";
import { useToast } from "@/components/ui/Toast";
import { formatPrice, calcTax, calcShipping } from "@/lib/utils";

export function CheckoutFlow(): JSX.Element {
  const router = useRouter();
  const { items, total, clear } = useCart();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    line1: "",
    line2: "",
    city: "",
    state: "DE",
    postal_code: "",
  });

  const tax = calcTax(total);
  const shipping = calcShipping(total);
  const grandTotal = total + tax + shipping;

  const update = (field: string, value: string): void => {
    setForm((p) => ({ ...p, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    try {
      // Create payment intent
      const intentRes = await fetch("/api/payments/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "order", amount_cents: grandTotal }),
      });
      const intentJson = (await intentRes.json()) as {
        ok: boolean;
        data?: { payment_intent_id: string };
        error?: string;
      };
      if (!intentJson.ok || !intentJson.data) {
        toast.push("error", intentJson.error ?? "Payment setup failed.");
        return;
      }

      const checkoutRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            product_id: i.product_id,
            variant_id: i.variant_id,
            quantity: i.quantity,
          })),
          shipping_address: { ...form, country: "US" },
          payment_intent_id: intentJson.data.payment_intent_id,
        }),
      });
      const checkoutJson = (await checkoutRes.json()) as {
        ok: boolean;
        error?: string;
        data?: { order: { id: string } };
      };
      if (!checkoutJson.ok || !checkoutJson.data) {
        toast.push("error", checkoutJson.error ?? "Order failed.");
        return;
      }
      clear();
      router.push(`/dashboard/orders?success=1`);
    } catch {
      toast.push("error", "Network error.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    router.push("/cart");
    return <></>;
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="grid gap-10 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-8">
        <div className="float-card p-6 md:p-8 space-y-5">
          <h2 className="font-display text-xl">Shipping address</h2>
          <Input label="Full name" value={form.name} onChange={(e) => update("name", e.target.value)} required />
          <Input label="Address line 1" value={form.line1} onChange={(e) => update("line1", e.target.value)} required />
          <Input label="Address line 2 (optional)" value={form.line2} onChange={(e) => update("line2", e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="City" value={form.city} onChange={(e) => update("city", e.target.value)} required />
            <Input label="State" value={form.state} onChange={(e) => update("state", e.target.value)} required />
          </div>
          <Input label="ZIP code" value={form.postal_code} onChange={(e) => update("postal_code", e.target.value)} required />
        </div>

        <div className="float-card p-6 md:p-8">
          <h2 className="font-display text-xl">Payment</h2>
          <p className="mt-2 rounded-lg border border-tan-200 bg-tan-100 p-4 text-sm text-ink-light">
            <strong className="text-ink">Demo mode:</strong> No real payment is processed.
          </p>
        </div>
      </div>

      <div>
        <div className="sticky top-28 rounded-2xl border border-cream-200 bg-white p-6 space-y-4">
          <h2 className="font-display text-xl">Order summary</h2>
          <ul className="space-y-2 text-sm">
            {items.map((item) => (
              <li key={`${item.product_id}-${item.variant_id}`} className="flex justify-between gap-2">
                <span className="text-ink-light">
                  {item.name} {item.variant_name ? `(${item.variant_name})` : ""} ×{item.quantity}
                </span>
                <span>{formatPrice(item.price_cents * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="space-y-2 border-t border-cream-200 pt-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-light">Subtotal</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-light">Tax</dt>
              <dd>{formatPrice(tax)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-light">Shipping</dt>
              <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-cream-200 pt-2 font-display text-lg">
              <dt>Total</dt>
              <dd>{formatPrice(grandTotal)}</dd>
            </div>
          </dl>
          <Button type="submit" loading={loading} fullWidth>
            Place order
          </Button>
        </div>
      </div>
    </form>
  );
}
