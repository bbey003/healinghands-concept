import Link from "next/link";

const year = new Date().getFullYear();

export function Footer(): JSX.Element {
  return (
    <footer className="border-t border-cream-200 bg-cream-100 py-12">
      <div className="container-content grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-xl text-ink">Healing Hands Spa</p>
          <p className="mt-2 text-sm text-ink-light">
            327 Main Street · Middletown, DE 19709
          </p>
          <p className="text-sm text-ink-light">(302) 555-0139</p>
          <p className="text-sm text-ink-light">Tuesday–Saturday · 9 am – 6 pm</p>
        </div>

        <div>
          <p className="eyebrow mb-3">Studio</p>
          <ul className="space-y-2 text-sm text-ink-light">
            <li><Link href="/services" className="hover:text-ink">Services</Link></li>
            <li><Link href="/shop" className="hover:text-ink">Shop</Link></li>
            <li><Link href="/about" className="hover:text-ink">About</Link></li>
            <li><Link href="/contact" className="hover:text-ink">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-3">Account</p>
          <ul className="space-y-2 text-sm text-ink-light">
            <li><Link href="/book" className="hover:text-ink">Book appointment</Link></li>
            <li><Link href="/dashboard" className="hover:text-ink">Dashboard</Link></li>
            <li><Link href="/privacy" className="hover:text-ink">Privacy policy</Link></li>
            <li><Link href="/terms" className="hover:text-ink">Terms of service</Link></li>
          </ul>
        </div>
      </div>

      <div className="container-content mt-10 border-t border-cream-200 pt-6">
        <p className="text-xs text-ink-subtle">
          © {year} Healing Hands Spa LLC · Middletown, Delaware. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
