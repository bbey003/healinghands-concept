import Image from "next/image";
import Link from "next/link";
import { servicesRepo, productsRepo, usersRepo } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

export default async function HomePage(): Promise<JSX.Element> {
  const [services, products, adele] = await Promise.all([
    servicesRepo.listActive(),
    productsRepo.listActive(),
    usersRepo.findByEmail("adele@healinghandsspa.com"),
  ]);

  const featured = services.slice(0, 3);
  const featuredProducts = products.slice(0, 4);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container-content grid min-h-[88vh] grid-cols-1 items-center gap-12 py-12 lg:grid-cols-12 lg:py-20">
          <div className="relative z-10 lg:col-span-6">
            <p className="eyebrow animate-fade-up">
              Healing Hands Spa · Middletown, DE
            </p>
            <h1
              className="display-h1 mt-6 animate-fade-up text-balance"
              style={{ animationDelay: "0.1s" }}
            >
              Slowness, returned to the body.
            </h1>
            <p
              className="mt-6 max-w-md text-lg leading-relaxed text-ink-light animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              Therapeutic massage, prenatal care, and small-batch botanicals — from a
              studio that believes rest is the work, not the reward.
            </p>
            <div
              className="mt-10 flex flex-wrap items-center gap-4 animate-fade-up"
              style={{ animationDelay: "0.3s" }}
            >
              <Link href="/book" className="btn-primary">
                Book appointment
              </Link>
              <Link href="/services" className="btn-secondary">
                Explore services
              </Link>
            </div>

            <dl
              className="mt-16 grid grid-cols-3 gap-6 border-t border-cream-300 pt-8 animate-fade-up"
              style={{ animationDelay: "0.4s" }}
            >
              <div>
                <dt className="eyebrow">Therapists</dt>
                <dd className="mt-1 font-display text-3xl text-ink">5</dd>
              </div>
              <div>
                <dt className="eyebrow">Years caring</dt>
                <dd className="mt-1 font-display text-3xl text-ink">12</dd>
              </div>
              <div>
                <dt className="eyebrow">House blends</dt>
                <dd className="mt-1 font-display text-3xl text-ink">24</dd>
              </div>
            </dl>
          </div>

          <div className="relative lg:col-span-6">
            <div className="relative animate-fade-in">
              {/* Decorative leaf shape */}
              <div
                aria-hidden
                className="absolute -left-6 -top-6 h-72 w-72 rounded-full bg-sage-100 blur-3xl"
              />
              <div
                aria-hidden
                className="absolute -bottom-12 -right-12 h-80 w-80 rounded-full bg-tan-100 blur-3xl"
              />
              <div className="relative grid grid-cols-5 gap-4">
                <div className="col-span-3">
                  <div className="overflow-hidden rounded-[120px_24px_120px_24px] shadow-floathover">
                    <Image
                      src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=900&h=1200&fit=crop"
                      alt="Hands gently working on a client's shoulder during a massage"
                      width={900}
                      height={1200}
                      priority
                      className="h-[480px] w-full object-cover"
                    />
                  </div>
                </div>
                <div className="col-span-2 flex flex-col gap-4">
                  <div className="overflow-hidden rounded-[24px_80px_24px_80px] shadow-float">
                    <Image
                      src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop"
                      alt="Bowl of dried lavender beside an amber essential oil bottle"
                      width={600}
                      height={600}
                      className="h-56 w-full object-cover"
                    />
                  </div>
                  <div className="overflow-hidden rounded-[80px_24px_80px_24px] shadow-float">
                    <Image
                      src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&h=600&fit=crop"
                      alt="A candle and rolled towel on a side table in a serene treatment room"
                      width={600}
                      height={600}
                      className="h-56 w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative SVG leaf bottom */}
        <svg
          aria-hidden
          viewBox="0 0 1440 80"
          className="absolute bottom-0 left-0 right-0 text-cream-50"
          fill="currentColor"
        >
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" opacity="0.5" />
        </svg>
      </section>

      {/* PHILOSOPHY */}
      <section className="bg-cream-50 py-24">
        <div className="container-content">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-5">
              <p className="eyebrow">Our practice</p>
              <h2 className="display-h2 mt-3">
                Rooted, careful, and never in a hurry.
              </h2>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <p className="text-lg leading-relaxed text-ink-light">
                Founded by Adele Thaxton in 2013, Healing Hands began as a single
                table in a sun-warmed back room. Twelve years on, we are five
                therapists, a house line of botanicals called{" "}
                <em>Essentially Yours</em>, and a continuing-education program for
                fellow practitioners.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-ink-light">
                Every session is unhurried, every blend is hand-poured, every
                client is met where they are.
              </p>
              <Link
                href="/about"
                className="mt-8 inline-flex items-center gap-2 font-sans text-sm uppercase tracking-wider text-sage-700 hover:text-sage-800"
              >
                Meet the team →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED SERVICES */}
      <section className="py-24">
        <div className="container-content">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Services</p>
              <h2 className="display-h2 mt-3">A short list, done well.</h2>
            </div>
            <Link
              href="/services"
              className="hidden font-sans text-sm uppercase tracking-wider text-sage-700 hover:text-sage-800 md:inline"
            >
              View all →
            </Link>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {featured.map((s, i) => (
              <article
                key={s.id}
                className="float-card group relative flex h-full flex-col overflow-hidden p-0 animate-fade-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={s.image_url}
                    alt={`${s.name} treatment`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="eyebrow">{s.duration_minutes} min</p>
                  <h3 className="mt-2 font-display text-2xl">{s.name}</h3>
                  <p className="mt-2 flex-1 text-sm text-ink-light">
                    {s.description}
                  </p>
                  <div className="mt-6 flex items-center justify-between">
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
            ))}
          </div>
        </div>
      </section>

      {/* SHOP STRIP */}
      <section className="bg-sage-700 py-24 text-cream-50">
        <div className="container-content">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-6">
              <p className="eyebrow text-cream-200">Essentially Yours</p>
              <h2 className="display-h2 mt-3 text-cream-50">
                Take the studio home.
              </h2>
              <p className="mt-4 max-w-md text-cream-200">
                Hand-poured oils, balms, and candles — bottled in small batches at
                the studio in Middletown.
              </p>
              <Link
                href="/shop"
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-cream-200 px-6 py-3 font-sans text-sm uppercase tracking-wider text-cream-50 transition-colors hover:bg-cream-50 hover:text-sage-700"
              >
                Shop the line →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:col-span-6">
              {featuredProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/shop/${p.slug}`}
                  className="group block"
                >
                  <div className="overflow-hidden rounded-2xl bg-cream-100">
                    <div className="relative aspect-square">
                      <Image
                        src={p.image_url}
                        alt={p.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-cream-100">{p.name}</p>
                  <p className="text-xs text-cream-200">
                    {formatPrice(p.price_cents)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* OWNER QUOTE */}
      <section className="py-32">
        <div className="container-content max-w-4xl text-center">
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="mx-auto h-10 w-10 text-sage-300"
            fill="currentColor"
          >
            <path d="M9 7H5a2 2 0 00-2 2v6h6V9a2 2 0 00-2-2zm10 0h-4a2 2 0 00-2 2v6h6V9a2 2 0 00-2-2z" />
          </svg>
          <blockquote className="mt-6 font-display text-3xl leading-tight text-ink md:text-4xl">
            We don't fix you. You aren't broken. We make a quiet room and a careful
            hour, and trust the body to remember what it knows.
          </blockquote>
          <p className="mt-6 font-sans text-sm uppercase tracking-wider text-sage-700">
            — {adele?.display_name ?? "Adele Thaxton"}, Founder
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container-content pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-tan-300 p-12 text-center shadow-float md:p-20">
          <div
            aria-hidden
            className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-tan-100 opacity-60 blur-2xl"
          />
          <p className="eyebrow text-sage-700">Ready when you are</p>
          <h2 className="display-h2 mt-3 text-ink">
            An hour for yourself, this week.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ink-light">
            Open availability Tuesday through Saturday. Same-day bookings often
            possible — we hold a slot for you for ten minutes while you check out.
          </p>
          <Link href="/book" className="btn-primary mt-8">
            Book appointment
          </Link>
        </div>
      </section>
    </>
  );
}
