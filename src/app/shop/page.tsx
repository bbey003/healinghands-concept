import type { Metadata } from "next";
import { productsRepo } from "@/lib/db";
import { ProductCard } from "@/components/shop/ProductCard";

export const metadata: Metadata = { title: "Shop — Essentially Yours" };

export default async function ShopPage(): Promise<JSX.Element> {
  const products = productsRepo.listActive();

  return (
    <>
      <section className="container-content py-20">
        <p className="eyebrow">Essentially Yours</p>
        <h1 className="display-h1 mt-4">Take the studio home.</h1>
        <p className="mt-4 max-w-lg text-lg text-ink-light">
          Hand-poured oils, balms, and candles — bottled in small batches at the studio in
          Middletown.
        </p>
      </section>

      <section className="container-content pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
