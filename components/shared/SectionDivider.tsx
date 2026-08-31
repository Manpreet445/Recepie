interface SectionDividerProps {
  glyph?: string;
  className?: string;
}

/** Rule between sections, optionally interrupted by a small centred glyph. */
export default function SectionDivider({ glyph, className = "" }: SectionDividerProps) {
  return (
    <div aria-hidden="true" className={`my-10 flex items-center gap-4 ${className}`}>
      <div className="h-px flex-1 bg-line" />
      {glyph && <span className="font-label text-[10px] text-line-strong">{glyph}</span>}
      <div className="h-px flex-1 bg-line" />
    </div>
  );
}
