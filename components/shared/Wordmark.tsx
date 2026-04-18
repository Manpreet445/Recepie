interface WordmarkProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Wordmark({ size = "md", className = "" }: WordmarkProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <span
      className={`inline-flex items-center font-sans font-medium tracking-[0.18em] ${sizeClasses[size]} ${className}`}
    >
      <span className="text-teal mr-1.5">●</span>
      <span className="text-text-primary">RECEPIE</span>
    </span>
  );
}
