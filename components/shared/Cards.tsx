"use client";

import Link from "next/link";
import { ArrowRight, Clock, Flame, Beef } from "lucide-react";
import type { Recipe } from "@/types/recipe";

/** Stat card for displaying a single metric (macros, kcal, etc.). */
interface MetaCardProps {
  kicker: string;
  value: string | number;
  detail?: string;
  unit?: string;
  className?: string;
}

export function MetaCard({ kicker, value, detail, unit, className = "" }: MetaCardProps) {
  return (
    <div
      className={`bg-bg-card border border-border rounded-lg p-5 hover:border-border-strong transition-colors ${className}`}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-teal mb-3">
        {kicker}
      </p>
      <p className="font-serif text-3xl text-text-primary">
        {value}
        {unit && <span className="text-lg text-text-secondary ml-1">{unit}</span>}
      </p>
      {detail && <p className="text-xs text-text-tertiary mt-1.5">{detail}</p>}
    </div>
  );
}

/** Large clickable navigation card used on the home dashboard. */
interface ModeCardProps {
  title: string;
  subtitle: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  accent?: "teal" | "amber";
}

export function ModeCard({
  title,
  subtitle,
  description,
  href,
  icon,
  accent = "teal",
}: ModeCardProps) {
  const accentClasses =
    accent === "teal"
      ? "border-teal/20 hover:border-teal/40 hover:shadow-[0_0_30px_rgba(94,234,212,0.08)]"
      : "border-amber/20 hover:border-amber/40 hover:shadow-[0_0_30px_rgba(251,191,36,0.08)]";

  return (
    <Link
      href={href}
      className={`group block bg-bg-card rounded-xl border ${accentClasses} p-7 transition-all duration-300`}
    >
      <div className="flex items-start justify-between mb-5">
        <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${
          accent === "teal" ? "bg-teal/10 text-teal" : "bg-amber/10 text-amber"
        }`}>
          {icon}
        </div>
        <ArrowRight className="w-4 h-4 text-text-tertiary group-hover:text-text-secondary group-hover:translate-x-1 transition-all" />
      </div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary mb-1.5">
        {subtitle}
      </p>
      <h3 className="font-serif text-xl text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
    </Link>
  );
}

/** Compact meal card without animations (used as a fallback). */
interface MealCardProps {
  mealType: string;
  recipe: Recipe;
}

export function MealCard({ mealType, recipe }: MealCardProps) {
  return (
    <Link
      href={`/recipe/${recipe.id}`}
      className="group block bg-bg-card border border-border rounded-lg p-5 hover:border-border-strong transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-tertiary">
          {mealType}
        </span>
        <div className="flex items-center gap-3 text-[11px] text-text-tertiary">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {recipe.prepMinutes + recipe.cookMinutes}m
          </span>
          <span className="flex items-center gap-1">
            <Flame className="w-3 h-3" />
            {recipe.kcal} / srv
          </span>
        </div>
      </div>
      <h4 className="font-serif text-lg text-text-primary group-hover:text-teal transition-colors">
        {recipe.title}
      </h4>
      {recipe.subtitle && (
        <p className="text-xs text-text-secondary mt-1">{recipe.subtitle}</p>
      )}
      <div className="flex items-center gap-4 mt-3 text-[11px] text-text-tertiary font-mono">
        <span>P {recipe.proteinG}g</span>
        <span>C {recipe.carbsG}g</span>
        <span>F {recipe.fatG}g</span>
      </div>
    </Link>
  );
}

/** Basic recipe card without hover animations (archive and list views). */
interface RecipeCardProps {
  recipe: Recipe;
  matchedCount?: number;
  missingCount?: number;
}

export function RecipeCard({ recipe, matchedCount, missingCount }: RecipeCardProps) {
  return (
    <Link
      href={`/recipe/${recipe.id}`}
      className="group block bg-bg-card border border-border rounded-xl overflow-hidden hover:border-border-strong transition-all duration-300 hover:shadow-lg hover:shadow-black/20"
    >
      {/* Gradient header area */}
      <div className="h-32 bg-gradient-to-br from-bg-elevated to-bg-card flex items-end p-5">
        <div className="flex items-center gap-2">
          {recipe.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-bg-page/60 backdrop-blur rounded text-[10px] font-mono uppercase tracking-wider text-text-secondary"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="p-5">
        <h4 className="font-serif text-lg text-text-primary group-hover:text-teal transition-colors mb-1">
          {recipe.title}
        </h4>
        {recipe.subtitle && (
          <p className="text-xs text-text-secondary mb-3">{recipe.subtitle}</p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-[11px] text-text-tertiary">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {recipe.prepMinutes + recipe.cookMinutes}m
            </span>
            <span className="flex items-center gap-1">
              <Flame className="w-3 h-3" />
              {recipe.kcal} kcal / srv
            </span>
            <span className="flex items-center gap-1">
              <Beef className="w-3 h-3" />
              {recipe.proteinG}g
            </span>
          </div>

          {matchedCount !== undefined && (
            <span className="text-[10px] font-mono text-teal">
              {matchedCount}/{matchedCount + (missingCount ?? 0)} matched
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
