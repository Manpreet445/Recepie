"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Flame, Beef, Users } from "lucide-react";
import type { Recipe } from "@/types/recipe";
import { smartRecipeImage, IMAGE_SIZES } from "@/lib/images";

/* ── MetaCard ───────────────────────────────────────────────────────────── */

interface MetaCardProps {
  kicker: string;
  value: string | number;
  detail?: string;
  unit?: string;
  className?: string;
}

/**
 * Single-metric tile. The figure uses tabular numerals so a row of these keeps
 * its baseline grid when values change.
 */
export function MetaCard({ kicker, value, detail, unit, className = "" }: MetaCardProps) {
  return (
    <div
      className={`card relative overflow-hidden p-5 ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-terracotta/25"
      />
      <p className="kicker mb-3 text-[10px] text-terracotta">{kicker}</p>
      <p className="numeric text-3xl font-semibold leading-none text-ink">
        {value}
        {unit && <span className="ml-1 text-base font-normal text-ink-faint">{unit}</span>}
      </p>
      {detail && <p className="mt-2 text-xs text-ink-faint">{detail}</p>}
    </div>
  );
}

/* ── ModeCard ───────────────────────────────────────────────────────────── */

interface ModeCardProps {
  title: string;
  subtitle: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  accent?: "teal" | "amber";
}

/** Large entry-point card for a top-level area of the app. */
export function ModeCard({
  title,
  subtitle,
  description,
  href,
  icon,
  accent = "teal",
}: ModeCardProps) {
  const isHerb = accent === "teal";

  return (
    <Link
      href={href}
      className="card card-interactive group block p-7 hover:border-terracotta-edge"
    >
      <div className="mb-6 flex items-start justify-between">
        <span
          aria-hidden="true"
          className={`flex h-12 w-12 items-center justify-center rounded-md ${
            isHerb ? "bg-herb-wash text-herb-ink" : "bg-ember-wash text-ember-ink"
          }`}
        >
          {icon}
        </span>
        <ArrowRight className="h-4 w-4 text-ink-faint transition-transform duration-200 group-hover:translate-x-1 group-hover:text-terracotta" />
      </div>
      <p className="kicker mb-2 text-[10px] text-ink-faint">{subtitle}</p>
      <h3 className="mb-2 font-headline text-xl text-ink transition-colors group-hover:text-terracotta">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-ink-soft">{description}</p>
    </Link>
  );
}

/* ── MealCard ───────────────────────────────────────────────────────────── */

interface MealCardProps {
  mealType: string;
  recipe: Recipe;
}

/** Compact, unanimated meal row — the fallback used inside dense lists. */
export function MealCard({ mealType, recipe }: MealCardProps) {
  return (
    <Link
      href={`/recipe/${recipe.id}`}
      className="card card-interactive group flex gap-4 overflow-hidden p-4"
    >
      <div className="relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-sm bg-surface-muted">
        <Image
          src={smartRecipeImage(recipe.imageQuery, IMAGE_SIZES.small)}
          alt=""
          fill
          className="object-cover"
          sizes="76px"
        />
      </div>

      <div className="min-w-0 flex-1">
        <span className="kicker text-[10px] text-terracotta">{mealType}</span>
        <h4 className="mt-0.5 truncate font-headline text-lg text-ink transition-colors group-hover:text-terracotta">
          {recipe.title}
        </h4>
        {recipe.subtitle && (
          <p className="mt-0.5 truncate text-xs text-ink-soft">{recipe.subtitle}</p>
        )}
        <div className="numeric mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ink-faint">
          <span className="inline-flex items-center gap-1">
            <Clock aria-hidden="true" className="h-3 w-3" />
            {recipe.prepMinutes + recipe.cookMinutes}m
          </span>
          <span className="inline-flex items-center gap-1">
            <Flame aria-hidden="true" className="h-3 w-3" />
            {recipe.kcal} kcal
          </span>
          <span>
            P {recipe.proteinG}g · C {recipe.carbsG}g · F {recipe.fatG}g
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── RecipeCard ─────────────────────────────────────────────────────────── */

interface RecipeCardProps {
  recipe: Recipe;
  matchedCount?: number;
  missingCount?: number;
}

/**
 * Photo-led recipe card for grids. A food product should show food, so the
 * image carries the top of the card rather than an abstract gradient.
 */
export function RecipeCard({ recipe, matchedCount, missingCount }: RecipeCardProps) {
  const total = matchedCount !== undefined ? matchedCount + (missingCount ?? 0) : 0;

  return (
    <Link
      href={`/recipe/${recipe.id}`}
      className="card card-interactive group block overflow-hidden"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-muted">
        <Image
          src={smartRecipeImage(recipe.imageQuery, IMAGE_SIZES.thumbnail)}
          alt={recipe.imageAlt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {recipe.tags.length > 0 && (
          <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-1.5 p-3">
            {recipe.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="kicker rounded-pill bg-paper/90 px-2.5 py-1 text-[9px] text-ink-soft backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="p-5">
        <h4 className="mb-1 font-headline text-lg text-ink transition-colors group-hover:text-terracotta">
          {recipe.title}
        </h4>
        {recipe.subtitle && (
          <p className="mb-3 line-clamp-2 text-xs text-ink-soft">{recipe.subtitle}</p>
        )}

        <div className="numeric flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-line pt-3 text-[11px] text-ink-faint">
          <span className="inline-flex items-center gap-1">
            <Clock aria-hidden="true" className="h-3 w-3" />
            {recipe.prepMinutes + recipe.cookMinutes}m
          </span>
          <span className="inline-flex items-center gap-1">
            <Flame aria-hidden="true" className="h-3 w-3" />
            {recipe.kcal} kcal
          </span>
          <span className="inline-flex items-center gap-1">
            <Beef aria-hidden="true" className="h-3 w-3" />
            {recipe.proteinG}g
          </span>
          <span className="inline-flex items-center gap-1">
            <Users aria-hidden="true" className="h-3 w-3" />
            {recipe.servings}
          </span>

          {matchedCount !== undefined && (
            <span className="kicker ml-auto rounded-pill bg-herb-wash px-2 py-0.5 text-[9px] text-herb-ink">
              {matchedCount}/{total} matched
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
