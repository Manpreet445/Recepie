"use client";

import { use, useState, useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";
import {
  Clock,
  ArrowLeft,
  Users,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  Flame,
} from "lucide-react";
import { mockRecipes } from "@/lib/mocks/data";
import { smartRecipeImage, IMAGE_SIZES } from "@/lib/images";
import type { Recipe } from "@/types/recipe";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const SECTION_LABELS: Record<string, string> = {
  body: "Proteins & produce",
  protein: "Proteins & produce",
  proteins: "Proteins & produce",
  produce: "Produce & vegetables",
  vegetable: "Vegetables",
  vegetables: "Vegetables",
  base: "Base & grains",
  grains: "Base & grains",
  grain: "Base & grains",
  starch: "Base & starches",
  spice: "Spice & seasoning",
  spices: "Spice & seasoning",
  seasoning: "Spice & seasoning",
  liquid: "Oils & liquids",
  liquids: "Oils & liquids",
  oil: "Oils & liquids",
  oils: "Oils & liquids",
  dairy: "Dairy",
  garnish: "Garnish & herbs",
  herbs: "Garnish & herbs",
  other: "Other ingredients",
};

/** Pull every recipe from the latest generated plan stored in sessionStorage */
function getPlanRecipes(): Recipe[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem("latest_plan");
    if (!raw) return [];
    const plan = JSON.parse(raw);
    if (!plan?.days) return [];
    return plan.days.flatMap(
      (day: { meals?: { recipe: Recipe }[] }) => (day.meals ?? []).map((m) => m.recipe)
    );
  } catch {
    return [];
  }
}

/** Get the plan's duration from sessionStorage for scaling */
function getPlanDuration(): number {
  if (typeof window === "undefined") return 1;
  try {
    const raw = sessionStorage.getItem("latest_plan");
    if (!raw) return 1;
    const plan = JSON.parse(raw);
    return plan?.durationDays ?? 1;
  } catch {
    return 1;
  }
}

/**
 * Step callout. Each kind carries its own icon and label, so the meaning does
 * not depend on the border colour alone.
 */
function Callout({
  kind,
  children,
}: {
  kind: "warning" | "tip" | "optional";
  children: React.ReactNode;
}) {
  const config = {
    warning: {
      icon: AlertTriangle,
      label: "Watch out",
      classes: "border-danger/25 bg-danger-wash",
      accent: "border-l-danger",
      ink: "text-danger",
    },
    tip: {
      icon: Lightbulb,
      label: "Tip",
      classes: "border-herb-edge bg-herb-wash",
      accent: "border-l-herb",
      ink: "text-herb-ink",
    },
    optional: {
      icon: Sparkles,
      label: "Optional upgrade",
      classes: "border-ember/20 bg-ember-wash",
      accent: "border-l-ember",
      ink: "text-ember-ink",
    },
  }[kind];

  const Icon = config.icon;

  return (
    <div
      className={`flex gap-3 rounded-sm border border-l-[3px] p-4 ${config.classes} ${config.accent}`}
    >
      <Icon aria-hidden="true" className={`mt-0.5 h-4 w-4 shrink-0 ${config.ink}`} />
      <div className="min-w-0">
        <p className={`kicker mb-1 text-[9px] ${config.ink}`}>{config.label}</p>
        <p className="text-sm leading-relaxed text-ink-soft">{children}</p>
      </div>
    </div>
  );
}

