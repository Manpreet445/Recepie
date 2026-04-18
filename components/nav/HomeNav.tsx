"use client";

import Link from "next/link";
import Wordmark from "@/components/shared/Wordmark";
import GuestPill from "@/components/shared/GuestPill";
import { User } from "lucide-react";

export default function HomeNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center justify-between px-8 bg-transparent">
      {/* Left: Wordmark */}
      <Link href="/">
        <Wordmark size="sm" />
      </Link>

      {/* Center: Issue marker */}
      <span className="hidden md:block font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
        Issue Nº 001
      </span>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <button className="w-8 h-8 rounded-full bg-bg-card/50 backdrop-blur border border-border flex items-center justify-center hover:border-border-strong transition-colors">
          <User className="w-4 h-4 text-text-secondary" />
        </button>
        <GuestPill />
      </div>
    </nav>
  );
}
