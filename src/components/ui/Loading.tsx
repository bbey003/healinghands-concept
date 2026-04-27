import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Spinner({ className, size = "md" }: SpinnerProps): JSX.Element {
  const sizes = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-10 w-10" };
  return (
    <svg
      className={cn("animate-spin text-sage-600", sizes[size], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

interface LoadingScreenProps {
  label?: string;
}

export function LoadingScreen({ label = "Loading…" }: LoadingScreenProps): JSX.Element {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <Spinner size="lg" />
      <p className="font-sans text-sm text-ink-subtle">{label}</p>
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps): JSX.Element {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
      <div className="h-16 w-16 rounded-full bg-cream-200 flex items-center justify-center">
        <span className="text-2xl">✦</span>
      </div>
      <div>
        <p className="font-display text-xl text-ink">{title}</p>
        {description && <p className="mt-1 text-sm text-ink-light">{description}</p>}
      </div>
      {action}
    </div>
  );
}
