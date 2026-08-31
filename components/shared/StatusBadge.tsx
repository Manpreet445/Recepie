type BadgeVariant =
  | "deficit"
  | "maintenance"
  | "surplus"
  | "info"
  | "success"
  | "warning";

interface StatusBadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

/**
 * Status pill. Each variant pairs a wash with a text-contrast-safe ink and a
 * leading dot, so the state never rests on hue alone.
 */
const variants: Record<BadgeVariant, { classes: string; dot: string }> = {
  deficit: { classes: "bg-danger-wash text-danger", dot: "bg-danger" },
  maintenance: { classes: "bg-herb-wash text-herb-ink", dot: "bg-herb" },
  surplus: { classes: "bg-ember-wash text-ember-ink", dot: "bg-ember" },
  info: { classes: "bg-terracotta-wash text-terracotta", dot: "bg-terracotta" },
  success: { classes: "bg-success-wash text-success", dot: "bg-success" },
  warning: { classes: "bg-warning-wash text-warning", dot: "bg-warning" },
};

export default function StatusBadge({
  variant = "info",
  children,
  className = "",
}: StatusBadgeProps) {
  const v = variants[variant];

  return (
    <span
      className={`kicker inline-flex items-center gap-2 rounded-pill px-3 py-1.5 text-[10px] ${v.classes} ${className}`}
    >
      <span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 rounded-pill ${v.dot}`} />
      {children}
    </span>
  );
}
