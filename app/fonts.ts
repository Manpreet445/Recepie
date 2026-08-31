import { Karla, JetBrains_Mono, Fraunces } from "next/font/google";

/**
 * Display face. Fraunces is a variable "soft serif" — its SOFT and WONK axes
 * give headings a hand-cut, appetising warmth that a neutral serif can't.
 */
export const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  // Loaded as a variable font so the SOFT/WONK axes stay addressable; an
  // explicit weight list would pin it to static cuts and drop them.
  axes: ["SOFT", "WONK", "opsz"],
});

/** Body face. Humanist grotesque — rounder and friendlier than Inter. */
export const karla = Karla({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-karla",
  weight: ["300", "400", "500", "600", "700"],
});

/**
 * Data face. A true monospace with tabular figures, so macro counts and
 * ingredient quantities stay column-aligned and don't reflow as they change.
 */
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
  weight: ["400", "500", "600"],
});
