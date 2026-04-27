"use client";

import { useState } from "react";
import type { Product } from "@/types";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/CartProvider";
import { useToast } from "@/components/ui/Toast";
import { formatPrice } from "@/lib/utils";

export function AddToCartButton({ product }: { product: Product }): JSX.Element {
  const { add } = useCart();
  const toast = useToast();
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants[0]?.id ?? null,
  );
  const [added, setAdded] = useState(false);

  const variant = product.variants.find((v) => v.id === selectedVariant) ?? null;
  const price = variant?.price_cents ?? product.price_cents;
  const outOfStock = product.stock === 0 || (variant && variant.stock === 0);

  const handleAdd = (): void => {
    add({
      product_id: product.id,
      variant_id: variant?.id ?? null,
      name: product.name,
      variant_name: variant?.name ?? null,
      price_cents: price,
      quantity: 1,
      image_url: product.image_url,
    });
    toast.push("success", `${product.name} added to cart.`);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4">
      {product.variants.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.variants.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setSelectedVariant(v.id)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                selectedVariant === v.id
                  ? "border-sage-700 bg-sage-700 text-cream-50"
                  : "border-cream-300 hover:border-sage-500"
              } ${v.stock === 0 ? "opacity-40 cursor-not-allowed line-through" : ""}`}
              disabled={v.stock === 0}
            >
              {v.name} — {formatPrice(v.price_cents)}
            </button>
          ))}
        </div>
      )}
      <Button
        size="lg"
        onClick={handleAdd}
        disabled={!!outOfStock}
        fullWidth
      >
        {outOfStock ? "Out of stock" : added ? "Added to cart!" : "Add to cart"}
      </Button>
    </div>
  );
}