export default function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const reduce = useReducedMotion();

  // First try mock recipes, then sessionStorage plan recipes
  const [recipe, setRecipe] = useState<Recipe | null>(
    () => mockRecipes.find((r) => r.id === id) ?? null
  );
  const [loaded, setLoaded] = useState(!!recipe);
  const [servingMultiplier, setServingMultiplier] = useState(1);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  useEffect(() => {
    // eslint-disable-next-line
    if (recipe) { setLoaded(true); return; }
    // Recipe not in mocks — search the latest generated plan
    const planRecipe = getPlanRecipes().find((r) => r.id === id);

    if (planRecipe) setRecipe(planRecipe);

    setLoaded(true);
  }, [id, recipe]);

  // Initialize multiplier from plan duration
  useEffect(() => {
    const duration = getPlanDuration();
    // eslint-disable-next-line
    if (duration > 1) setServingMultiplier(duration);
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001,
  });

  if (!loaded) return null;
  if (!recipe) notFound();

  const toggleItem = (key: string) =>
    setCheckedItems((prev) =>
      prev.includes(key) ? prev.filter((i) => i !== key) : [...prev, key]
    );

  const ingredientGroups = recipe.ingredients.reduce(
    (acc, ing) => {
      (acc[ing.section] ??= []).push(ing);
      return acc;
    },
    {} as Record<string, typeof recipe.ingredients>
  );

  /** Scale a quantity string by the multiplier */
  function scaleQty(qty: string): string {
    const num = parseFloat(qty);
    if (isNaN(num)) return qty;
    const scaled = num * servingMultiplier;
    return scaled % 1 === 0 ? String(scaled) : scaled.toFixed(1);
  }

  const totalTime = recipe.prepMinutes + recipe.cookMinutes;

  return (
    <>
      {/* Reading progress */}
      <motion.div
        style={{ scaleX, transformOrigin: "0%" }}
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px] bg-terracotta"
      />

      <motion.div
        variants={reduce ? undefined : containerVariants}
        initial={reduce ? undefined : "hidden"}
        animate={reduce ? undefined : "visible"}
      >
        <motion.div variants={itemVariants} className="mb-10">
          <button
            type="button"
            onClick={() => router.back()}
            className="kicker inline-flex min-h-11 cursor-pointer items-center gap-2 text-[10px] text-ink-faint transition-colors hover:text-terracotta"
          >
            <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
            Back
          </button>
        </motion.div>

        {/* ── Hero ────────────────────────────────────────────────────── */}
        <section className="mb-20 grid items-start gap-10 lg:mb-28 lg:grid-cols-2 lg:gap-16">
          <motion.div variants={itemVariants}>
            <p className="kicker mb-6 text-[10px] text-terracotta">Recipe</p>

            <h1 className="display mb-4 text-4xl text-ink sm:text-5xl lg:text-6xl">
              {recipe.title}
            </h1>

            {recipe.subtitle && (
              <p className="mb-10 text-lg leading-relaxed text-ink-soft">{recipe.subtitle}</p>
            )}

            {/* Timing */}
            <dl className="grid grid-cols-3 gap-6 border-t border-line pt-6">
              {[
                { label: "Active", value: `${recipe.prepMinutes}m` },
                { label: "Total", value: `${totalTime}m` },
                { label: "Yield", value: `${recipe.servings} srv` },
              ].map((m) => (
                <div key={m.label}>
                  <dt className="kicker mb-1.5 text-[9px] text-ink-faint">{m.label}</dt>
                  <dd className="numeric text-2xl font-semibold text-ink">{m.value}</dd>
                </div>
              ))}
            </dl>

            {/* Macros */}
            <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-6">
              {[
                { label: "Energy", value: `${recipe.kcal}`, unit: "kcal" },
                { label: "Protein", value: `${recipe.proteinG}`, unit: "g" },
                { label: "Carbs", value: `${recipe.carbsG}`, unit: "g" },
                { label: "Fat", value: `${recipe.fatG}`, unit: "g" },
              ].map((m) => (
                <div key={m.label}>
                  <dt className="kicker mb-1 text-[9px] text-ink-faint">{m.label} / srv</dt>
                  <dd className="numeric text-base text-ink">
                    {m.value}
                    <span className="ml-0.5 text-xs text-ink-faint">{m.unit}</span>
                  </dd>
                </div>
              ))}
            </dl>

            {recipe.tags.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-2">
                {recipe.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-pill border border-line-strong bg-surface px-3 py-1 text-xs text-ink-soft"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="relative">
            <div className="card relative aspect-[4/5] overflow-hidden p-0 md:aspect-[4/5]">
              <Image
                src={smartRecipeImage(recipe.imageQuery, IMAGE_SIZES.hero)}
                alt={recipe.imageAlt}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {recipe.cuisines.length > 0 && (
                <ul className="absolute bottom-5 left-5 flex flex-wrap gap-2">
                  {recipe.cuisines.map((c) => (
                    <li
                      key={c}
                      className="kicker rounded-pill bg-paper/90 px-3 py-1.5 text-[9px] text-ink backdrop-blur-sm"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </section>

        {/* ── Manifest + Ritual ───────────────────────────────────────── */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Manifest */}
          <motion.aside
            variants={itemVariants}
            aria-labelledby="manifest-heading"
            className="self-start lg:col-span-4 lg:sticky lg:top-28"
          >
            <div className="card overflow-hidden">
              <div className="border-b border-line bg-surface-muted p-6">
                <h2 id="manifest-heading" className="font-headline text-2xl text-ink">
                  The manifest
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-ink-faint">
                  Tick items off as you prep.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <span className="kicker inline-flex items-center gap-2 text-[10px] text-ink-soft">
                    <Users aria-hidden="true" className="h-3.5 w-3.5" />
                    Batch
                  </span>
                  <div role="group" aria-label="Batch multiplier" className="ml-auto flex gap-1">
                    {[1, 2, 3, 4].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setServingMultiplier(n)}
                        aria-pressed={servingMultiplier === n}
                        className={`numeric h-11 w-11 cursor-pointer rounded-sm border text-sm transition-colors ${
                          servingMultiplier === n
                            ? "border-terracotta bg-terracotta-wash text-terracotta"
                            : "border-line bg-surface text-ink-soft hover:border-line-strong hover:text-ink"
                        }`}
                      >
                        {n}×
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-6">
                {Object.keys(ingredientGroups).map((section) => {
                  const items = ingredientGroups[section];
                  if (!items?.length) return null;

                  return (
                    <div key={section}>
                      <h3 className="kicker mb-2 border-b border-line pb-2 text-[9px] text-terracotta">
                        {SECTION_LABELS[section.toLowerCase()] ??
                          section.charAt(0).toUpperCase() + section.slice(1)}
                      </h3>
                      <ul>
                        {items.map((ing) => {
                          const key = `${section}-${ing.name}`;
                          const checked = checkedItems.includes(key);
                          return (
                            <li key={ing.name}>
                              <label className="flex min-h-11 cursor-pointer items-baseline gap-3 border-b border-line py-2.5">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleItem(key)}
                                  className="h-4 w-4 shrink-0 cursor-pointer self-center accent-[var(--herb)]"
                                />
                                <span
                                  className={`wrap-anywhere flex-1 text-sm transition-colors ${
                                    checked ? "text-ink-faint line-through" : "text-ink"
                                  }`}
                                >
                                  {ing.name}
                                </span>
                                <span className="numeric shrink-0 text-[11px] text-ink-soft">
                                  {scaleQty(ing.quantity)}&nbsp;{ing.unit}
                                </span>
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {checkedItems.length > 0 && (
                <div className="flex items-center justify-between gap-3 border-t border-line bg-surface-muted px-6 py-4">
                  <span className="numeric text-xs text-herb-ink">
                    {checkedItems.length}/{recipe.ingredients.length} prepped
                  </span>
                  <button
                    type="button"
                    onClick={() => setCheckedItems([])}
                    className="kicker min-h-9 cursor-pointer rounded-pill px-3 text-[10px] text-ink-faint transition-colors hover:bg-surface hover:text-ink"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>
          </motion.aside>

          {/* Ritual */}
          <div className="lg:col-span-8">
            <motion.h2
              variants={itemVariants}
              className="kicker mb-10 text-[10px] text-terracotta"
            >
              The ritual
            </motion.h2>

            <ol className="space-y-12">
              {recipe.ritual.map((step) => (
                <motion.li
                  key={step.stepNumber}
                  variants={itemVariants}
                  className="flex gap-5 border-b border-line pb-12 last:border-b-0 last:pb-0 sm:gap-8"
                >
                  <span
                    aria-hidden="true"
                    className="numeric shrink-0 text-4xl font-semibold leading-none text-line-strong sm:text-6xl"
                  >
                    {String(step.stepNumber).padStart(2, "0")}
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3 className="mb-3 font-headline text-2xl leading-tight text-ink">
                      {step.title}
                    </h3>
                    <p className="text-lg leading-relaxed text-ink-soft">{step.instruction}</p>

                    {step.durationMinutes && (
                      <p className="kicker mt-4 inline-flex items-center gap-2 rounded-pill bg-surface-muted px-3 py-1.5 text-[10px] text-ink-soft">
                        <Clock aria-hidden="true" className="h-3 w-3" />
                        {step.durationMinutes} min
                      </p>
                    )}

                    <div className="mt-5 space-y-3">
                      {step.warning && <Callout kind="warning">{step.warning}</Callout>}
                      {step.tip && <Callout kind="tip">{step.tip}</Callout>}
                      {step.optional && <Callout kind="optional">{step.optional}</Callout>}
                    </div>
                  </div>
                </motion.li>
              ))}
            </ol>

            {recipe.curatorNote && (
              <motion.figure
                variants={itemVariants}
                className="card mt-14 border-l-[3px] border-l-terracotta p-8"
              >
                <figcaption className="kicker mb-4 flex items-center gap-2 text-[10px] text-terracotta">
                  <Flame aria-hidden="true" className="h-3.5 w-3.5" />
                  Curator&apos;s note
                </figcaption>
                <blockquote className="font-headline text-2xl leading-snug text-ink">
                  {recipe.curatorNote}
                </blockquote>
              </motion.figure>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
