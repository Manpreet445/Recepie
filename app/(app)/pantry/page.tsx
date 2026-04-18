"use client";

import { useState } from "react";
import Kicker from "@/components/shared/Kicker";
import SectionDivider from "@/components/shared/SectionDivider";
import RecipeCardAnimated from "@/components/shared/RecipeCardAnimated";
import { mockRecipes } from "@/lib/mocks/data";
import { Search, X, Filter } from "lucide-react";

export default function PantryPage() {
  const [inputValue, setInputValue] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const addIngredient = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !ingredients.includes(trimmed.toLowerCase())) {
      setIngredients([...ingredients, trimmed.toLowerCase()]);
      setInputValue("");
    }
  };

  const removeIngredient = (ing: string) => {
    setIngredients(ingredients.filter((i) => i !== ing));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addIngredient();
    }
  };

  const handleSearch = () => {
    if (ingredients.length > 0) {
      setShowResults(true);
    }
  };

  // Mock matching logic
  const results = showResults
    ? mockRecipes.map((recipe) => {
        const recipeIngNames = recipe.ingredients.map((i) => i.name.toLowerCase());
        const matched = ingredients.filter((i) =>
          recipeIngNames.some((ri) => ri.includes(i) || i.includes(ri))
        );
        return {
          recipe,
          matchedCount: Math.max(matched.length, Math.floor(Math.random() * 4) + 2),
          missingCount: recipe.ingredients.length - Math.max(matched.length, Math.floor(Math.random() * 4) + 2),
        };
      }).sort((a, b) => b.matchedCount - a.matchedCount)
    : [];

  return (
    <div>
      <Kicker numeral="V" className="mb-3">
        THE INVENTORY
      </Kicker>
      <h1 className="font-serif text-3xl md:text-4xl text-text-primary mb-2">
        What&apos;s in your pantry?
      </h1>
      <p className="text-sm text-text-secondary mb-8 max-w-lg">
        Add ingredients you have on hand. We&apos;ll match them to recipes and show you
        what you can make with what you&apos;ve got.
      </p>

      {/* Ingredient Input */}
      <div className="max-w-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type an ingredient and press Enter..."
              className="w-full pl-10 pr-4 py-3 bg-bg-card border border-border rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:border-teal/40 focus:outline-none transition-colors"
            />
          </div>
          <button
            onClick={addIngredient}
            className="px-4 py-3 bg-bg-card border border-border rounded-lg font-mono text-[11px] uppercase tracking-[0.1em] text-text-secondary hover:border-border-strong hover:text-text-primary transition-colors cursor-pointer"
          >
            Add
          </button>
        </div>

        {/* Tags */}
        {ingredients.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {ingredients.map((ing) => (
              <span
                key={ing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal/10 border border-teal/20 rounded-full text-xs text-teal"
              >
                {ing}
                <button
                  onClick={() => removeIngredient(ing)}
                  className="hover:text-text-primary transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Optional filters */}
        <div className="flex items-center gap-3 mb-6">
          <button className="flex items-center gap-2 px-4 py-2 bg-bg-card border border-border rounded-lg font-mono text-[11px] uppercase tracking-[0.1em] text-text-secondary hover:border-border-strong transition-colors cursor-pointer">
            <Filter className="w-3.5 h-3.5" />
            Filters
          </button>
          <button
            onClick={handleSearch}
            disabled={ingredients.length === 0}
            className="px-5 py-2 bg-teal text-bg-page font-mono text-xs uppercase tracking-[0.1em] rounded-lg hover:bg-teal-subtle transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Find Recipes
          </button>
        </div>
      </div>

      {/* Results */}
      {showResults && (
        <>
          <SectionDivider glyph="MATCHES" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map((result) => (
              <RecipeCardAnimated
                key={result.recipe.id}
                recipe={result.recipe}
                variant="pantry"
                matchedCount={result.matchedCount}
                missingCount={result.missingCount}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
