"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Wordmark from "@/components/shared/Wordmark";
import GuestPill from "@/components/shared/GuestPill";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { User, ChefHat } from "lucide-react";

const tabs = [
  { label: "Pantry", href: "/pantry", match: "/pantry" },
  { label: "Meal Prep", href: "/meal-prep/dossier", match: "/meal-prep" },
  { label: "Journal", href: "/journal", match: "/journal" },
];

export default function AppNav() {
  const pathname = usePathname();
  const [recipeCount, setRecipeCount] = useState(0);

  // Count recipes from the latest generated plan stored in sessionStorage
  useEffect(() => {
    function countRecipes() {
      try {
        const raw = sessionStorage.getItem("latest_plan");
        if (!raw) return;
        const plan = JSON.parse(raw);
        if (plan?.days) {
          const total = plan.days.reduce(
            (sum: number, day: { meals?: unknown[] }) => sum + (day.meals?.length ?? 0),
            0
          );
          setRecipeCount(total);
        }
      } catch {
        /* ignore parse errors */
      }
    }
    countRecipes();
    // Re-check when navigating between pages
    window.addEventListener("storage", countRecipes);
    return () => window.removeEventListener("storage", countRecipes);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-xl">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-4 md:px-8"
      >
        <Link href="/" className="shrink-0 rounded-sm">
          <Wordmark size="sm" />
        </Link>

        {/* Desktop tabs */}
        <ul className="hidden items-center gap-1 md:flex">
          {tabs.map((tab) => {
            const isActive = pathname === tab.match || pathname.startsWith(`${tab.match}/`);
            return (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`kicker relative flex min-h-11 items-center rounded-pill px-4 text-[11px] transition-colors ${
                    isActive
                      ? "bg-terracotta-wash text-terracotta"
                      : "text-ink-soft hover:bg-surface-muted hover:text-ink"
                  }`}
                >
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {recipeCount > 0 && (
            <span className="numeric hidden items-center gap-1.5 rounded-pill bg-herb-wash px-3 py-1.5 text-[11px] text-herb-ink sm:inline-flex">
              <ChefHat aria-hidden="true" className="h-3.5 w-3.5" />
              {recipeCount} {recipeCount === 1 ? "recipe" : "recipes"}
            </span>
          )}
          <GuestPill className="hidden sm:inline-flex" />
          <ThemeToggle />
          <button
            type="button"
            aria-label="Account"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-pill border border-line bg-surface text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
          >
            <User aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </nav>

      {/* Mobile tabs — kept visible rather than hidden behind a menu, so the
          primary sections stay reachable on small screens. */}
      <nav aria-label="Sections" className="border-t border-line md:hidden">
        <ul className="mx-auto flex max-w-7xl">
          {tabs.map((tab) => {
            const isActive = pathname === tab.match || pathname.startsWith(`${tab.match}/`);
            return (
              <li key={tab.href} className="flex-1">
                <Link
                  href={tab.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`kicker flex min-h-12 items-center justify-center border-b-2 px-2 text-[10px] transition-colors ${
                    isActive
                      ? "border-terracotta text-terracotta"
                      : "border-transparent text-ink-faint"
                  }`}
                >
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
