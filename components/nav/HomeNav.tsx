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
      <span className="hidden md:block kicker text-[10px] text-text-tertiary">
        Issue Nº 001
      </span>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <button className="w-8 h-8 bg-bg-card/50 backdrop-blur border-[0.5px] border-[#6d7a73]/40 flex items-center justify-center hover:border-[#6d7a73]/70 transition-colors">
          <User className="w-4 h-4 text-text-secondary" />
        </button>
        <GuestPill />
      </div>
    </nav>
  );
}
