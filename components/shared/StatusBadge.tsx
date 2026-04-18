type BadgeVariant = "deficit" | "maintenance" | "surplus" | "info" | "success" | "warning";

interface StatusBadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  deficit: "bg-red/10 text-red border-red/20",
  maintenance: "bg-teal/10 text-teal border-teal/20",
  surplus: "bg-amber/10 text-amber border-amber/20",
  info: "bg-teal/10 text-teal border-teal/20",
  success: "bg-green/10 text-green border-green/20",
  warning: "bg-amber/10 text-amber border-amber/20",
};

export default function StatusBadge({
  variant = "info",
  children,
  className = "",
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-block font-mono text-[11px] uppercase tracking-[0.14em] px-2.5 py-1 rounded-full border ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
