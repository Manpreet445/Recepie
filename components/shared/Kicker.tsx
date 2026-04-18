interface KickerProps {
  numeral?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Kicker({ numeral, children, className = "" }: KickerProps) {
  return (
    <p
      className={`font-mono text-xs uppercase tracking-[0.2em] text-teal ${className}`}
    >
      {numeral && <span className="mr-2 text-text-tertiary">{numeral}.</span>}
      {children}
    </p>
  );
}
