export default function GuestPill({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block font-sans font-medium text-[11px] tracking-[0.14em] uppercase px-3 py-1 rounded-full border border-border-strong text-text-secondary ${className}`}
    >
      GUEST
    </span>
  );
}
