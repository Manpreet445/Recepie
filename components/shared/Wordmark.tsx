interface WordmarkProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { text: "text-sm", mark: 22, gap: "gap-2" },
  md: { text: "text-lg", mark: 28, gap: "gap-2.5" },
  lg: { text: "text-2xl", mark: 36, gap: "gap-3" },
};

/**
 * Brand lockup: a terracotta tile carrying a herb sprig, set against the
 * wordmark in the display face. The sprig is decorative — the adjacent text
 * already names the brand — so it stays out of the accessibility tree.
 */
export default function Wordmark({ size = "md", className = "" }: WordmarkProps) {
  const s = sizes[size];

  return (
    <span className={`inline-flex items-center ${s.gap} ${className}`}>
      <svg
        width={s.mark}
        height={s.mark}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="text-terracotta shrink-0"
      >
        <rect width="24" height="24" rx="7" fill="currentColor" />
        <path
          d="M12 18.5V10"
          stroke="var(--paper)"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M12 13.2c0-2.6 2-4.5 4.5-4.5 0 2.6-2 4.5-4.5 4.5Z"
          fill="var(--paper)"
        />
        <path
          d="M12 15.8c0-2.2-1.8-4-4-4 0 2.2 1.8 4 4 4Z"
          fill="var(--paper)"
          opacity="0.75"
        />
      </svg>
      <span
        className={`font-headline font-semibold tracking-[0.14em] text-ink ${s.text}`}
      >
        RECEPIE
      </span>
    </span>
  );
}
