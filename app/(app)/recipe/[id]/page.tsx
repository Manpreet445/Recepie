"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import Kicker from "@/components/shared/Kicker";
import SectionDivider from "@/components/shared/SectionDivider";
import { MetaCard } from "@/components/shared/Cards";
import { mockRecipes } from "@/lib/mocks/data";
import { recipeImage, IMAGE_SIZES } from "@/lib/images";
import {
  pageEntranceContainer,
  pageEntranceItem,
  DURATIONS_S,
  EASE_SMOOTH,
} from "@/lib/motion";
import { Clock, Users, Flame } from "lucide-react";

const sectionLabels: Record<string, string> = {
  base: "Base",
  spice: "Spice",
  body: "Body",
  garnish: "Garnish",
  liquid: "Liquid",
};

export default function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const recipe = mockRecipes.find((r) => r.id === id);
  const shouldReduceMotion = useReducedMotion();

  if (!recipe) {
    notFound();
  }

  const heroUrl = recipeImage(recipe.imageQuery, IMAGE_SIZES.hero);

  // Group ingredients by section
  const ingredientGroups = recipe.ingredients.reduce(
    (acc, ing) => {
      if (!acc[ing.section]) acc[ing.section] = [];
      acc[ing.section].push(ing);
      return acc;
    },
    {} as Record<string, typeof recipe.ingredients>
  );

  // Wrapper — conditional motion
  const Wrapper = shouldReduceMotion ? "div" : motion.div;
  const Item = shouldReduceMotion ? "div" : motion.div;

  const containerProps = shouldReduceMotion
    ? {}
    : { variants: pageEntranceContainer, initial: "hidden", animate: "show" };
  const itemProps = shouldReduceMotion ? {} : { variants: pageEntranceItem };

  return (
    <Wrapper {...containerProps}>
      <Item {...itemProps}>
        <Kicker numeral="IV" className="mb-3">
          THE RECIPE
        </Kicker>
      </Item>

      {/* Hero Image */}
      <Item {...itemProps} className="mb-8">
        <div className="relative overflow-hidden rounded-[16px] border border-border">
          <motion.img
            layoutId={shouldReduceMotion ? undefined : `recipe-image-${recipe.id}`}
            src={heroUrl}
            alt={recipe.imageAlt}
            width={800}
            height={500}
            loading="eager"
            className="w-full aspect-[16/10] object-cover"
            transition={{ duration: DURATIONS_S.slow, ease: EASE_SMOOTH }}
          />
          {/* Subtle dark gradient at bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-page/40 pointer-events-none" />
        </div>
      </Item>

      {/* Header */}
      <Item {...itemProps} className="mb-8">
        <motion.h1
          layoutId={shouldReduceMotion ? undefined : `recipe-title-${recipe.id}`}
          className="font-serif text-4xl md:text-5xl lg:text-6xl text-text-primary mb-2"
          transition={{ duration: DURATIONS_S.slow, ease: EASE_SMOOTH }}
        >
          {recipe.title}
        </motion.h1>
        {recipe.subtitle && (
          <p className="text-lg text-text-secondary italic">{recipe.subtitle}</p>
        )}

        <div className="flex items-center gap-4 mt-4 text-xs text-text-tertiary">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Prep {recipe.prepMinutes}m · Cook {recipe.cookMinutes}m
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {recipe.servings} servings
          </span>
          <span className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" />
            {recipe.kcal} kcal
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {recipe.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 bg-bg-card border border-border rounded-full text-[10px] font-mono uppercase tracking-wider text-text-secondary"
            >
              {tag}
            </span>
          ))}
        </div>
      </Item>

      {/* Macros */}
      <Item {...itemProps}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <MetaCard kicker="Energy" value={recipe.kcal} unit="kcal" />
          <MetaCard kicker="Protein" value={recipe.proteinG} unit="g" />
          <MetaCard kicker="Carbs" value={recipe.carbsG} unit="g" />
          <MetaCard kicker="Fat" value={recipe.fatG} unit="g" />
        </div>
      </Item>

      <SectionDivider />

      {/* Two-column: Manifest + Ritual */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10">
        {/* Left: Ingredient Manifest */}
        <Item {...itemProps}>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-teal mb-5">
            The Manifest
          </h2>
          <div className="space-y-6">
            {(["body", "base", "spice", "liquid", "garnish"] as const).map((section) => {
              const items = ingredientGroups[section];
              if (!items) return null;
              return (
                <div key={section}>
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-tertiary mb-2">
                    {sectionLabels[section]}
                  </p>
                  <ul className="space-y-1.5">
                    {items.map((ing) => (
                      <li key={ing.name} className="flex items-center justify-between text-sm">
                        <span className="text-text-primary">{ing.name}</span>
                        <span className="font-mono text-xs text-text-tertiary">
                          {ing.quantity} {ing.unit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </Item>

        {/* Right: Ritual Steps */}
        <Item {...itemProps}>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-teal mb-5">
            The Ritual
          </h2>
          <div className="space-y-6">
            {recipe.ritual.map((step) => (
              <div key={step.stepNumber} className="relative pl-10">
                <div className="absolute left-0 top-0 w-7 h-7 rounded-full bg-bg-card border border-border flex items-center justify-center">
                  <span className="font-mono text-[10px] text-text-secondary">
                    {step.stepNumber}
                  </span>
                </div>
                <div>
                  <h3 className="font-serif text-lg text-text-primary mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {step.instruction}
                  </p>
                  {step.durationMinutes && (
                    <p className="mt-2 flex items-center gap-1 text-[11px] text-text-tertiary font-mono">
                      <Clock className="w-3 h-3" />
                      {step.durationMinutes} min
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Curator's Note */}
          {recipe.curatorNote && (
            <>
              <SectionDivider glyph="NOTE" />
              <div className="bg-bg-card border border-border rounded-lg p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber mb-3">
                  Curator&apos;s Note
                </p>
                <p className="text-sm text-text-secondary leading-relaxed italic">
                  &ldquo;{recipe.curatorNote}&rdquo;
                </p>
              </div>
            </>
          )}
        </Item>
      </div>
    </Wrapper>
  );
}
