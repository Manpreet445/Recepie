"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Clock, Flame, Users } from "lucide-react";
import type { Recipe } from "@/types/recipe";
import { smartRecipeImage, IMAGE_SIZES } from "@/lib/images";
import { cardVariants, peekPanelVariants, thumbnailVariants } from "@/lib/motion";

interface RecipeCardAnimatedProps {
  recipe: Recipe;
  variant?: "protocol" | "pantry";
  mealType?: string;
  matchedCount?: number;
  missingCount?: number;
}

/** Shared summary line — identical in both the static and animated cards. */
function MetaRow({ recipe }: { recipe: Recipe }) {
  return (
    <div className="numeric mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ink-faint">
      <span className="inline-flex items-center gap-1">
        <Flame aria-hidden="true" className="h-3 w-3" />
        {recipe.kcal} kcal
      </span>
      <span className="inline-flex items-center gap-1">
        <Clock aria-hidden="true" className="h-3 w-3" />
        {recipe.prepMinutes + recipe.cookMinutes}m
      </span>
      <span className="inline-flex items-center gap-1">
        <Users aria-hidden="true" className="h-3 w-3" />
        {recipe.servings} srv
      </span>
    </div>
  );
}

function MatchPill({ matched, missing }: { matched: number; missing?: number }) {
  return (
    <span className="kicker mt-2 inline-flex rounded-pill bg-herb-wash px-2 py-0.5 text-[9px] text-herb-ink">
      {matched}/{matched + (missing ?? 0)} matched
    </span>
  );
}

/** Static fallback served to anyone who prefers reduced motion. */
function StaticRecipeCard({
  recipe,
  variant = "pantry",
  mealType,
  matchedCount,
  missingCount,
}: RecipeCardAnimatedProps) {
  return (
    <Link
      href={`/recipe/${recipe.id}`}
      className="card card-interactive group block overflow-hidden"
    >
      <div className="flex gap-4 p-4">
        <div
          className={`relative shrink-0 overflow-hidden rounded-sm bg-surface-muted ${
            variant === "protocol" ? "h-[75px] w-[100px]" : "h-[90px] w-[120px]"
          }`}
        >
          <Image
            src={smartRecipeImage(recipe.imageQuery, IMAGE_SIZES.thumbnail)}
            alt={recipe.imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 120px, 120px"
          />
        </div>
        <div className="min-w-0 flex-1">
          {mealType && <span className="kicker text-[10px] text-terracotta">{mealType}</span>}
          <h4 className="truncate font-headline text-lg text-ink transition-colors group-hover:text-terracotta">
            {recipe.title}
          </h4>
          <MetaRow recipe={recipe} />
          {matchedCount !== undefined && (
            <MatchPill matched={matchedCount} missing={missingCount} />
          )}
        </div>
      </div>
    </Link>
  );
}

/**
 * Recipe card with a hover-peek nutrition panel and shared-element transitions
 * into the detail page. The whole card is one link, so it is reachable by
 * keyboard rather than depending on a click handler.
 */
export default function RecipeCardAnimated({
  recipe,
  variant = "pantry",
  mealType,
  matchedCount,
  missingCount,
}: RecipeCardAnimatedProps) {
  const shouldReduceMotion = useReducedMotion();

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

  const previewIngredients = recipe.ingredients.slice(0, 4);
  const moreCount = Math.max(0, recipe.ingredients.length - 4);

  return (
    <motion.div
      layoutId={`recipe-card-${recipe.id}`}
      initial="rest"
      whileHover="peek"
      whileFocus="peek"
      variants={cardVariants}
      className="card overflow-hidden hover:border-terracotta-edge focus-within:border-terracotta-edge"
      style={{ willChange: "transform" }}
    >
      <Link href={`/recipe/${recipe.id}`} className="group block">
        <div className="flex gap-4 p-4">
          <div
            className={`relative shrink-0 overflow-hidden rounded-sm bg-surface-muted ${
              variant === "protocol" ? "h-[75px] w-[100px]" : "h-[90px] w-[120px]"
            }`}
          >
            <motion.div
              layoutId={`recipe-image-${recipe.id}`}
              className="relative h-full w-full"
              variants={thumbnailVariants}
            >
              <Image
                src={smartRecipeImage(recipe.imageQuery, IMAGE_SIZES.thumbnail)}
                alt={recipe.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 120px, 120px"
              />
            </motion.div>
          </div>

          <div className="min-w-0 flex-1">
            {mealType && <span className="kicker text-[10px] text-terracotta">{mealType}</span>}
            <motion.h4
              layoutId={`recipe-title-${recipe.id}`}
              className="truncate font-headline text-lg text-ink transition-colors group-hover:text-terracotta"
            >
              {recipe.title}
            </motion.h4>
            <MetaRow recipe={recipe} />
            {matchedCount !== undefined && (
              <MatchPill matched={matchedCount} missing={missingCount} />
            )}
          </div>
        </div>

        {/* Peek panel — expands on hover or keyboard focus. */}
        <motion.div variants={peekPanelVariants} className="overflow-hidden">
          <div className="px-4 pb-4">
            <div className="mb-3 h-px bg-line" />

            <p className="numeric text-[11px] text-ink-soft">
              Per serving: {recipe.kcal} kcal · {recipe.proteinG}g P · {recipe.carbsG}g C ·{" "}
              {recipe.fatG}g F
            </p>

            {recipe.subtitle && (
              <p className="mt-1.5 text-[13px] leading-snug text-ink-soft">{recipe.subtitle}</p>
            )}

            <ul className="mt-3 space-y-1.5">
              {previewIngredients.map((ing) => (
                <li key={ing.name} className="flex items-baseline justify-between gap-3 text-[12px]">
                  <span className="wrap-anywhere text-ink-soft">{ing.name}</span>
                  <span className="numeric shrink-0 text-[10px] text-ink-faint">
                    {ing.quantity} {ing.unit}
                  </span>
                </li>
              ))}
            </ul>

            {moreCount > 0 && (
              <p className="kicker mt-2 text-[9px] text-ink-faint">+ {moreCount} more</p>
            )}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
