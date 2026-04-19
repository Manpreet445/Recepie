import Link from "next/link";
import HomeNav from "@/components/nav/HomeNav";
import MarketingFooter from "@/components/footer/MarketingFooter";
import { ChefHat, Leaf, ArrowRight, BookOpen } from "lucide-react";

const SEASONAL = ["Fig", "Sage", "Pumpkin", "Quince", "Walnut", "Chestnut"];

export default function HomePage() {
  return (
    <>
      <HomeNav />

      <main className="max-w-7xl mx-auto px-8 pt-32 pb-20">

        {/* ── I. Hero ─────────────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-32 items-start">

          <div className="lg:col-span-7 flex flex-col pt-12">
            <span className="kicker text-sm text-text-tertiary mb-8">I. THE ATELIER</span>
            <h1 className="font-headline text-5xl md:text-[76px] leading-[0.95] tracking-tight mb-8">
              Curate your<br />culinary space.
            </h1>
            <p className="font-body text-lg text-text-secondary max-w-xl leading-relaxed">
              A digital gallery for the intentional cook. Archive, organize, and elevate
              your daily rituals through a lens of mindful preparation.
            </p>
          </div>

          <div className="lg:col-span-5 relative mt-12 lg:mt-0">
            <div className="bg-[#1a1a19] p-10 relative z-10 hairline-l hairline-b">
              <span className="kicker text-xs text-text-tertiary block mb-6">EDITOR&apos;S NOTE</span>
              <p className="font-headline italic text-2xl leading-snug mb-8 text-[#e6e6e6]">
                &ldquo;The act of cooking is not merely about sustenance, but the
                orchestration of time, texture, and memory. Here, we document
                those moments.&rdquo;
              </p>
              <div className="flex justify-between items-end">
                <span className="font-label text-sm uppercase tracking-widest text-text-tertiary">
                  14.10.25
                </span>
                <span className="font-headline text-lg italic opacity-80">E. Thorne</span>
              </div>
            </div>
            {/* Decorative asymmetric offset */}
            <div className="absolute inset-0 bg-[#222222] -translate-x-4 translate-y-4 z-0" />
          </div>

        </section>

        {/* ── II. Seasonal Strip ──────────────────────────────────────────── */}
        <section className="mb-32">
          <div className="flex items-center gap-6 mb-8">
            <span className="kicker text-sm text-text-tertiary whitespace-nowrap">IN SEASON</span>
            <div className="h-px flex-grow bg-[#6d7a73]/20" />
          </div>
          <div className="flex flex-wrap gap-4">
            {SEASONAL.map((item) => (
              <span
                key={item}
                className="kicker text-xs text-text-tertiary px-4 py-2 border-[0.5px] border-[#6d7a73]/40 hover:border-[#00694c]/60 hover:text-[#00694c] transition-colors cursor-default"
              >
                {item}
              </span>
            ))}
          </div>
        </section>

        {/* ── III. Selection Grid ─────────────────────────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">

          {/* Card 01 — Recipe Box */}
          <Link href="/meal-prep/dossier" className="group">
            <div className="bg-[#1a1a19] aspect-[4/3] p-10 flex flex-col justify-between hairline-b hairline-r relative overflow-hidden transition-colors hover:bg-[#1d1d1c]">
              <div className="flex justify-between items-start z-10">
                <span className="font-label text-2xl text-text-tertiary">01</span>
                <div className="w-12 h-12 flex items-center justify-center bg-[#00694c]/10">
                  <ChefHat className="w-5 h-5 text-[#00694c]" />
                </div>
              </div>
              <div className="z-10 mt-16">
                <h3 className="font-headline text-3xl mb-4 group-hover:text-[#00694c] transition-colors">
                  The Recipe Box
                </h3>
                <p className="font-body text-text-secondary mb-12 max-w-sm">
                  Your personal archive of culinary experiments, calibrated by
                  macros and organized by ritual.
                </p>
              </div>
              <div className="flex justify-between items-center pt-6 hairline-t z-10">
                <span className="kicker text-xs text-text-tertiary">MEAL PREP PROTOCOL</span>
                <ArrowRight className="w-4 h-4 text-text-tertiary group-hover:text-[#00694c] transition-colors" />
              </div>
            </div>
          </Link>

          {/* Card 02 — Mindful Pairings */}
          <Link href="/pantry" className="group">
            <div className="bg-[#1a1a19] aspect-[4/3] p-10 flex flex-col justify-between hairline-b hairline-r relative overflow-hidden transition-colors hover:bg-[#1d1d1c]">
              <div className="flex justify-between items-start z-10">
                <span className="font-label text-2xl text-text-tertiary">02</span>
                <div className="w-12 h-12 flex items-center justify-center bg-[#855400]/10">
                  <Leaf className="w-5 h-5 text-[#855400]" />
                </div>
              </div>
              <div className="z-10 mt-16">
                <h3 className="font-headline text-3xl mb-4 group-hover:text-[#855400] transition-colors">
                  Mindful Pairings
                </h3>
                <p className="font-body text-text-secondary mb-12 max-w-sm">
                  Tell us what you have. We match your pantry to recipes with
                  precision and seasonal intention.
                </p>
              </div>
              <div className="flex justify-between items-center pt-6 hairline-t z-10">
                <span className="kicker text-xs text-text-tertiary">PANTRY INVENTORY</span>
                <ArrowRight className="w-4 h-4 text-text-tertiary group-hover:text-[#855400] transition-colors" />
              </div>
            </div>
          </Link>

        </section>

        {/* ── IV. Journal Row ─────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-32">

          {/* Feature Spread (7/12) */}
          <div className="lg:col-span-7 bg-[#1a1a19] relative overflow-hidden hairline-b hairline-r">
            <div className="aspect-[16/9] bg-[#222222] relative flex items-end p-10">
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a19] via-[#1a1a19]/50 to-transparent" />
              <div className="relative z-10">
                <span className="kicker text-xs text-[#00694c] block mb-3">ISSUE Nº 001</span>
                <h3 className="font-headline text-3xl text-[#e6e6e6] leading-tight">
                  On the ritual of mise en place.
                </h3>
              </div>
            </div>
          </div>

          {/* Insight Quote (5/12) */}
          <div className="lg:col-span-5 bg-[#1a1a19] p-10 flex flex-col justify-between hairline-b">
            <div>
              <span className="kicker text-xs text-text-tertiary block mb-6">FROM THE ARCHIVE</span>
              <blockquote className="font-headline italic text-xl leading-snug text-[#e6e6e6]">
                &ldquo;Precision in preparation is the invisible ingredient in
                every great dish.&rdquo;
              </blockquote>
            </div>
            <div className="mt-8 pt-6 hairline-t flex items-center justify-between">
              <Link
                href="/journal"
                className="kicker text-xs text-[#00694c] hover:opacity-70 transition-opacity flex items-center gap-2"
              >
                READ THE JOURNAL
                <ArrowRight className="w-3 h-3" />
              </Link>
              <BookOpen className="w-4 h-4 text-text-tertiary opacity-40" />
            </div>
          </div>

        </section>

      </main>

      <MarketingFooter />
    </>
  );
}
