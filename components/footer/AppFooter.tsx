import Link from "next/link";
import Wordmark from "@/components/shared/Wordmark";

const links = [
  { label: "Pantry", href: "/pantry" },
  { label: "Meal Prep", href: "/meal-prep/dossier" },
  { label: "Market List", href: "/meal-prep/market-list" },
  { label: "Archive", href: "/meal-prep/archive" },
  { label: "Journal", href: "/journal" },
];

export default function AppFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-paper-deep">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-3 md:px-8">
        <div>
          <Wordmark size="sm" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
            Plan a week of real food around what is already on your shelf.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="kicker mb-4 text-[10px] text-ink-faint">Navigate</h2>
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-9 items-center text-sm text-ink-soft transition-colors hover:text-terracotta"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col justify-between gap-6">
          <div>
            <h2 className="kicker mb-4 text-[10px] text-ink-faint">Session</h2>
            <p className="text-sm text-ink-soft">
              Guest mode — plans live in this browser tab only.
            </p>
          </div>
          <p className="numeric text-[11px] text-ink-faint">
            © {new Date().getFullYear()} Recepie
          </p>
        </div>
      </div>
    </footer>
  );
}
