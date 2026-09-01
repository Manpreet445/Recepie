"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ChevronDown,
  RefreshCw,
  Archive,
  ShoppingCart,
  ListChecks,
  ArrowLeft,
} from "lucide-react";
import Kicker from "@/components/shared/Kicker";
import SectionDivider from "@/components/shared/SectionDivider";
import StatusBadge from "@/components/shared/StatusBadge";
import { MetaCard } from "@/components/shared/Cards";
import RecipeCardAnimated from "@/components/shared/RecipeCardAnimated";
import { LoadingState } from "@/components/shared/StateComponents";
import { mockMealPlan } from "@/lib/mocks/data";
import { MealPlan } from "@/types/mealPlan";
import { loadLatestPlan } from "@/lib/plans";
import type { Ingredient } from "@/types/recipe";

/** Aggregate all ingredients across all days, scaling quantities by plan duration */
function aggregateIngredients(plan: MealPlan): (Ingredient & { scaledQty: string })[] {
  const map = new Map<string, { ingredient: Ingredient; totalQty: number; count: number }>();

  for (const day of plan.days) {
    for (const meal of day.meals) {
      for (const ing of meal.recipe.ingredients) {
        const key = `${ing.name.toLowerCase()}-${ing.unit.toLowerCase()}`;
        const existing = map.get(key);
        const qty = parseFloat(ing.quantity) || 0;
        if (existing) {
          existing.totalQty += qty;
          existing.count += 1;
        } else {
          map.set(key, { ingredient: ing, totalQty: qty, count: 1 });
        }
      }
    }
  }

  return Array.from(map.values())
    .sort((a, b) => a.ingredient.name.localeCompare(b.ingredient.name))
    .map(({ ingredient, totalQty }) => ({
      ...ingredient,
      scaledQty: totalQty % 1 === 0 ? String(totalQty) : totalQty.toFixed(1),
    }));
}

// Known section labels + fallback for anything the AI generates
const SECTION_LABELS: Record<string, string> = {
  body: "Proteins & produce",
  protein: "Proteins & produce",
  proteins: "Proteins & produce",
  produce: "Produce & vegetables",
  vegetable: "Vegetables",
  vegetables: "Vegetables",
  base: "Base & grains",
  grains: "Base & grains",
  grain: "Base & grains",
  starch: "Base & starches",
  spice: "Spice & seasoning",
  spices: "Spice & seasoning",
  seasoning: "Spice & seasoning",
  liquid: "Oils & liquids",
  liquids: "Oils & liquids",
  oil: "Oils & liquids",
  oils: "Oils & liquids",
  dairy: "Dairy",
  garnish: "Garnish & herbs",
  herbs: "Garnish & herbs",
  other: "Other ingredients",
};

/** Shared styling for the secondary action row. */
const actionClass =
  "kicker inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-pill border border-line bg-surface px-4 text-[10px] text-ink-soft transition-colors hover:border-line-strong hover:text-ink";

