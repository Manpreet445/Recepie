"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { X, ArrowRight, Plus, ChevronDown, Search } from "lucide-react";
import { mockRecipes } from "@/lib/mocks/data";
import { EmptyState } from "@/components/shared/StateComponents";

// ── Pantry enrichment data ─────────────────────────────────────────────────
// Extends mock recipes with taste profile fields for the details panel.
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

/** Ideas offered when the shelf is still empty. */
const SUGGESTIONS = ["chickpeas", "chicken thigh", "lemon", "sweet potato", "red lentils"];

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
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const reduce = useReducedMotion();

  // Pointer users get the panel on hover; everyone gets an explicit toggle.
  const open = hovered || expanded;
  const panelId = `match-details-${recipeId}`;
  const ratio = Math.round((matchedCount / totalCount) * 100);

  return (
    <motion.article
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.07 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`card overflow-hidden transition-colors ${
        open ? "border-terracotta-edge shadow-md" : ""
      }`}
    >
      <div className="p-6 md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <span
              className={`kicker inline-flex items-center gap-2 rounded-pill px-2.5 py-1 text-[9px] ${
                isPerfect
                  ? "bg-herb-wash text-herb-ink"
                  : "bg-ember-wash text-ember-ink"
              }`}
            >
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-pill ${isPerfect ? "bg-herb" : "bg-ember"}`}
              />
              {isPerfect ? "Full match" : "Partial match"}
            </span>

            <h3 className="mt-3 font-headline text-2xl leading-tight text-ink">{title}</h3>
            {subtitle && <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>}
          </div>

          <div className="shrink-0 text-right">
            <p className="numeric text-2xl font-semibold leading-none text-ink">
              {matchedCount}
              <span className="text-base font-normal text-ink-faint">/{totalCount}</span>
            </p>
            <p className="kicker mt-1 text-[9px] text-ink-faint">Ingredients</p>
          </div>
        </div>

        {/* Match ratio — a second, non-colour channel for the same signal. */}
        <div className="mt-5">
          <div
            role="meter"
            aria-valuenow={ratio}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${matchedCount} of ${totalCount} ingredients matched`}
            className="h-1.5 w-full overflow-hidden rounded-pill bg-surface-muted"
          >
            <div
              className={`h-full rounded-pill ${isPerfect ? "bg-herb" : "bg-ember"}`}
              style={{ width: `${ratio}%` }}
            />
          </div>
          {!isPerfect && missingLabel && (
            <p className="mt-2.5 text-xs text-ink-soft">
              Missing <span className="font-medium text-ember-ink">{missingLabel.toLowerCase()}</span>
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
          <p className="numeric text-xs text-ink-faint">
            {kcal} kcal · {proteinG}g protein
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={open}
              aria-controls={panelId}
              className="kicker inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-pill px-3 text-[10px] text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink"
            >
              Details
              <ChevronDown
                aria-hidden="true"
                className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              />
            </button>
            <Link
              href={`/recipe/${recipeId}`}
              className="kicker group inline-flex min-h-11 items-center gap-2 rounded-pill bg-terracotta px-5 text-[10px] text-on-terracotta transition-colors hover:bg-terracotta-deep"
            >
              View recipe
              <ArrowRight
                aria-hidden="true"
                className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.3, ease: "easeOut" }}
            className="overflow-hidden border-t border-line bg-surface-muted"
          >
            <div className="grid gap-8 p-6 md:grid-cols-2 md:p-7">
              <div>
                <h4 className="kicker mb-4 text-[10px] text-terracotta">Vibe &amp; palate</h4>
                <p className="font-headline text-lg leading-snug text-ink">{mood}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {tasteProfile.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-pill border border-line-strong bg-paper px-2.5 py-1 text-xs text-ink-soft"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="kicker mb-4 text-[10px] text-terracotta">The manifest</h4>
                <ul className="flex flex-col gap-2">
                  {manifest.map((item) => (
                    <li key={item} className="wrap-anywhere text-sm text-ink-soft">
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
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function PantryPage() {
  const [inputValue, setInputValue] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const reduce = useReducedMotion();

  const addIngredient = (value?: string) => {
    const trimmed = (value ?? inputValue).trim().toLowerCase();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients((prev) => [...prev, trimmed]);
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
          mood: recipe.curatorNote ?? "",
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
          missingLabel: firstMissing?.name ?? null,
          ...meta,
        };
      })
      .sort((a, b) => b.matchedCount - a.matchedCount)
      .slice(0, 3);
  }, [showResults, ingredients]);

  const unusedSuggestions = SUGGESTIONS.filter((s) => !ingredients.includes(s));

  return (
    <div className="mx-auto max-w-4xl">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="mx-auto mb-12 max-w-2xl text-center">
        <p className="kicker mb-5 text-[10px] text-terracotta">The inventory</p>
        <h1 className="display mb-5 text-4xl text-ink sm:text-5xl md:text-6xl">
          Cook with what you have.
        </h1>
        <p className="mx-auto max-w-md text-lg leading-relaxed text-ink-soft">
          Add what is on your shelf. We will rank recipes by how much of it they
          already use — and name whatever is missing.
        </p>
      </header>

      {/* ── Input ───────────────────────────────────────────────────────── */}
      <section aria-labelledby="add-heading" className="card mx-auto max-w-2xl p-6">
        <h2 id="add-heading" className="kicker mb-4 text-[10px] text-ink-faint">
          Add an ingredient
        </h2>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
            />
            <input
              id="ingredient-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="garlic, chickpeas, olive oil…"
              aria-describedby="ingredient-help"
              className="min-h-12 w-full rounded-sm border border-line-strong bg-paper pl-11 pr-4 text-base text-ink transition-colors placeholder:text-ink-faint focus:border-terracotta focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => addIngredient()}
            disabled={!inputValue.trim()}
            className="inline-flex min-h-12 shrink-0 cursor-pointer items-center gap-2 rounded-sm bg-terracotta px-5 text-sm font-medium text-on-terracotta transition-colors hover:bg-terracotta-deep disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            Add
          </button>
        </div>
        <p id="ingredient-help" className="mt-2 text-xs text-ink-faint">
          Press Enter or use Add. Names can be rough — &ldquo;chicken&rdquo; matches
          &ldquo;chicken thighs&rdquo;.
        </p>

        {/* Chips */}
        {ingredients.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2 border-t border-line pt-5">
            <AnimatePresence initial={false}>
              {ingredients.map((ing) => (
                <motion.li
                  key={ing}
                  layout={!reduce}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.12 } }}
                >
                  <button
                    type="button"
                    onClick={() => removeIngredient(ing)}
                    aria-label={`Remove ${ing}`}
                    className="group inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-pill border border-line-strong bg-paper px-3 text-sm text-ink-soft transition-colors hover:border-danger/40 hover:bg-danger-wash hover:text-danger"
                  >
                    {ing}
                    <X aria-hidden="true" className="h-3.5 w-3.5" />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}

        {/* Suggestions when the shelf is bare */}
        {ingredients.length === 0 && unusedSuggestions.length > 0 && (
          <div className="mt-5 border-t border-line pt-5">
            <p className="kicker mb-3 text-[9px] text-ink-faint">Try one of these</p>
            <ul className="flex flex-wrap gap-2">
              {unusedSuggestions.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => addIngredient(s)}
                    className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-pill border border-dashed border-line-strong px-3 text-sm text-ink-faint transition-colors hover:border-terracotta hover:text-terracotta"
                  >
                    <Plus aria-hidden="true" className="h-3 w-3" />
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <div className="mx-auto mt-6 flex max-w-2xl flex-wrap items-center justify-between gap-4">
        <p className="numeric text-sm text-ink-faint">
          {ingredients.length === 0
            ? "Add at least one ingredient to begin."
            : `${ingredients.length} ingredient${ingredients.length !== 1 ? "s" : ""} on the shelf.`}
        </p>
        <button
          type="button"
          onClick={() => ingredients.length > 0 && setShowResults(true)}
          disabled={ingredients.length === 0}
          className="group inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-pill border border-line-strong bg-surface px-6 text-sm font-medium text-ink transition-colors hover:border-terracotta-edge hover:text-terracotta disabled:cursor-not-allowed disabled:opacity-40"
        >
          Find recipes
          <ArrowRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
          />
        </button>
      </div>

      {/* ── Results ─────────────────────────────────────────────────────── */}
      <section aria-live="polite" className="mt-16">
        {showResults && results.length > 0 && (
          <>
            <div className="mb-6 flex items-center gap-4">
              <h2 className="kicker shrink-0 text-[10px] text-terracotta">
                {results.length} match{results.length !== 1 ? "es" : ""}
              </h2>
              <span aria-hidden="true" className="h-px flex-1 bg-line" />
              <button
                type="button"
                onClick={() => setShowResults(false)}
                className="kicker min-h-9 cursor-pointer px-2 text-[10px] text-ink-faint transition-colors hover:text-ink"
              >
                Clear
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
          </>
        )}

        {showResults && results.length === 0 && (
          <EmptyState
            title="No matches yet"
            message="Nothing on the shelf lines up with a recipe. Try adding a protein or a grain — those anchor most of the collection."
          />
        )}
      </section>
    </div>
  );
}
