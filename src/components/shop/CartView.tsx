"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { formatPrice, calcTax, calcShipping } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Loading";

export function CartView(): JSX.Element {
  const { items, remove, update, total, clear } = useCart();

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Add some products from the shop."
        action={
          <Link href="/shop" className="btn-primary mt-2">
            Browse the shop
          </Link>
        }
      />
    );
  }

  const tax = calcTax(total);
  const shipping = calcShipping(total);
  const grandTotal = total + tax + shipping;

  return (
    <div className="grid gap-10 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        {items.map((item) => (
          <div
            key={`${item.product_id}-${item.variant_id}`}
            className="flex gap-4 rounded-2xl border border-cream-200 bg-white p-4"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
              <Image
                src={item.image_url}
                alt={item.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-sans text-sm font-medium text-ink">{item.name}</p>
                  {item.variant_name && (
                    <p className="text-xs text-ink-subtle">{item.variant_name}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => remove(item.product_id, item.variant_id)}
                  className="text-ink-subtle hover:text-red-500 transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 rounded-full border border-cream-300 px-3 py-1">
                  <button
                    type="button"
                    onClick={() => update(item.product_id, item.variant_id, item.quantity - 1)}
                    aria-label="Decrease"
                    className="text-ink-subtle hover:text-ink"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="min-w-[1.5rem] text-center text-sm">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => update(item.product_id, item.variant_id, item.quantity + 1)}
                    aria-label="Increase"
                    className="text-ink-subtle hover:text-ink"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <span className="font-display text-lg text-ink">
                  {formatPrice(item.price_cents * item.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={clear}
          className="text-xs uppercase tracking-wider text-ink-subtle hover:text-red-500 transition-colors"
        >
          Clear cart
        </button>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-cream-200 bg-white p-6">
          <h2 className="font-display text-xl">Order summary</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-light">Subtotal</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-light">Tax (6% DE)</dt>
              <dd>{formatPrice(tax)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-light">Shipping</dt>
              <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-ink-subtle">
                Free shipping on orders over $75
              </p>
            )}
            <div className="flex justify-between border-t border-cream-200 pt-3 font-display text-lg">
              <dt>Total</dt>
              <dd>{formatPrice(grandTotal)}</dd>
            </div>
          </dl>
          <Link href="/checkout" className="btn-primary mt-6 block text-center">
            Proceed to checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