export default function ProtocolPage() {
  const [mounted, setMounted] = useState(false);
  const [plan, setPlan] = useState<MealPlan>(mockMealPlan);
  const [expandedDays, setExpandedDays] = useState<number[]>([1]);
  const [showManifest, setShowManifest] = useState(false);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  useEffect(() => {
    async function hydrate() {
      setMounted(true);

      // Prefer sessionStorage (just-generated plan) over a Supabase round-trip
      const session = sessionStorage.getItem("latest_plan");
      if (session) {
        try {
          setPlan(JSON.parse(session));
          return;
        } catch {
          /* fall through */
        }
      }

      // Fall back to the most recently saved plan from Supabase
      try {
        const remote = await loadLatestPlan();
        if (remote) setPlan(remote);
      } catch (e) {
        console.error("Could not load plan from Supabase:", e);
      }
    }
    hydrate();
  }, []);

  const toggleDay = (day: number) => {
    setExpandedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleIngredient = (key: string) => {
    setCheckedItems((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const allIngredients = useMemo(() => aggregateIngredients(plan), [plan]);

  // Group by section — handle any section name the AI might generate
  const ingredientsBySection = useMemo(() => {
    const groups: Record<string, typeof allIngredients> = {};
    for (const ing of allIngredients) {
      const section = (ing.section || "other").toLowerCase().trim();
      (groups[section] ??= []).push(ing);
    }
    return groups;
  }, [allIngredients]);

  const sectionKeys = useMemo(() => Object.keys(ingredientsBySection), [ingredientsBySection]);

  const goalBadgeVariant =
    plan.goal === "cut" ? "deficit" : plan.goal === "bulk" ? "surplus" : "maintenance";

  if (!mounted) return <LoadingState message="Loading your protocol…" />;

  const pct = (grams: number, kcalPerG: number) =>
    Math.round(((grams * kcalPerG) / plan.macroTargets.kcal) * 100);

  return (
    <div>
      <Link
        href="/meal-prep/dossier"
        className="kicker mb-8 inline-flex min-h-11 items-center gap-2 text-[10px] text-ink-faint transition-colors hover:text-terracotta"
      >
        <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
        Back to dossier
      </Link>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="mb-10">
        <Kicker numeral="III" className="mb-5">
          The protocol
        </Kicker>
        <h1 className="display mb-4 text-4xl text-ink md:text-5xl">{plan.title}</h1>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge variant={goalBadgeVariant}>{plan.goal}</StatusBadge>
          <span className="numeric text-sm text-ink-faint">
            {plan.durationDays} days · {plan.days[0]?.meals.length} meals/day
          </span>
        </div>
      </header>

      {/* ── Macro targets ───────────────────────────────────────────────── */}
      <section aria-label="Daily macro targets" className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetaCard kicker="Energy" value={plan.macroTargets.kcal} unit="kcal" detail="Daily target" />
        <MetaCard
          kicker="Protein"
          value={plan.macroTargets.proteinG}
          unit="g"
          detail={`${pct(plan.macroTargets.proteinG, 4)}% of kcal`}
        />
        <MetaCard
          kicker="Carbs"
          value={plan.macroTargets.carbsG}
          unit="g"
          detail={`${pct(plan.macroTargets.carbsG, 4)}% of kcal`}
        />
        <MetaCard
          kicker="Fat"
          value={plan.macroTargets.fatG}
          unit="g"
          detail={`${pct(plan.macroTargets.fatG, 9)}% of kcal`}
        />
      </section>

      {/* ── Actions ─────────────────────────────────────────────────────── */}
      <div className="mb-10 flex flex-wrap items-center gap-2.5">
        <Link
          href="/meal-prep/market-list"
          className="kicker inline-flex min-h-11 items-center gap-2 rounded-pill bg-terracotta px-5 text-[10px] text-on-terracotta transition-colors hover:bg-terracotta-deep"
        >
          <ShoppingCart aria-hidden="true" className="h-3.5 w-3.5" />
          Market list
        </Link>
        <button
          type="button"
          onClick={() => setShowManifest((v) => !v)}
          aria-expanded={showManifest}
          aria-controls="manifest-panel"
          className={
            showManifest
              ? "kicker inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-pill border border-herb-edge bg-herb-wash px-4 text-[10px] text-herb-ink transition-colors"
              : actionClass
          }
        >
          <ListChecks aria-hidden="true" className="h-3.5 w-3.5" />
          Full manifest
        </button>
        <Link href="/meal-prep/dossier" className={actionClass}>
          <RefreshCw aria-hidden="true" className="h-3.5 w-3.5" />
          Regenerate
        </Link>
        <Link href="/meal-prep/archive" className={actionClass}>
          <Archive aria-hidden="true" className="h-3.5 w-3.5" />
          Archive
        </Link>
      </div>

      {/* ── Full manifest ───────────────────────────────────────────────── */}
      {showManifest && (
        <section id="manifest-panel" className="card mb-10 overflow-hidden">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line bg-surface-muted px-6 py-5">
            <div>
              <h2 className="font-headline text-xl text-ink">The manifest</h2>
              <p className="mt-1 text-xs text-ink-faint">
                Every ingredient across all {plan.durationDays} days, summed.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="numeric text-xs text-ink-soft">
                {checkedItems.length}/{allIngredients.length} checked
              </span>
              {checkedItems.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCheckedItems([])}
                  className="kicker min-h-9 cursor-pointer rounded-pill px-3 text-[10px] text-ink-faint transition-colors hover:bg-surface hover:text-ink"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          <div className="grid gap-x-10 gap-y-8 px-6 py-6 md:grid-cols-2 lg:grid-cols-3">
            {sectionKeys.map((section) => {
              const items = ingredientsBySection[section];
              if (!items?.length) return null;

              return (
                <div key={section}>
                  <h3 className="kicker mb-3 border-b border-line pb-2 text-[9px] text-terracotta">
                    {SECTION_LABELS[section] ??
                      section.charAt(0).toUpperCase() + section.slice(1)}
                  </h3>
                  <ul>
                    {items.map((ing) => {
                      const key = `${ing.name}-${ing.unit}`;
                      const checked = checkedItems.includes(key);
                      return (
                        <li key={key}>
                          <label className="flex min-h-11 cursor-pointer items-baseline gap-3 border-b border-line py-2.5">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleIngredient(key)}
                              className="h-4 w-4 shrink-0 cursor-pointer self-center accent-[var(--herb)]"
                            />
                            <span
                              className={`wrap-anywhere flex-1 text-sm transition-colors ${
                                checked ? "text-ink-faint line-through" : "text-ink"
                              }`}
                            >
                              {ing.name}
                            </span>
                            <span className="numeric shrink-0 text-[11px] text-ink-soft">
                              {ing.scaledQty}&nbsp;{ing.unit}
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <SectionDivider />

      {/* ── Days ────────────────────────────────────────────────────────── */}
      <section aria-label="Plan by day" className="space-y-4">
        {plan.days.map((day) => {
          const isExpanded = expandedDays.includes(day.dayNumber);
          const panelId = `day-panel-${day.dayNumber}`;

          return (
            <div key={day.dayNumber} className="card overflow-hidden">
              <h3>
                <button
                  type="button"
                  onClick={() => toggleDay(day.dayNumber)}
                  aria-expanded={isExpanded}
                  aria-controls={panelId}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-surface-muted"
                >
                  <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span className="font-headline text-xl text-ink">Day {day.dayNumber}</span>
                    <span className="numeric text-[11px] text-ink-faint">
                      {day.dailyTotals.kcal} kcal · P{day.dailyTotals.proteinG}g · C
                      {day.dailyTotals.carbsG}g · F{day.dailyTotals.fatG}g
                    </span>
                  </span>
                  <ChevronDown
                    aria-hidden="true"
                    className={`h-4 w-4 shrink-0 text-ink-faint transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </h3>

              {isExpanded && (
                <div id={panelId} className="space-y-3 border-t border-line px-5 pb-5 pt-5">
                  {day.meals.map((meal) => (
                    <RecipeCardAnimated
                      key={meal.recipe.id}
                      recipe={meal.recipe}
                      variant="protocol"
                      mealType={meal.mealType}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}
