"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, ArrowRight, Search } from "lucide-react";
import { mockRecipes } from "@/lib/mocks/data";

// ── Pantry enrichment data ─────────────────────────────────────────────────
// Extends mock recipes with taste profile fields for the hover-peek panel.
const PANTRY_META: Record<
  string,
  { mood: string; tasteProfile: string[]; manifest: string[] }
> = {
  r1: {
    mood: "An umami-deep bowl for focused evenings. Comfort without sedation.",
    tasteProfile: ["Umami", "Acidic", "Bright", "Sesame"],
    manifest: [
      "Salmon fillet — 300g",
      "White miso paste — 2 tbsp",
      "Soba noodles — 200g",
      "Sesame oil — 1 tbsp",
      "Radish — 4 pieces",
      "Rice vinegar — 2 tbsp",
    ],
  },
  r2: {
    mood: "A warming, fiery dish for cold nights that demand bold decisions.",
    tasteProfile: ["Spiced", "Smoky", "Creamy", "Tangy"],
    manifest: [
      "Chicken thighs — 800g",
      "Harissa paste — 3 tbsp",
      "Chickpeas — 400g",
      "Labneh — 150g",
      "Olive oil — 2 tbsp",
      "Cumin seeds — 1 tsp",
    ],
  },
  r3: {
    mood: "Vegetarian comfort that never apologises for its depth or colour.",
    tasteProfile: ["Smoky", "Bright", "Earthy", "Acidic"],
    manifest: [
      "Sweet potatoes — 500g",
      "Black beans — 400g",
      "Corn tortillas — 12 pieces",
      "Avocado — 2 whole",
      "Chipotle in adobo — 2 tbsp",
      "Lime — 2 whole",
    ],
  },
  r4: {
    mood: "Everyday excellence. Clean, precise, and deeply satisfying.",
    tasteProfile: ["Bright", "Herbaceous", "Clean", "Citrus"],
    manifest: [
      "Chicken breast — 400g",
      "Farro — 150g",
      "Broccolini — 200g",
      "Fresh thyme — 4 sprigs",
      "Garlic — 3 cloves",
      "Lemon — 2 whole",
    ],
  },
  r5: {
    mood: "A warming, unhurried dish for crisp autumn evenings.",
    tasteProfile: ["Warming", "Creamy", "Earthy", "Aromatic"],
    manifest: [
      "Red lentils — 250g",
      "Coconut milk — 400ml",
      "Basmati rice — 200g",
      "Turmeric — 1 tsp",
      "Garam masala — 1 tsp",
      "Fresh ginger — 2 cm",
    ],
  },
};

// ── Constants ──────────────────────────────────────────────────────────────
const SPRING = { type: "spring", stiffness: 300, damping: 30 } as const;

// ── MatchCard ──────────────────────────────────────────────────────────────
interface MatchCardProps {
  title: string;
  subtitle?: string;
  kcal: number;
  proteinG: number;
  matchedCount: number;
  totalCount: number;
  isPerfect: boolean;
  missingLabel: string | null;
  recipeId: string;
  mood: string;
  tasteProfile: string[];
  manifest: string[];
  index: number;
}

