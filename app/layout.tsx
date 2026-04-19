import type { Metadata } from "next";
import { inter, spaceGrotesk, fraunces } from "./fonts";
import MotionProvider from "@/components/MotionProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "RECEPIE — Intelligent Meal Design",
  description:
    "A dark-mode culinary atelier for home cooks. Generate AI-powered meal plans, match pantry ingredients to recipes, and master your nutrition.",
  keywords: ["meal prep", "recipes", "nutrition", "AI", "meal plan", "pantry"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${fraunces.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-bg-page text-text-primary font-sans">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
