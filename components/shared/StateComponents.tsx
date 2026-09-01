"use client";

import { AlertCircle, RefreshCw, UtensilsCrossed } from "lucide-react";

/* ── Loading ────────────────────────────────────────────────────────────── */

interface LoadingStateProps {
  variant?: "spinner" | "skeleton";
  message?: string;
  className?: string;
}

/**
 * Loading feedback. Both variants reserve layout space so nothing shifts when
 * the real content lands, and the status is announced politely rather than
 * stealing focus.
 */
export function LoadingState({
  variant = "spinner",
  message = "Setting out your mise en place…",
  className = "",
}: LoadingStateProps) {
  if (variant === "skeleton") {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-label={message}
        className={`space-y-4 ${className}`}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-md border border-line bg-surface-muted"
            style={{ animationDelay: `${i * 120}ms` }}
          />
        ))}
        <span className="sr-only">{message}</span>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center py-20 ${className}`}
    >
      {/* Three simmering dots — motion that reads as cooking, not buffering. */}
      <div aria-hidden="true" className="mb-5 flex items-end gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2.5 w-2.5 animate-bounce rounded-pill bg-terracotta"
            style={{ animationDelay: `${i * 140}ms`, animationDuration: "900ms" }}
          />
        ))}
      </div>
      <p className="kicker text-[11px] text-ink-soft">{message}</p>
    </div>
  );
}

/* ── Empty ──────────────────────────────────────────────────────────────── */

interface EmptyStateProps {
  title?: string;
  message?: string;
  className?: string;
}

export function EmptyState({
  title = "Nothing here yet",
  message = "Start by adding what is in your pantry, or generate a plan and this space will fill up.",
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-lg border border-dashed border-line-strong bg-surface-muted/60 px-6 py-16 text-center ${className}`}
    >
      <span
        aria-hidden="true"
        className="mb-5 flex h-14 w-14 items-center justify-center rounded-pill bg-terracotta-wash"
      >
        <UtensilsCrossed className="h-6 w-6 text-terracotta" />
      </span>
      <h3 className="mb-2 font-headline text-xl text-ink">{title}</h3>
      <p className="max-w-sm text-sm leading-relaxed text-ink-soft">{message}</p>
    </div>
  );
}

/* ── Error ──────────────────────────────────────────────────────────────── */

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

/** Failure state. Always names a recovery path rather than just the problem. */
export function ErrorState({
  message = "We could not finish that request. Your input was not lost — try again.",
  onRetry,
  className = "",
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center rounded-lg border border-danger/20 bg-danger-wash px-6 py-16 text-center ${className}`}
    >
      <span
        aria-hidden="true"
        className="mb-5 flex h-14 w-14 items-center justify-center rounded-pill bg-surface"
      >
        <AlertCircle className="h-6 w-6 text-danger" />
      </span>
      <h3 className="mb-2 font-headline text-xl text-ink">Something went wrong</h3>
      <p className="mb-6 max-w-sm text-sm leading-relaxed text-ink-soft">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="kicker inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-pill bg-terracotta px-5 text-[11px] text-on-terracotta transition-colors hover:bg-terracotta-deep"
        >
          <RefreshCw aria-hidden="true" className="h-3.5 w-3.5" />
          Try again
        </button>
      )}
    </div>
  );
}
