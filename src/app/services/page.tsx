import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { servicesRepo, usersRepo } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Services — Healing Hands Spa" };

export default async function ServicesPage(): Promise<JSX.Element> {
  const services = servicesRepo.listActive().filter((s) => s.category !== "ceu");

  return (
    <>
      <section className="container-content py-20">
        <p className="eyebrow">What we offer</p>
        <h1 className="display-h1 mt-4">Services</h1>
        <p className="mt-4 max-w-xl text-lg text-ink-light">
          Every treatment is tailored to you — unhurried, attentive, and performed by a licensed
          therapist who takes the time to listen before they begin.
        </p>
      </section>

      <section className="container-content pb-24">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const provider = usersRepo.findPublicById(s.provider_id);
            return (
              <article key={s.id} className="float-card group flex flex-col overflow-hidden p-0">
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={s.image_url}
                    alt={s.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="eyebrow">
                    {s.duration_minutes} min
                    {provider ? ` · with ${provider.display_name}` : ""}
                  </p>
                  <h2 className="mt-2 font-display text-2xl">{s.name}</h2>
                  <p className="mt-2 flex-1 text-sm text-ink-light">{s.description}</p>
                  <div className="mt-6 flex items-center justify-between border-t border-cream-200 pt-4">
                    <span className="font-display text-xl text-sage-700">
                      {formatPrice(s.price_cents)}
                    </span>
                    <Link
                      href={`/book?service=${s.id}`}
                      className="font-sans text-xs uppercase tracking-wider text-sage-700 hover:text-sage-800"
                    >
                      Book →
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
