"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Wordmark from "@/components/shared/Wordmark";

/**
 * Marketing nav. Transparent over the hero, then settles onto a parchment bar
 * once the page scrolls so the wordmark keeps its contrast.
 */
export default function HomeNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-line bg-paper/85 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-4 md:px-8"
      >
        <Link href="/" className="shrink-0 rounded-sm">
          <Wordmark size="sm" />
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/pantry"
            className="kicker hidden min-h-11 items-center rounded-pill px-4 text-[11px] text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink sm:inline-flex"
          >
            Pantry
          </Link>
          <Link
            href="/meal-prep/dossier"
            className="kicker inline-flex min-h-11 items-center rounded-pill bg-terracotta px-5 text-[11px] text-white transition-colors hover:bg-terracotta-deep"
          >
            Plan a week
          </Link>
        </div>
      </nav>
    </header>
  );
}
