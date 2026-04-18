"use client";

import { Loader2, AlertCircle, RefreshCw, Inbox } from "lucide-react";

// loading spinner or skeleton cards
interface LoadingStateProps {
  variant?: "spinner" | "skeleton";
  message?: string;
  className?: string;
}

export function LoadingState({
  variant = "spinner",
  message = "Preparing your mise en place…",
  className = "",
}: LoadingStateProps) {
  if (variant === "skeleton") {
    return (
      <div className={`space-y-4 animate-pulse ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-bg-card rounded-lg h-28 border border-border" />
        ))}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center py-20 ${className}`}>
      <Loader2 className="w-8 h-8 text-teal animate-spin mb-4" />
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-text-secondary">
        {message}
      </p>
    </div>
  );
}

// shown when there's no content yet
interface EmptyStateProps {
  title?: string;
  message?: string;
  className?: string;
}

export function EmptyState({
  title = "Nothing here yet",
  message = "Your culinary journey awaits. Begin by exploring a new recipe or creating a meal plan.",
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-20 text-center ${className}`}>
      <div className="w-14 h-14 rounded-full bg-bg-card border border-border flex items-center justify-center mb-5">
        <Inbox className="w-6 h-6 text-text-tertiary" />
      </div>
      <h3 className="font-serif text-xl text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary max-w-sm">{message}</p>
    </div>
  );
}

// error state with optional retry button
interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  message = "Something went wrong. Our kitchen encountered an unexpected error.",
  onRetry,
  className = "",
}: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-20 text-center ${className}`}>
      <div className="w-14 h-14 rounded-full bg-red/10 border border-red/20 flex items-center justify-center mb-5">
        <AlertCircle className="w-6 h-6 text-red" />
      </div>
      <h3 className="font-serif text-xl text-text-primary mb-2">An error occurred</h3>
      <p className="text-sm text-text-secondary max-w-sm mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-teal hover:text-teal-subtle transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Try again
        </button>
      )}
    </div>
  );
}
