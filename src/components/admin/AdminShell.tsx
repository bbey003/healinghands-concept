"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/users", label: "Users", exact: false },
  { href: "/admin/bookings", label: "Bookings", exact: false },
  { href: "/admin/audit", label: "Audit log", exact: false },
];

export function AdminShell({ children }: { children: ReactNode }): JSX.Element {
  const pathname = usePathname();
  return (
    <div className="container-content py-12">
      <div className="mb-8 flex items-center gap-3">
        <span className="rounded-full bg-tan-300 px-3 py-1 text-xs uppercase tracking-wider text-white">
          Admin
        </span>
        <h1 className="font-display text-2xl">Admin Panel</h1>
      </div>
      <div className="grid gap-8 lg:grid-cols-5">
        <aside>
          <nav className="flex flex-col gap-1">
            {links.map((l) => {
              const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "rounded-xl px-4 py-2.5 font-sans text-sm transition-colors",
                    active
                      ? "bg-sage-100 text-sage-700 font-medium"
                      : "text-ink-light hover:bg-cream-200 hover:text-ink",
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="lg:col-span-4">{children}</div>
      </div>
    </div>
  );
}
