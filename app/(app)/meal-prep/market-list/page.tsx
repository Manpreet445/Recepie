import Kicker from "@/components/shared/Kicker";
import { mockMealPlan } from "@/lib/mocks/data";
import type { Ingredient } from "@/types/recipe";
import { Check } from "lucide-react";

// Consolidate ingredients across all meals
function consolidateIngredients(plan: typeof mockMealPlan): Map<string, { ingredient: Ingredient; totalQuantity: number }> {
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
  base: "Base & Grains",
  spice: "Spices & Seasonings",
  body: "Proteins & Produce",
  garnish: "Garnishes & Herbs",
  liquid: "Oils & Liquids",
};

export default function MarketListPage() {
  const consolidated = consolidateIngredients(mockMealPlan);
  const entries = Array.from(consolidated.values());

  // Group by section
  const groups = entries.reduce(
    (acc, item) => {
      const section = item.ingredient.section;
      if (!acc[section]) acc[section] = [];
      acc[section].push(item);
      return acc;
    },
    {} as Record<string, typeof entries>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <Kicker numeral="IV" className="mb-3">
        THE MARKET LIST
      </Kicker>
      <h1 className="font-serif text-3xl md:text-4xl text-text-primary mb-2">
        Shopping list.
      </h1>
      <p className="text-sm text-text-secondary mb-8">
        Ingredients consolidated across your {mockMealPlan.durationDays}-day protocol.
        Quantities have been summed by ingredient.
      </p>

      <div className="space-y-8">
        {(["body", "base", "spice", "liquid", "garnish"] as const).map((section) => {
          const items = groups[section];
          if (!items || items.length === 0) return null;

          return (
            <section key={section}>
              <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-teal mb-4">
                {sectionLabels[section] || section}
              </h2>
              <div className="space-y-1">
                {items.map((item) => (
                  <label
                    key={`${item.ingredient.name}-${item.ingredient.unit}`}
                    className="flex items-center gap-3 p-3 bg-bg-card border border-border rounded-lg hover:border-border-strong transition-colors group cursor-pointer"
                  >
                    <div className="w-5 h-5 rounded border border-border-strong flex items-center justify-center group-hover:border-teal/40 transition-colors">
                      <Check className="w-3 h-3 text-transparent group-hover:text-teal/30" />
                    </div>
                    <span className="flex-1 text-sm text-text-primary">
                      {item.ingredient.name}
                    </span>
                    <span className="font-mono text-xs text-text-secondary">
                      {Math.round(item.totalQuantity * 10) / 10} {item.ingredient.unit}
                    </span>
                  </label>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
