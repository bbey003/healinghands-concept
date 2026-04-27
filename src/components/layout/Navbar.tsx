"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X, ShoppingBag, Bell, User } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useCart } from "@/components/CartProvider";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar(): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { count } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSignOut = async (): Promise<void> => {
    await signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-cream-200 bg-cream-50/90 backdrop-blur-md">
      <div className="container-content flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          className="font-display text-xl text-ink hover:text-sage-700 transition-colors"
        >
          Healing Hands
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "font-sans text-xs uppercase tracking-wider transition-colors",
                pathname.startsWith(l.href)
                  ? "text-sage-700"
                  : "text-ink-light hover:text-ink",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/book" className="btn-primary hidden md:inline-flex">
            Book
          </Link>

          <Link
            href="/cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-cream-200 transition-colors"
            aria-label={`Cart (${count} items)`}
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-sage-700 text-[10px] font-bold text-cream-50">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-100 hover:bg-sage-200 transition-colors"
                aria-label="Account menu"
              >
                {user.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatar_url}
                    alt={user.display_name}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5 text-sage-700" />
                )}
              </button>
              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setUserMenuOpen(false)}
                    aria-hidden
                  />
                  <div className="absolute right-0 z-20 mt-2 w-48 rounded-2xl border border-cream-200 bg-white shadow-float py-2">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm hover:bg-cream-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/bookings"
                      className="block px-4 py-2 text-sm hover:bg-cream-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      My bookings
                    </Link>
                    <Link
                      href="/dashboard/orders"
                      className="block px-4 py-2 text-sm hover:bg-cream-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      My orders
                    </Link>
                    {(user.role === "admin" || user.role === "moderator") && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm hover:bg-cream-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Admin panel
                      </Link>
                    )}
                    <hr className="my-1 border-cream-200" />
                    <button
                      type="button"
                      onClick={() => { setUserMenuOpen(false); void handleSignOut(); }}
                      className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-cream-100"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden font-sans text-xs uppercase tracking-wider text-ink-light hover:text-ink md:block"
            >
              Sign in
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-cream-200 md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-cream-200 bg-cream-50 px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-sans text-sm uppercase tracking-wider text-ink"
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/book"
              className="btn-primary mt-2 text-center"
              onClick={() => setMobileOpen(false)}
            >
              Book appointment
            </Link>
            {!user && (
              <Link
                href="/login"
                className="text-center font-sans text-sm text-ink-light"
                onClick={() => setMobileOpen(false)}
              >
                Sign in
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
