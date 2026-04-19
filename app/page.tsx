"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import HomeNav from "@/components/nav/HomeNav";
import MarketingFooter from "@/components/footer/MarketingFooter";
import { ChefHat, Leaf, ArrowRight, BookOpen } from "lucide-react";

const SEASONAL = ["Fig", "Sage", "Pumpkin", "Quince", "Walnut", "Chestnut"];

const SPRING = { type: "spring", stiffness: 300, damping: 30 } as const;

const cardImgVariants = {
  rest: { opacity: 0, scale: 1.05 },
  hover: { opacity: 0.15, scale: 1 },
};

export default function HomePage() {
  return (
    <>
      <HomeNav />

      <main className="max-w-7xl mx-auto px-8 pt-32 pb-20">

        {/* ── I. Hero ───────────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-32 items-start">

          <motion.div
            className="lg:col-span-7 flex flex-col pt-12"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          >
            <span className="kicker text-sm text-text-tertiary mb-8">I. THE ATELIER</span>
            <h1 className="font-headline text-5xl md:text-[76px] leading-[0.95] tracking-tight mb-8">
              Curate your<br />culinary space.
            </h1>
            <p className="font-body text-lg text-text-secondary max-w-xl leading-relaxed">
              A digital gallery for the intentional cook. Archive, organize, and elevate
              your daily rituals through a lens of mindful preparation.
            </p>
          </motion.div>

          <motion.div
            className="lg:col-span-5 relative mt-12 lg:mt-0"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          >
            {/* Editor's note — spring diagonal offset + faint image on hover */}
            <motion.div
              initial="rest"
              whileHover="hover"
              animate="rest"
              variants={{
                rest: { x: 0, y: 0 },
                hover: { x: -4, y: -4 },
              }}
              transition={SPRING}
              className="bg-[#1a1a19] p-10 relative z-10 hairline-l hairline-b overflow-hidden"
            >
              <motion.div
                variants={{ rest: { opacity: 0 }, hover: { opacity: 0.07 } }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0 z-0"
              >
                <Image
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800&auto=format&fit=crop"
                  fill
                  className="object-cover"
                  alt=""
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </motion.div>
              <div className="relative z-10">
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
            </motion.div>
            {/* Decorative asymmetric offset */}
            <div className="absolute inset-0 bg-[#222222] -translate-x-4 translate-y-4 z-0" />
          </motion.div>

        </section>

        {/* ── II. Seasonal Strip ────────────────────────────────────────── */}
        <motion.section
          className="mb-32"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.45 }}
        >
          <div className="flex items-center gap-6 mb-8">
            <span className="kicker text-sm text-text-tertiary whitespace-nowrap">IN SEASON</span>
            <div className="h-px flex-grow bg-[#6d7a73]/20" />
          </div>
          <div className="flex flex-wrap gap-4">
            {SEASONAL.map((item, i) => (
              <motion.span
                key={item}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 + i * 0.06 }}
                whileHover={{ scale: 1.05, transition: SPRING }}
                className="kicker text-xs text-text-tertiary px-4 py-2 border-[0.5px] border-[#6d7a73]/40 hover:border-[#00694c]/60 hover:text-[#00694c] transition-colors cursor-default"
              >
                {item}
              </motion.span>
            ))}
          </div>
        </motion.section>

        {/* ── III. Selection Grid ───────────────────────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">

          {/* Card 01 — Recipe Box */}
          <Link href="/meal-prep/dossier" className="group">
            <motion.div
              initial="rest"
              whileHover="hover"
              animate="rest"
              className="bg-[#1a1a19] aspect-[4/3] p-10 flex flex-col justify-between hairline-b hairline-r relative overflow-hidden"
            >
              <motion.div
                variants={cardImgVariants}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute inset-0 z-0"
              >
                <Image
                  src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=800&auto=format&fit=crop"
                  fill
                  className="object-cover"
                  alt=""
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </motion.div>

              <div className="flex justify-between items-start z-10 relative">
                <span className="font-label text-2xl text-text-tertiary">01</span>
                <div className="w-12 h-12 flex items-center justify-center bg-[#00694c]/10">
                  <ChefHat className="w-5 h-5 text-[#00694c]" />
                </div>
              </div>
              <div className="z-10 relative mt-16">
                <h3 className="font-headline text-3xl mb-4 group-hover:text-[#00694c] transition-colors duration-300">
                  The Recipe Box
                </h3>
                <p className="font-body text-text-secondary mb-12 max-w-sm">
                  Your personal archive of culinary experiments, calibrated by
                  macros and organized by ritual.
                </p>
              </div>
              <div className="flex justify-between items-center pt-6 hairline-t z-10 relative">
                <span className="kicker text-xs text-text-tertiary">MEAL PREP PROTOCOL</span>
                <ArrowRight className="w-4 h-4 text-text-tertiary group-hover:text-[#00694c] transition-colors duration-300" />
              </div>
            </motion.div>
          </Link>

          {/* Card 02 — Mindful Pairings */}
          <Link href="/pantry" className="group">
            <motion.div
              initial="rest"
              whileHover="hover"
              animate="rest"
              className="bg-[#1a1a19] aspect-[4/3] p-10 flex flex-col justify-between hairline-b hairline-r relative overflow-hidden"
            >
              <motion.div
                variants={cardImgVariants}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute inset-0 z-0"
              >
                <Image
                  src="https://images.unsplash.com/photo-1505935428862-770b6f24f629?q=80&w=800&auto=format&fit=crop"
                  fill
                  className="object-cover"
                  alt=""
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </motion.div>

              <div className="flex justify-between items-start z-10 relative">
                <span className="font-label text-2xl text-text-tertiary">02</span>
                <div className="w-12 h-12 flex items-center justify-center bg-[#855400]/10">
                  <Leaf className="w-5 h-5 text-[#855400]" />
                </div>
              </div>
              <div className="z-10 relative mt-16">
                <h3 className="font-headline text-3xl mb-4 group-hover:text-[#855400] transition-colors duration-300">
                  Mindful Pairings
                </h3>
                <p className="font-body text-text-secondary mb-12 max-w-sm">
                  Tell us what you have. We match your pantry to recipes with
                  precision and seasonal intention.
                </p>
              </div>
              <div className="flex justify-between items-center pt-6 hairline-t z-10 relative">
                <span className="kicker text-xs text-text-tertiary">PANTRY INVENTORY</span>
                <ArrowRight className="w-4 h-4 text-text-tertiary group-hover:text-[#855400] transition-colors duration-300" />
              </div>
            </motion.div>
          </Link>

        </section>

        {/* ── IV. Journal Row ───────────────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-32">

          {/* Feature Spread (7/12) */}
          <motion.div
            initial="rest"
            whileHover="hover"
            animate="rest"
            className="lg:col-span-7 bg-[#1a1a19] relative overflow-hidden hairline-b hairline-r"
          >
            <div className="aspect-[16/9] relative flex items-end p-10">
              {/* Bg image — 40% base, 60% hover, slow scale */}
              <motion.div
                variants={{
                  rest: { opacity: 0.4, scale: 1 },
                  hover: { opacity: 0.6, scale: 1.05 },
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0 z-0"
              >
                <Image
                  src="https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=1200&auto=format&fit=crop"
                  fill
                  className="object-cover"
                  alt=""
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
              </motion.div>
              {/* Readability scrim */}
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#151514] via-[#151514]/80 to-transparent" />
              {/* Text */}
              <div className="relative z-20">
                <span className="kicker text-xs text-[#00694c] block mb-3">ISSUE Nº 001</span>
                <h3 className="font-headline text-3xl text-[#e6e6e6] leading-tight">
                  On the ritual of mise en place.
                </h3>
              </div>
            </div>
          </motion.div>

          {/* Insight Quote (5/12) */}
          <motion.div
            initial="rest"
            whileHover="hover"
            animate="rest"
            className="lg:col-span-5 bg-[#1a1a19] relative overflow-hidden hairline-b"
          >
            {/* Bg image — 20% base, 40% hover */}
            <motion.div
              variants={{
                rest: { opacity: 0.2, scale: 1 },
                hover: { opacity: 0.4, scale: 1.05 },
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0 z-0"
            >
              <Image
                src="https://images.unsplash.com/photo-1596450514735-a13dd1118228?q=80&w=800&auto=format&fit=crop"
                fill
                className="object-cover"
                alt=""
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
            </motion.div>
            {/* Readability scrim */}
            <div className="absolute inset-0 z-10 bg-gradient-to-br from-[#151514] via-[#151514]/90 to-[#151514]/70" />
            {/* Content */}
            <div className="relative z-20 p-10 flex flex-col justify-between" style={{ minHeight: "100%" }}>
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
          </motion.div>

        </section>

      </main>

      <MarketingFooter />
    </>
  );
}
