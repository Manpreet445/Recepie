"use client";

import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Clock, Flame, ChefHat } from "lucide-react";
import type { Recipe } from "@/types/recipe";
import { smartRecipeImage, IMAGE_SIZES } from "@/lib/images";
import Image from "next/image";
import {
  cardVariants,
  peekPanelVariants,
  thumbnailVariants,
} from "@/lib/motion";

interface RecipeCardAnimatedProps {
  recipe: Recipe;
  variant?: "protocol" | "pantry";
  mealType?: string;
  matchedCount?: number;
  missingCount?: number;
}

/** Static fallback for users who prefer reduced motion. */
function StaticRecipeCard({
  recipe,
  variant = "pantry",
  mealType,
  matchedCount,
  missingCount,
}: RecipeCardAnimatedProps) {
  const imgUrl = smartRecipeImage(recipe.imageQuery, IMAGE_SIZES.thumbnail);

  return (
    <a
      href={`/recipe/${recipe.id}`}
      className="group block bg-bg-card border border-border overflow-hidden hover:border-border-strong transition-colors"
    >
      <div className="flex gap-4 p-4">
        <div className={`relative overflow-hidden border border-border shrink-0 ${
          variant === "protocol" ? "w-[100px] h-[75px]" : "w-[120px] h-[90px]"
        }`}>
          <Image
            src={imgUrl}
            alt={recipe.imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 120px"
          />
        </div>
        <div className="flex-1 min-w-0">
          {mealType && (
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-teal">
              {mealType}
            </span>
          )}
          <h4 className="font-serif text-lg text-text-primary group-hover:text-teal transition-colors truncate">
            {recipe.title}
          </h4>
          <div className="flex items-center gap-3 mt-1 text-[11px] text-text-tertiary">
            <span className="flex items-center gap-1">
              <Flame className="w-3 h-3" />
              {recipe.kcal} kcal / srv
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {recipe.prepMinutes + recipe.cookMinutes}m
            </span>
            <span className="flex items-center gap-1">
              <ChefHat className="w-3 h-3" />
              {recipe.servings} srv
            </span>
          </div>
          {matchedCount !== undefined && (
            <span className="text-[10px] font-mono text-teal mt-1 block">
              {matchedCount}/{matchedCount + (missingCount ?? 0)} matched
            </span>
          )}
        </div>
      </div>
    </a>
  );
}

/** Animated recipe card with hover-peek panel and shared-element transitions. */
export default function RecipeCardAnimated({
  recipe,
  variant = "pantry",
  mealType,
  matchedCount,
  missingCount,
}: RecipeCardAnimatedProps) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  // fall back to static card if user prefers reduced motion
  if (shouldReduceMotion) {
    return (
      <StaticRecipeCard
        recipe={recipe}
        variant={variant}
        mealType={mealType}
        matchedCount={matchedCount}
        missingCount={missingCount}
      />
    );
  }

  const imgUrl = smartRecipeImage(recipe.imageQuery, IMAGE_SIZES.thumbnail);

  const previewIngredients = recipe.ingredients.slice(0, 4);
  const moreCount = Math.max(0, recipe.ingredients.length - 4);

  const handleClick = () => {
    router.push(`/recipe/${recipe.id}`);
  };

  return (
    <motion.div
      layoutId={`recipe-card-${recipe.id}`}
      onClick={handleClick}
      initial="rest"
      whileHover="peek"
      variants={cardVariants}
      className="bg-bg-card border border-border overflow-hidden cursor-pointer hover:border-border-strong transition-[border-color]"
      style={{ willChange: "transform" }}
    >
      <div className="flex gap-4 p-4">
        {/* thumbnail — zooms slightly on hover */}
        <div
          className={`relative overflow-hidden border border-border shrink-0 ${
            variant === "protocol" ? "w-[100px] h-[75px]" : "w-[120px] h-[90px]"
          }`}
        >
          <motion.div
            layoutId={`recipe-image-${recipe.id}`}
            className="w-full h-full relative"
            variants={thumbnailVariants}
          >
            <Image
              src={imgUrl}
              alt={recipe.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 120px"
            />
          </motion.div>
        </div>

        <div className="flex-1 min-w-0">
          {mealType && (
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-teal">
              {mealType}
            </span>
          )}
          <motion.h4
            layoutId={`recipe-title-${recipe.id}`}
            className="font-serif text-lg text-text-primary truncate"
          >
            {recipe.title}
          </motion.h4>
          <div className="flex items-center gap-3 mt-1 text-[11px] text-text-tertiary font-mono">
            <span className="flex items-center gap-1">
              <Flame className="w-3 h-3" />
              {recipe.kcal} kcal / srv
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {recipe.prepMinutes + recipe.cookMinutes}m
            </span>
            <span className="flex items-center gap-1">
              <ChefHat className="w-3 h-3" />
              {recipe.servings} srv
            </span>
          </div>
          {matchedCount !== undefined && (
            <span className="text-[10px] font-mono text-teal mt-1 block">
              {matchedCount}/{matchedCount + (missingCount ?? 0)} matched
            </span>
          )}
        </div>
      </div>

      {/* peek panel — slides in from below on hover */}
      <motion.div
        variants={peekPanelVariants}
        className="overflow-hidden"
      >
        <div className="px-4 pb-4 pt-0">
          <p className="font-mono text-[11px] text-text-secondary">
            Per srv: {recipe.kcal} kcal · {recipe.proteinG}g P · {recipe.carbsG}g C · {recipe.fatG}g F
          </p>

          {recipe.subtitle && (
            <p className="text-[13px] text-text-secondary mt-1.5 leading-snug">
              {recipe.subtitle}
            </p>
          )}

          <div className="h-px bg-border my-2.5" />

          {/* Show ingredients with exact measurements */}
          <div className="space-y-1">
            {previewIngredients.map((ing) => (
              <div key={ing.name} className="flex justify-between text-[12px]">
                <span className="text-text-tertiary">{ing.name}</span>
                <span className="font-mono text-[10px] text-text-secondary ml-2 shrink-0">
                  {ing.quantity} {ing.unit}
                </span>
              </div>
            ))}
            {moreCount > 0 && (
              <span className="font-mono text-[10px] text-text-tertiary">
                + {moreCount} more ingredients
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
