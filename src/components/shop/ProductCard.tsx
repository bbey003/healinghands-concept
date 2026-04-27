"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/CartProvider";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps): JSX.Element {
  const { add } = useCart();
  const toast = useToast();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = (): void => {
    setAdding(true);
    const variant = product.variants[0] ?? null;
    add({
      product_id: product.id,
      variant_id: variant?.id ?? null,
      name: product.name,
      variant_name: variant?.name ?? null,
      price_cents: variant?.price_cents ?? product.price_cents,
      quantity: 1,
      image_url: product.image_url,
    });
    toast.push("success", `${product.name} added to cart.`);
    setTimeout(() => setAdding(false), 600);
  };

  const outOfStock = product.stock === 0;

  return (
    <article className="float-card group flex flex-col overflow-hidden p-0">
      <Link href={`/shop/${product.slug}`} className="block overflow-hidden">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {product.compare_at_cents && (
            <span className="absolute left-3 top-3 rounded-full bg-tan-400 px-3 py-1 text-xs font-medium text-cream-50">
              Sale
            </span>
          )}
          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-ink/30">
              <span className="rounded-full bg-white/90 px-4 py-1.5 text-xs font-medium text-ink">
                Out of stock
              </span>
            </div>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <Link href={`/shop/${product.slug}`}>
          <h3 className="font-display text-lg text-ink hover:text-sage-700 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 flex-1 text-sm text-ink-light line-clamp-2">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl text-ink">
              {formatPrice(product.price_cents)}
            </span>
            {product.compare_at_cents && (
              <span className="text-sm text-ink-subtle line-through">
                {formatPrice(product.compare_at_cents)}
              </span>
            )}
          </div>
          <Button
            size="sm"
            variant="secondary"
            disabled={outOfStock}
            onClick={handleAddToCart}
          >
            {adding ? "Added!" : "Add"}
          </Button>
        </div>
      </div>
    </article>
  );
}
