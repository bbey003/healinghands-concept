"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Overview", exact: true },
  { href: "/dashboard/bookings", label: "Bookings", exact: false },
  { href: "/dashboard/orders", label: "Orders", exact: false },
  { href: "/dashboard/profile", label: "Profile", exact: false },
];

export function DashboardShell({ children }: { children: ReactNode }): JSX.Element {
  const pathname = usePathname();
  return (
    <div className="container-content py-12">
      <div className="grid gap-8 lg:grid-cols-4">
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
        <div className="lg:col-span-3">{children}</div>
      </div>
    </div>
  );
}
