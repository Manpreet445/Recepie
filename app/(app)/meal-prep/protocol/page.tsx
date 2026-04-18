"use client";

import { useState, useEffect } from "react";
import Kicker from "@/components/shared/Kicker";
import SectionDivider from "@/components/shared/SectionDivider";
import StatusBadge from "@/components/shared/StatusBadge";
import { MetaCard } from "@/components/shared/Cards";
import RecipeCardAnimated from "@/components/shared/RecipeCardAnimated";
import { mockMealPlan } from "@/lib/mocks/data";
import { ChevronDown, ChevronUp, RefreshCw, Archive, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { MealPlan } from "@/types/mealPlan";

export default function ProtocolPage() {
  const [mounted, setMounted] = useState(false);
  const [plan, setPlan] = useState<MealPlan>(mockMealPlan);
  const [expandedDays, setExpandedDays] = useState<number[]>([1]);

  useEffect(() => {
    Promise.resolve().then(() => {
      setMounted(true);
      const saved = sessionStorage.getItem("latest_plan");
      if (saved) {
        try {
          setPlan(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse the generated plan:", e);
        }
      }
    });
  }, []);

  const toggleDay = (day: number) => {
    setExpandedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const goalBadgeVariant = plan.goal === "cut" ? "deficit" : plan.goal === "bulk" ? "surplus" : "maintenance";

  if (!mounted) return null;

  return (
    <div>
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
      <div className="flex items-center gap-3 mb-8">
        <button className="flex items-center gap-2 px-4 py-2 bg-bg-card border border-border rounded-lg font-mono text-[11px] uppercase tracking-[0.1em] text-text-secondary hover:border-border-strong hover:text-text-primary transition-colors cursor-pointer">
          <RefreshCw className="w-3.5 h-3.5" />
          Regenerate
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-bg-card border border-border rounded-lg font-mono text-[11px] uppercase tracking-[0.1em] text-text-secondary hover:border-border-strong hover:text-text-primary transition-colors cursor-pointer">
          <Archive className="w-3.5 h-3.5" />
          Save to Archive
        </button>
        <Link
          href="/meal-prep/market-list"
          className="flex items-center gap-2 px-4 py-2 bg-teal/10 border border-teal/20 rounded-lg font-mono text-[11px] uppercase tracking-[0.1em] text-teal hover:bg-teal/15 transition-colors"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Market List
        </Link>
      </div>

      <SectionDivider />

      {/* Day Accordions */}
      <div className="space-y-4">
        {plan.days.map((day) => {
          const isExpanded = expandedDays.includes(day.dayNumber);
          return (
            <div key={day.dayNumber} className="bg-bg-card border border-border rounded-xl overflow-hidden">
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
