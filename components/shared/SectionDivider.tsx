interface SectionDividerProps {
  glyph?: string;
  className?: string;
}

export default function SectionDivider({ glyph, className = "" }: SectionDividerProps) {
  return (
    <div className={`flex items-center gap-4 my-10 ${className}`}>
      <div className="flex-1 h-px bg-border" />
      {glyph && (
        <span className="text-text-tertiary text-xs font-mono tracking-widest">
          {glyph}
        </span>
      )}
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}
