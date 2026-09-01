"use client";

import { useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { THEME_STORAGE_KEY } from "@/lib/theme";

/**
 * Light/dark switch.
 *
 * The DOM attribute is the single source of truth — there is no React state
 * mirroring it, so the server and client render identical markup and the icon
 * never flashes the wrong way on hydration. Which icon and which accessible
 * label are exposed is decided in CSS from `data-theme`.
 *
 * With nothing stored, the app follows the operating system and keeps
 * following it live. Clicking makes the choice explicit and stops the
 * following, which is what a person expects after overriding it by hand.
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    const onChange = () => {
      try {
        // An explicit choice outranks the system preference.
        if (localStorage.getItem(THEME_STORAGE_KEY)) return;
      } catch {
        /* storage unavailable — fall through and follow the system */
      }
      document.documentElement.setAttribute("data-theme", mq.matches ? "dark" : "light");
    };

    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* private mode — the theme still applies for this page view */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-pill border border-line bg-surface text-ink-soft transition-colors hover:border-line-strong hover:text-ink ${className}`}
    >
      <Moon aria-hidden="true" className="theme-when-light h-4 w-4" />
      <Sun aria-hidden="true" className="theme-when-dark h-4 w-4" />
      <span className="theme-when-light sr-only">Switch to dark theme</span>
      <span className="theme-when-dark sr-only">Switch to light theme</span>
    </button>
  );
}
