"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  push: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }): JSX.Element {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counterRef = useRef(0);

  const push = useCallback((type: ToastType, message: string) => {
    const id = `toast-${++counterRef.current}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} item={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: string) => void;
}): JSX.Element {
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-sage-600 shrink-0" />,
    error: <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />,
    info: <Info className="h-5 w-5 text-blue-500 shrink-0" />,
  };

  const borders = {
    success: "border-sage-200",
    error: "border-red-200",
    info: "border-blue-200",
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-2xl border bg-white p-4 shadow-float animate-fade-up",
        borders[item.type],
      )}
      role="alert"
    >
      {icons[item.type]}
      <p className="flex-1 text-sm text-ink">{item.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(item.id)}
        className="text-ink-subtle hover:text-ink"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
