import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { productsRepo } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "./AddToCartButton";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = productsRepo.findBySlug(slug);
  if (!product) return {};
  return { title: product.name };
}

export default async function ProductPage({ params }: Props): Promise<JSX.Element> {
  const { slug } = await params;
  const product = productsRepo.findBySlug(slug);
  if (!product) notFound();

  return (
    <div className="container-content py-16">
      <div className="grid gap-12 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-3xl">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          {product.gallery.slice(1).length > 0 && (
            <div className="grid grid-cols-4 gap-3">
              {product.gallery.slice(1).map((img, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-xl">
                  <Image src={img} alt="" fill className="object-cover" sizes="120px" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="eyebrow capitalize">{product.category.replace("-", " ")}</p>
          <h1 className="display-h2 mt-3">{product.name}</h1>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-display text-3xl text-sage-700">
              {formatPrice(product.price_cents)}
            </span>
            {product.compare_at_cents && (
              <span className="text-lg text-ink-subtle line-through">
                {formatPrice(product.compare_at_cents)}
              </span>
            )}
          </div>
          <p className="mt-6 leading-relaxed text-ink-light">{product.long_description}</p>
          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>
          {product.stock < 5 && product.stock > 0 && (
            <p className="mt-3 text-sm text-tan-500">
              Only {product.stock} left in stock.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
