"use client";

import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, className, id, ...props }: InputProps): JSX.Element {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block font-sans text-sm text-ink">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "w-full rounded-xl border border-cream-300 bg-white px-4 py-3 font-sans text-sm text-ink placeholder:text-ink-subtle focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-200 transition-colors",
          error && "border-red-400 focus:border-red-400 focus:ring-red-100",
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      {hint && !error && <p className="text-xs text-ink-subtle">{hint}</p>}
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Textarea({
  label,
  error,
  hint,
  className,
  id,
  ...props
}: TextareaProps): JSX.Element {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block font-sans text-sm text-ink">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={cn(
          "w-full rounded-xl border border-cream-300 bg-white px-4 py-3 font-sans text-sm text-ink placeholder:text-ink-subtle focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-200 transition-colors resize-y",
          error && "border-red-400 focus:border-red-400 focus:ring-red-100",
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      {hint && !error && <p className="text-xs text-ink-subtle">{hint}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: React.ReactNode;
}

export function Select({ label, error, className, id, children, ...props }: SelectProps): JSX.Element {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block font-sans text-sm text-ink">
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={cn(
          "w-full rounded-xl border border-cream-300 bg-white px-4 py-3 font-sans text-sm text-ink focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-200 transition-colors",
          error && "border-red-400",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
