"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Wordmark from "@/components/shared/Wordmark";
import GuestPill from "@/components/shared/GuestPill";
import { User, ChefHat } from "lucide-react";

const tabs = [
  { label: "PANTRY", href: "/pantry" },
  { label: "MEAL PREP", href: "/meal-prep/dossier" },
  { label: "JOURNAL", href: "/journal" },
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
      } catch { /* ignore parse errors */ }
    }
    countRecipes();
    // Re-check when navigating between pages
    window.addEventListener("storage", countRecipes);
    return () => window.removeEventListener("storage", countRecipes);
  }, [pathname]);

  return (
    <nav className="sticky top-0 z-50 h-[72px] flex items-center justify-between px-8 bg-bg-page/80 backdrop-blur-xl hairline-b">
      {/* Left: Wordmark */}
      <Link href="/" className="shrink-0">
        <Wordmark size="sm" />
      </Link>

      {/* Center: Tabs */}
      <div className="hidden md:flex items-center gap-1">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href || pathname.startsWith(tab.href.split("/")[1] ? `/${tab.href.split("/")[1]}` : tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] rounded-md transition-colors ${
                isActive
                  ? "text-teal bg-teal/8"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated/50"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] text-text-tertiary tracking-[0.1em]">
          <ChefHat className="w-3.5 h-3.5" />
          <span>{recipeCount} {recipeCount === 1 ? "recipe" : "recipes"}</span>
        </div>
        <button className="w-8 h-8 rounded-full bg-bg-card border border-border flex items-center justify-center hover:border-border-strong transition-colors">
          <User className="w-4 h-4 text-text-secondary" />
        </button>
        <GuestPill />
      </div>
    </nav>
  );
}
