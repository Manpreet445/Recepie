"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Kicker from "@/components/shared/Kicker";
import { mockMealPlan } from "@/lib/mocks/data";
import type { Ingredient } from "@/types/recipe";

/** Sum every ingredient across the plan, keyed by name and unit. */
function consolidateIngredients(plan: typeof mockMealPlan) {
  const map = new Map<string, { ingredient: Ingredient; totalQuantity: number }>();

  for (const day of plan.days) {
    for (const meal of day.meals) {
      for (const ing of meal.recipe.ingredients) {
        const key = `${ing.name.toLowerCase()}-${ing.unit}`;
        const existing = map.get(key);
        if (existing) {
          existing.totalQuantity += parseFloat(ing.quantity) || 0;
        } else {
          map.set(key, { ingredient: ing, totalQuantity: parseFloat(ing.quantity) || 0 });
        }
      }
    }
  }

  return map;
}

const sectionLabels: Record<string, string> = {
  base: "Base & grains",
  spice: "Spices & seasonings",
  body: "Proteins & produce",
  garnish: "Garnishes & herbs",
  liquid: "Oils & liquids",
};

const SECTION_ORDER = ["body", "base", "spice", "liquid", "garnish"] as const;

export default function MarketListPage() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const { groups, total } = useMemo(() => {
    const entries = Array.from(consolidateIngredients(mockMealPlan).values());
    const grouped = entries.reduce(
      (acc, item) => {
        const section = item.ingredient.section;
        (acc[section] ??= []).push(item);
        return acc;
      },
      {} as Record<string, typeof entries>
    );
    return { groups: grouped, total: entries.length };
  }, []);

  const toggle = (key: string) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });

  const done = checked.size;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/meal-prep/protocol"
        className="kicker mb-8 inline-flex min-h-11 items-center gap-2 text-[10px] text-ink-faint transition-colors hover:text-terracotta"
      >
        <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
        Back to protocol
      </Link>

      <Kicker numeral="IV" className="mb-5">
        The market list
      </Kicker>
      <h1 className="display mb-4 text-4xl text-ink md:text-5xl">Shopping list.</h1>
      <p className="mb-8 text-lg leading-relaxed text-ink-soft">
        Every ingredient across your {mockMealPlan.durationDays}-day plan, summed and
        grouped by aisle.
      </p>

      {/* Progress — ticking items off is the whole point of the page. */}
      <div className="card mb-10 p-5">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="kicker text-[10px] text-ink-faint">Gathered</span>
          <span className="numeric text-sm text-ink">
            {done}
            <span className="text-ink-faint">/{total}</span>
          </span>
        </div>
        <div
          role="meter"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${done} of ${total} items gathered`}
          className="h-2 overflow-hidden rounded-pill bg-surface-muted"
        >
          <div
            className="h-full rounded-pill bg-herb transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-10">
        {SECTION_ORDER.map((section) => {
          const items = groups[section];
          if (!items || items.length === 0) return null;

          return (
            <section key={section} aria-labelledby={`section-${section}`}>
              <h2
                id={`section-${section}`}
                className="kicker mb-4 flex items-center gap-3 text-[10px] text-terracotta"
              >
                {sectionLabels[section] ?? section}
                <span aria-hidden="true" className="h-px flex-1 bg-line" />
                <span className="numeric text-ink-faint">{items.length}</span>
              </h2>

              <ul className="space-y-1.5">
                {items.map((item) => {
                  const key = `${item.ingredient.name}-${item.ingredient.unit}`;
                  const isChecked = checked.has(key);

                  return (
                    <li key={key}>
                      <label
                        className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-sm border px-4 py-2.5 transition-colors ${
                          isChecked
                            ? "border-line bg-surface-muted"
                            : "border-line bg-surface hover:border-line-strong"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggle(key)}
                          className="h-5 w-5 shrink-0 cursor-pointer accent-[var(--herb)]"
                        />
                        <span
                          className={`wrap-anywhere flex-1 text-sm transition-colors ${
                            isChecked ? "text-ink-faint line-through" : "text-ink"
                          }`}
                        >
                          {item.ingredient.name}
                        </span>
                        <span className="numeric shrink-0 text-xs text-ink-soft">
                          {Math.round(item.totalQuantity * 10) / 10} {item.ingredient.unit}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
