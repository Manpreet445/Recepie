"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { mockRecipes } from "@/lib/mocks/data";
import { recipeImage } from "@/lib/images";
import { Clock, ArrowLeft } from "lucide-react";

// ── Motion constants ───────────────────────────────────────────────────────
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.4, ease: EASE } },
};

// ── Data helpers ───────────────────────────────────────────────────────────
const SECTION_LABELS: Record<string, string> = {
  body:    "Proteins & Produce",
  base:    "Base & Grains",
  spice:   "Spice & Seasoning",
  liquid:  "Oils & Liquids",
  garnish: "Garnish & Herbs",
};
const SECTION_ORDER = ["body", "base", "spice", "liquid", "garnish"] as const;

// ── Page ───────────────────────────────────────────────────────────────────
export default function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const recipe = mockRecipes.find((r) => r.id === id);

  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001,
  });

  if (!recipe) notFound();

  const toggleItem = (key: string) =>
    setCheckedItems((prev) =>
      prev.includes(key) ? prev.filter((i) => i !== key) : [...prev, key]
    );

  const heroUrl = recipeImage(recipe.imageQuery, [1200, 820]);

  const ingredientGroups = recipe.ingredients.reduce(
    (acc, ing) => {
      if (!acc[ing.section]) acc[ing.section] = [];
      acc[ing.section].push(ing);
      return acc;
    },
    {} as Record<string, typeof recipe.ingredients>
  );

  return (
    <>
      {/* ── Amber ambient scrollbar ─────────────────────────────────── */}
      <motion.div
        style={{ scaleX, transformOrigin: "0%" }}
        className="fixed top-0 left-0 right-0 h-[1px] bg-[#EF9F27] z-[100] pointer-events-none"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1440px] mx-auto"
      >

        {/* ── Back ──────────────────────────────────────────────────── */}
        <motion.div variants={itemVariants} className="mb-12">
          <Link
            href="/pantry"
            className="inline-flex items-center gap-2 kicker text-[10px] text-text-tertiary hover:text-[#EF9F27] transition-colors duration-300"
          >
            <ArrowLeft className="w-3 h-3" />
            PANTRY / BACK
          </Link>
        </motion.div>

        {/* ── Hero: text left + image right ─────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-28 items-start">

          {/* Left — editorial text block */}
          <motion.div variants={itemVariants} className="lg:pt-4">
            <span className="kicker text-[10px] text-[#EF9F27] block mb-10">
              ISSUE 04 — PANTRY PAIRING
            </span>

            <h1 className="font-headline text-6xl md:text-7xl leading-[1.0] tracking-tight text-[#F2F0EA] mb-4">
              {recipe.title}
            </h1>

            {recipe.subtitle && (
              <p className="font-headline italic text-xl text-[#9C9A92] leading-snug mb-12">
                {recipe.subtitle}
              </p>
            )}

            {/* Meta row */}
            <div className="border-t-[0.5px] border-white/20 pt-8 mt-8 grid grid-cols-3 gap-8">
              <div>
                <span className="kicker text-[9px] text-[#9C9A92] block mb-2">
                  ACTIVE TIME
                </span>
                <span className="font-headline italic text-2xl text-[#F2F0EA]">
                  {recipe.prepMinutes}m
                </span>
              </div>
              <div>
                <span className="kicker text-[9px] text-[#9C9A92] block mb-2">
                  TOTAL TIME
                </span>
                <span className="font-headline italic text-2xl text-[#F2F0EA]">
                  {recipe.prepMinutes + recipe.cookMinutes}m
                </span>
              </div>
              <div>
                <span className="kicker text-[9px] text-[#9C9A92] block mb-2">
                  YIELD
                </span>
                <span className="font-headline italic text-2xl text-[#F2F0EA]">
                  {recipe.servings}&nbsp;srv
                </span>
              </div>
            </div>

            {/* Energy + macros */}
            <div className="border-t-[0.5px] border-white/20 pt-6 mt-6 flex gap-8 flex-wrap">
              {[
                { label: "ENERGY",  val: `${recipe.kcal} kcal` },
                { label: "PROTEIN", val: `${recipe.proteinG}g` },
                { label: "CARBS",   val: `${recipe.carbsG}g` },
                { label: "FAT",     val: `${recipe.fatG}g` },
              ].map((m) => (
                <div key={m.label}>
                  <span className="kicker text-[9px] text-[#9C9A92] block mb-1">
                    {m.label}
                  </span>
                  <span className="font-label text-sm text-[#F2F0EA]">{m.val}</span>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="mt-8 flex flex-wrap gap-2">
              {recipe.tags.map((tag) => (
                <span
                  key={tag}
                  className="kicker text-[9px] text-[#9C9A92] border-[0.5px] border-white/20 px-3 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right — cinematic image with offset shadow */}
          <motion.div variants={itemVariants} className="relative">
            {/* Decorative offset box */}
            <div className="absolute inset-0 bg-[#1a1a19] translate-x-4 translate-y-4 -z-10" />

            <div className="overflow-hidden h-[480px] md:h-[680px] relative z-10">
              <motion.img
                src={heroUrl}
                alt={recipe.imageAlt}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 2, ease: EASE }}
              />
              {/* Bottom readability scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#151514]/60 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>

        </section>

        {/* ── Manifest + Ritual ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">

          {/* ── The Manifest (sticky left) ─────────────────────────── */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-4 lg:sticky lg:top-32 self-start mb-16 lg:mb-0"
          >
            <div
              className="bg-[#1a1a19] p-8"
              style={{ borderLeft: "0.5px solid rgba(255,255,255,0.2)", borderTop: "0.5px solid rgba(255,255,255,0.2)" }}
            >
              <h2 className="font-headline text-3xl text-[#EF9F27] mb-2">
                The Manifest
              </h2>
              <p className="font-body text-xs text-[#9C9A92] mb-8 leading-relaxed">
                Tap to cross off as you cook.
              </p>

              <div className="space-y-7">
                {SECTION_ORDER.map((section) => {
                  const items = ingredientGroups[section];
                  if (!items?.length) return null;
                  return (
                    <div key={section}>
                      <p className="kicker text-[9px] text-[#9C9A92] pb-2 mb-2 border-b-[0.5px] border-white/10">
                        {SECTION_LABELS[section]}
                      </p>
                      <div className="space-y-0">
                        {items.map((ing) => {
                          const key = `${section}-${ing.name}`;
                          const checked = checkedItems.includes(key);
                          return (
                            <motion.div
                              key={ing.name}
                              role="button"
                              tabIndex={0}
                              onClick={() => toggleItem(key)}
                              onKeyDown={(e) => e.key === "Enter" && toggleItem(key)}
                              whileHover={{ x: 6, color: "#F2F0EA" }}
                              whileTap={{ scale: 0.98 }}
                              animate={{ opacity: checked ? 0.3 : 1 }}
                              transition={{ duration: 0.4, ease: "easeOut" }}
                              className="flex justify-between items-baseline gap-4 py-3 border-b-[0.5px] border-white/10 cursor-pointer group outline-none"
                            >
                              <span
                                className={`font-body text-sm transition-colors duration-200 ${
                                  checked
                                    ? "line-through text-[#9C9A92]"
                                    : "text-[#e6e6e6]"
                                }`}
                              >
                                {ing.name}
                              </span>
                              <span className="kicker text-[10px] text-[#9C9A92] shrink-0">
                                {ing.quantity}&nbsp;{ing.unit}
                              </span>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Progress counter */}
              <AnimatePresence>
                {checkedItems.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center justify-between mt-6 pt-4 border-t-[0.5px] border-white/20">
                      <span className="kicker text-[10px] text-[#EF9F27]">
                        {checkedItems.length}/{recipe.ingredients.length} PREPPED
                      </span>
                      <button
                        onClick={() => setCheckedItems([])}
                        className="kicker text-[10px] text-[#9C9A92] hover:text-[#F2F0EA] transition-colors cursor-pointer"
                      >
                        RESET
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ── The Ritual (right) ─────────────────────────────────── */}
          <div className="lg:col-span-8 lg:pl-20 space-y-0">
            <motion.span
              variants={itemVariants}
              className="kicker text-[10px] text-[#EF9F27] block mb-16"
            >
              THE RITUAL
            </motion.span>

            {recipe.ritual.map((step) => (
              <motion.div
                key={step.stepNumber}
                variants={itemVariants}
                className="flex gap-10 pb-16 border-b-[0.5px] border-white/10 last:border-b-0 last:pb-0 mb-16 last:mb-0"
              >
                {/* Magnetic number */}
                <motion.div
                  whileHover={{ x: 8, color: "#EF9F27" }}
                  transition={{ duration: 0.8, ease: EASE }}
                  className="shrink-0 pt-1"
                  style={{ color: "#2a2a28" }}
                >
                  <span className="font-headline text-7xl leading-none select-none">
                    {String(step.stepNumber).padStart(2, "0")}
                  </span>
                </motion.div>

                {/* Step content */}
                <div className="pt-3 flex-1">
                  <h3 className="font-headline text-2xl text-[#F2F0EA] mb-4 leading-tight">
                    {step.title}
                  </h3>
                  <p className="font-body text-lg text-[#9C9A92] leading-[1.8]">
                    {step.instruction}
                  </p>
                  {step.durationMinutes && (
                    <div className="flex items-center gap-2 mt-5">
                      <Clock className="w-3 h-3 text-[#EF9F27]" />
                      <span className="kicker text-[10px] text-[#9C9A92]">
                        {step.durationMinutes} MIN
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Curator's note */}
            {recipe.curatorNote && (
              <motion.div variants={itemVariants} className="mt-16 pt-16 border-t-[0.5px] border-white/10">
                <span className="kicker text-[10px] text-[#EF9F27] block mb-6">
                  CURATOR&apos;S NOTE
                </span>
                <div
                  className="bg-[#1a1a19] p-10"
                  style={{
                    border: "0.5px solid rgba(255,255,255,0.12)",
                    borderLeft: "2px solid #EF9F27",
                  }}
                >
                  <p className="font-headline italic text-2xl text-[#F2F0EA] leading-snug">
                    &ldquo;{recipe.curatorNote}&rdquo;
                  </p>
                </div>
              </motion.div>
            )}
          </div>

        </div>
      </motion.div>
    </>
  );
}
