import Link from "next/link";
import Wordmark from "@/components/shared/Wordmark";

const links = [
  { label: "Pantry", href: "/pantry" },
  { label: "Meal Prep", href: "/meal-prep/dossier" },
  { label: "Journal", href: "/journal" },
  { label: "Archive", href: "/meal-prep/archive" },
];

export default function AppFooter() {
  return (
    <footer className="mt-auto hairline-t bg-bg-deep">
      <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Zone 1: Brand */}
        <div>
          <Wordmark size="sm" />
          <p className="mt-3 text-xs text-text-tertiary leading-relaxed max-w-xs">
            Intelligent meal design for the discerning home cook.
          </p>
        </div>

        {/* Zone 2: Links */}
        <div className="flex flex-col gap-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary mb-2">
            Navigate
          </p>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Zone 3: Meta */}
        <div className="flex flex-col justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary mb-2">
              Issue Nº 001
            </p>
            <p className="text-xs text-text-tertiary">Guest mode · No data stored</p>
          </div>
          <p className="text-[10px] text-text-tertiary mt-6">
            © {new Date().getFullYear()} RECEPIE · All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
