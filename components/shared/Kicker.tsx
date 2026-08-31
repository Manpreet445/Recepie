interface KickerProps {
  numeral?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Section eyebrow. The optional numeral keeps the editorial chapter-marker
 * rhythm of the old design, now in terracotta on parchment.
 */
export default function Kicker({ numeral, children, className = "" }: KickerProps) {
  return (
    <p className={`kicker flex items-center gap-2.5 text-[11px] text-terracotta ${className}`}>
      {numeral && (
        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-xs bg-terracotta-wash px-1.5 text-[10px] text-terracotta-deep">
          {numeral}
        </span>
      )}
      <span>{children}</span>
      <span aria-hidden="true" className="h-px flex-1 bg-line" />
    </p>
  );
}
