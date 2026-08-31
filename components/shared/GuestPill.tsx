export default function GuestPill({ className = "" }: { className?: string }) {
  return (
    <span
      className={`kicker inline-flex items-center rounded-pill border border-line-strong bg-surface px-3 py-1.5 text-[10px] text-ink-soft ${className}`}
    >
      Guest
    </span>
  );
}
