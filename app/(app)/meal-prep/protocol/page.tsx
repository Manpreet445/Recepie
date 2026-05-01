"use client";

import { useState, useEffect, useMemo } from "react";
import Kicker from "@/components/shared/Kicker";
import SectionDivider from "@/components/shared/SectionDivider";
import StatusBadge from "@/components/shared/StatusBadge";
import { MetaCard } from "@/components/shared/Cards";
import RecipeCardAnimated from "@/components/shared/RecipeCardAnimated";
import { mockMealPlan } from "@/lib/mocks/data";
import { ChevronDown, ChevronUp, RefreshCw, Archive, ShoppingCart, ListChecks, ArrowLeft } from "lucide-react";
import Link from "next/link";
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
          map.set(key, {
            ingredient: ing,
            totalQty: qty,
            count: 1,
          });
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
        try { setPlan(JSON.parse(session)); return; } catch { /* fall through */ }
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
      // Normalize the section key to lowercase, fall back to "other"
      const section = (ing.section || "other").toLowerCase().trim();
      if (!groups[section]) groups[section] = [];
      groups[section].push(ing);
    }
    return groups;
  }, [allIngredients]);

  // Known section labels + fallback for anything the AI generates
  const SECTION_LABELS: Record<string, string> = {
    body:      "Proteins & Produce",
    protein:   "Proteins & Produce",
    proteins:  "Proteins & Produce",
    produce:   "Produce & Vegetables",
    vegetable: "Vegetables",
    vegetables: "Vegetables",
    base:      "Base & Grains",
    grains:    "Base & Grains",
    grain:     "Base & Grains",
    starch:    "Base & Starches",
    spice:     "Spice & Seasoning",
    spices:    "Spice & Seasoning",
    seasoning: "Spice & Seasoning",
    liquid:    "Oils & Liquids",
    liquids:   "Oils & Liquids",
    oil:       "Oils & Liquids",
    oils:      "Oils & Liquids",
    dairy:     "Dairy",
    garnish:   "Garnish & Herbs",
    herbs:     "Garnish & Herbs",
    other:     "Other Ingredients",
  };

  // Use whatever sections actually exist in the data
  const sectionKeys = useMemo(() => Object.keys(ingredientsBySection), [ingredientsBySection]);

  const goalBadgeVariant = plan.goal === "cut" ? "deficit" : plan.goal === "bulk" ? "surplus" : "maintenance";

  if (!mounted) return null;

  return (
    <div>
      <Link
        href="/meal-prep/dossier"
        className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-text-tertiary hover:text-teal transition-colors duration-300 mb-8"
      >
        <ArrowLeft className="w-3 h-3" />
        DOSSIER / BACK
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <Kicker numeral="III" className="mb-3">
            THE PROTOCOL
          </Kicker>
          <h1 className="font-serif text-3xl md:text-4xl text-text-primary mb-2">
            {plan.title}
          </h1>
          <div className="flex items-center gap-3">
            <StatusBadge variant={goalBadgeVariant}>
              {plan.goal}
            </StatusBadge>
            <span className="text-xs text-text-tertiary">
              {plan.durationDays} days · {plan.days[0]?.meals.length} meals/day
            </span>
          </div>
        </div>
      </div>

      {/* Macro Targets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetaCard kicker="Energy" value={plan.macroTargets.kcal} unit="kcal" detail="Daily target" />
        <MetaCard kicker="Protein" value={plan.macroTargets.proteinG} unit="g" detail={`${Math.round((plan.macroTargets.proteinG * 4 / plan.macroTargets.kcal) * 100)}% of kcal`} />
        <MetaCard kicker="Carbs" value={plan.macroTargets.carbsG} unit="g" detail={`${Math.round((plan.macroTargets.carbsG * 4 / plan.macroTargets.kcal) * 100)}% of kcal`} />
        <MetaCard kicker="Fat" value={plan.macroTargets.fatG} unit="g" detail={`${Math.round((plan.macroTargets.fatG * 9 / plan.macroTargets.kcal) * 100)}% of kcal`} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mb-8 flex-wrap">
        <button className="flex items-center gap-2 px-4 py-2 bg-bg-card border border-border font-mono text-[11px] uppercase tracking-[0.1em] text-text-secondary hover:border-border-strong hover:text-text-primary transition-colors cursor-pointer">
          <RefreshCw className="w-3.5 h-3.5" />
          Regenerate
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-bg-card border border-border font-mono text-[11px] uppercase tracking-[0.1em] text-text-secondary hover:border-border-strong hover:text-text-primary transition-colors cursor-pointer">
          <Archive className="w-3.5 h-3.5" />
          Save to Archive
        </button>
        <Link
          href="/meal-prep/market-list"
          className="flex items-center gap-2 px-4 py-2 bg-teal/10 border border-teal/20 font-mono text-[11px] uppercase tracking-[0.1em] text-teal hover:bg-teal/15 transition-colors"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Market List
        </Link>
        <button
          onClick={() => setShowManifest((v) => !v)}
          className={`flex items-center gap-2 px-4 py-2 border font-mono text-[11px] uppercase tracking-[0.1em] transition-colors cursor-pointer ${
            showManifest
              ? "bg-teal/10 border-teal/30 text-teal"
              : "bg-bg-card border-border text-text-secondary hover:border-border-strong hover:text-text-primary"
          }`}
        >
          <ListChecks className="w-3.5 h-3.5" />
          Full Manifest
        </button>
      </div>

      {/* ── FULL MANIFEST — aggregated ingredients for the entire plan ──── */}
      {showManifest && (
        <div className="mb-10">
          <div className="bg-bg-card border border-teal/20 overflow-hidden">
            <div className="px-6 py-5 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl text-text-primary">
                  The Manifest
                </h2>
                <p className="text-xs text-text-tertiary mt-1">
                  Total ingredients for all {plan.durationDays} days — quantities are aggregated across every meal.
                </p>
              </div>
              <div className="flex items-center gap-3">
                {checkedItems.length > 0 && (
                  <span className="font-mono text-[10px] text-teal tracking-wider">
                    {checkedItems.length}/{allIngredients.length} CHECKED
                  </span>
                )}
                {checkedItems.length > 0 && (
                  <button
                    onClick={() => setCheckedItems([])}
                    className="font-mono text-[10px] text-text-tertiary hover:text-text-primary transition-colors cursor-pointer tracking-wider"
                  >
                    RESET
                  </button>
                )}
              </div>
            </div>

            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                {sectionKeys.map((section) => {
                  const items = ingredientsBySection[section];
                  if (!items?.length) return null;
                  return (
                    <div key={section}>
                      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-teal pb-2 mb-3 border-b border-border">
                        {SECTION_LABELS[section] || section.charAt(0).toUpperCase() + section.slice(1)}
                      </p>
                      <div className="space-y-0">
                        {items.map((ing) => {
                          const key = `${ing.name}-${ing.unit}`;
                          const checked = checkedItems.includes(key);
                          return (
                            <button
                              key={key}
                              onClick={() => toggleIngredient(key)}
                              className={`w-full flex justify-between items-baseline gap-4 py-2.5 border-b border-white/5 cursor-pointer group text-left transition-opacity duration-200 ${
                                checked ? "opacity-30" : "opacity-100"
                              }`}
                            >
                              <span
                                className={`text-sm transition-colors duration-200 ${
                                  checked
                                    ? "line-through text-text-tertiary"
                                    : "text-text-primary group-hover:text-teal"
                                }`}
                              >
                                {ing.name}
                              </span>
                              <span className="font-mono text-[11px] text-text-secondary shrink-0 tabular-nums">
                                {ing.scaledQty}&nbsp;{ing.unit}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <SectionDivider />

      {/* Day Accordions */}
      <div className="space-y-4">
        {plan.days.map((day) => {
          const isExpanded = expandedDays.includes(day.dayNumber);
          return (
            <div key={day.dayNumber} className="bg-bg-card border border-border overflow-hidden">
              <button
                onClick={() => toggleDay(day.dayNumber)}
                className="w-full flex items-center justify-between p-5 hover:bg-bg-elevated/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <span className="font-serif text-xl text-text-primary">
                    Day {day.dayNumber}
                  </span>
                  <span className="font-mono text-[10px] text-text-tertiary tracking-wider">
                    {day.dailyTotals.kcal} kcal · P{day.dailyTotals.proteinG}g · C{day.dailyTotals.carbsG}g · F{day.dailyTotals.fatG}g
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-text-tertiary" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-text-tertiary" />
                )}
              </button>
              {isExpanded && (
                <div className="px-5 pb-5 space-y-3">
                  {day.meals.map((meal) => (
                    <RecipeCardAnimated key={meal.recipe.id} recipe={meal.recipe} variant="protocol" mealType={meal.mealType} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