function MatchCard({
  title,
  subtitle,
  kcal,
  proteinG,
  matchedCount,
  totalCount,
  isPerfect,
  missingLabel,
  recipeId,
  mood,
  tasteProfile,
  manifest,
  index,
}: MatchCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.09 }}
    >
      <motion.article
        layout
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{
          backgroundColor: isHovered ? "#1d1d1c" : "#1a1a19",
          borderColor: isHovered ? "#EF9F27" : "rgba(255,255,255,0.2)",
        }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="relative overflow-hidden border-[0.5px] p-8 w-full cursor-pointer"
      >
        {/* Amber glow scrim */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute inset-0 bg-gradient-to-r from-[#EF9F27]/5 to-transparent pointer-events-none"
        />

        {/* ── Top grid ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-12 gap-6 items-center relative z-10">

          {/* Left — match status */}
          <div className="col-span-3">
            <span
              className={`kicker text-[10px] block mb-2 ${
                isPerfect ? "text-[#EF9F27]" : "text-text-tertiary"
              }`}
            >
              {isPerfect ? "PERFECT MATCH" : "PARTIAL MATCH"}
            </span>
            <span className="kicker text-base text-text-secondary leading-none">
              {matchedCount}/{totalCount}
            </span>
            <span className="kicker text-[10px] text-text-tertiary block mt-1">
              INGREDIENTS
            </span>
          </div>

          {/* Center — title + subtitle */}
          <div className="col-span-6">
            <h3 className="font-headline text-2xl text-[#e6e6e6] mb-1 leading-tight">
              {title}
            </h3>
            <p className="font-body italic text-sm text-text-secondary mb-3">
              {subtitle}
            </p>
            {!isPerfect && missingLabel && (
              <span className="kicker text-[10px] text-[#ba1a1a]">
                MISSING: {missingLabel}
              </span>
            )}
          </div>

          {/* Right — macros + CTA */}
          <div className="col-span-3 text-right">
            <p className="kicker text-xs text-text-tertiary mb-0.5">
              {kcal} KCAL
            </p>
            <p className="kicker text-[10px] text-text-tertiary mb-5">
              {proteinG}G PROTEIN
            </p>
            <Link
              href={`/recipe/${recipeId}`}
              className="inline-flex items-center gap-1.5 kicker text-xs text-[#EF9F27] hover:opacity-70 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              VIEW RECIPE
              <motion.span
                animate={{ x: isHovered ? 4 : 0 }}
                transition={SPRING}
              >
                <ArrowRight className="w-3 h-3" />
              </motion.span>
            </Link>
          </div>
        </div>

        {/* ── Hover-peek panel ─────────────────────────────────────────── */}
        <AnimatePresence initial={false}>
          {isHovered && (
            <motion.div
              key="peek"
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 24 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="overflow-hidden relative z-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t-[0.5px] border-white/10">

                {/* Column 1 — Vibe & Palate */}
                <div>
                  <span className="kicker text-[10px] text-[#EF9F27] block mb-4">
                    VIBE &amp; PALATE
                  </span>
                  <p className="font-headline italic text-base text-[#e6e6e6] leading-snug mb-4">
                    &ldquo;{mood}&rdquo;
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {tasteProfile.map((tag) => (
                      <span
                        key={tag}
                        className="border-[0.5px] border-white/20 px-2 py-1 kicker text-[11px] text-[#9C9A92]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Column 2 — The Manifest */}
                <div>
                  <span className="kicker text-[10px] text-[#EF9F27] block mb-4">
                    THE MANIFEST
                  </span>
                  <ul className="flex flex-col gap-2">
                    {manifest.map((item) => (
                      <li
                        key={item}
                        className="font-body text-[13px] text-[#9C9A92]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.article>
    </motion.div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function PantryPage() {
  const [inputValue, setInputValue] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const addIngredient = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !ingredients.includes(trimmed.toLowerCase())) {
      setIngredients((prev) => [...prev, trimmed.toLowerCase()]);
      setInputValue("");
    }
  };

  const removeIngredient = (ing: string) =>
    setIngredients((prev) => prev.filter((i) => i !== ing));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addIngredient();
    }
  };

  const results = React.useMemo(() => {
    if (!showResults || ingredients.length === 0) return [];
    return mockRecipes
      .map((recipe) => {
        const recipeIngNames = recipe.ingredients.map((i) => i.name.toLowerCase());
        const matched = ingredients.filter((i) =>
          recipeIngNames.some((ri) => ri.includes(i) || i.includes(ri))
        );
        const seed = recipe.id
          .split("")
          .reduce((acc, c) => acc + c.charCodeAt(0), 0);
        const fakeExtra = (seed % 3) + 1;
        const matchedCount = Math.min(
          Math.max(matched.length, fakeExtra),
          recipe.ingredients.length
        );
        const firstMissing = recipe.ingredients.find(
          (ri) =>
            !ingredients.some(
              (i) =>
                ri.name.toLowerCase().includes(i) ||
                i.includes(ri.name.toLowerCase())
            )
        );
        const meta = PANTRY_META[recipe.id] ?? {
          mood: recipe.curatorNote,
          tasteProfile: recipe.tags.map((t) => t.toUpperCase()),
          manifest: recipe.ingredients
            .slice(0, 6)
            .map((i) => `${i.name} — ${i.quantity} ${i.unit}`),
        };
        return {
          recipe,
          matchedCount,
          totalCount: recipe.ingredients.length,
          isPerfect: matchedCount >= recipe.ingredients.length,
          missingLabel: firstMissing?.name.toUpperCase() ?? null,
          ...meta,
        };
      })
      .sort((a, b) => b.matchedCount - a.matchedCount)
      .slice(0, 3);
  }, [showResults, ingredients]);

  return (
    <div className="max-w-4xl mx-auto">

      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto text-center mb-16 pt-8">
        <span className="kicker text-xs text-text-tertiary block mb-6">
          V. THE INVENTORY
        </span>
        <h1 className="font-headline text-5xl md:text-6xl leading-[0.95] tracking-tight mb-6">
          Cook with what<br />you have.
        </h1>
        <p className="font-body text-text-secondary leading-relaxed max-w-sm mx-auto">
          Add the ingredients on your shelf. The Curator will find
          what&apos;s possible.
        </p>
      </div>

      {/* ── Input Ledger ──────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto mb-4">
        <div className="relative flex items-center">
          <Search className="absolute left-0 w-4 h-4 text-text-tertiary pointer-events-none" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="garlic, chickpeas, olive oil..."
            className="w-full pl-7 pr-20 py-4 bg-transparent border-b-[0.5px] border-white/20 focus:border-[#EF9F27] focus:outline-none transition-colors text-text-primary placeholder:text-text-tertiary font-body text-lg text-center"
          />
          <span className="absolute right-0 kicker text-[10px] text-text-tertiary opacity-50 pointer-events-none">
            ↵ ENTER
          </span>
        </div>
      </div>

      {/* ── Ingredient Chips ──────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto mb-10 min-h-[44px]">
        <AnimatePresence initial={false}>
          {ingredients.length > 0 && (
            <motion.div
              className="flex flex-wrap justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {ingredients.map((ing) => (
                <motion.button
                  key={ing}
                  layout
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
                  whileHover={{ scale: 1.05, borderColor: "#ba1a1a" }}
                  transition={SPRING}
                  onClick={() => removeIngredient(ing)}
                  className="group inline-flex items-center gap-2 px-3 py-1.5 bg-[#1a1a19] border-[0.5px] border-white/20 kicker text-xs text-text-secondary hover:text-[#ba1a1a] transition-colors cursor-pointer"
                >
                  {ing}
                  <X className="w-3 h-3 text-text-tertiary group-hover:text-[#ba1a1a] transition-colors" />
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── CTA Row ───────────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto mb-20 flex items-center justify-between hairline-t pt-6">
        <span className="font-body text-sm text-text-tertiary">
          {ingredients.length === 0
            ? "Add at least one ingredient to begin."
            : `${ingredients.length} ingredient${ingredients.length !== 1 ? "s" : ""} in your ledger.`}
        </span>
        <motion.button
          onClick={() => ingredients.length > 0 && setShowResults(true)}
          disabled={ingredients.length === 0}
          initial="rest"
          whileHover="hover"
          animate="rest"
          className="flex items-center gap-2 kicker text-sm text-[#EF9F27] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          CONSULT THE CURATOR
          <motion.span
            variants={{ rest: { x: 0 }, hover: { x: 5, transition: SPRING } }}
          >
            <ArrowRight className="w-4 h-4" />
          </motion.span>
        </motion.button>
      </div>

      {/* ── Match Results ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showResults && results.length > 0 && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="flex items-center gap-6 mb-6">
              <span className="kicker text-xs text-text-tertiary whitespace-nowrap">
                {results.length} MATCHES FOUND
              </span>
              <div className="h-px flex-grow bg-white/10" />
              <button
                onClick={() => setShowResults(false)}
                className="kicker text-[10px] text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
              >
                CLEAR
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {results.map((result, i) => (
                <MatchCard
                  key={result.recipe.id}
                  index={i}
                  title={result.recipe.title}
                  subtitle={result.recipe.subtitle ?? ""}
                  kcal={result.recipe.kcal}
                  proteinG={result.recipe.proteinG}
                  matchedCount={result.matchedCount}
                  totalCount={result.totalCount}
                  isPerfect={result.isPerfect}
                  missingLabel={result.missingLabel}
                  recipeId={result.recipe.id}
                  mood={result.mood}
                  tasteProfile={result.tasteProfile}
                  manifest={result.manifest}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
