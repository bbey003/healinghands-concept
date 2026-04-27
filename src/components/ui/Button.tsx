"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps): JSX.Element {
  const base =
    "inline-flex items-center justify-center gap-2 font-sans font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-full";

  const variants = {
    primary: "bg-sage-700 text-cream-50 hover:bg-sage-800 shadow-soft",
    secondary:
      "border border-ink/20 bg-transparent text-ink hover:bg-cream-200",
    ghost: "bg-transparent text-ink hover:bg-cream-200",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  const sizes = {
    sm: "px-4 py-1.5 text-xs uppercase tracking-wider",
    md: "px-6 py-2.5 text-sm uppercase tracking-wider",
    lg: "px-8 py-3.5 text-sm uppercase tracking-wider",
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], fullWidth && "w-full", className)}
      disabled={disabled ?? loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
