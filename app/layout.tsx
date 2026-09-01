import type { Metadata } from "next";
import { karla, jetbrainsMono, fraunces } from "./fonts";
import MotionProvider from "@/components/MotionProvider";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "RECEPIE — Cook what you already have",
  description:
    "Plan a week of real food in minutes. Match what is already in your pantry to recipes, generate AI meal plans, and shop from one consolidated list.",
  keywords: ["meal prep", "recipes", "nutrition", "AI", "meal plan", "pantry"],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fffbeb" },
    { media: "(prefers-color-scheme: dark)", color: "#16100c" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // The theme script stamps data-theme before React hydrates.
      suppressHydrationWarning
      className={`${karla.variable} ${jetbrainsMono.variable} ${fraunces.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-dvh flex flex-col bg-paper text-ink font-text"
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-pill focus:bg-terracotta focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-on-terracotta"
        >
          Skip to content
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
