"use client";

import { use, useState, useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { mockRecipes } from "@/lib/mocks/data";
import { smartRecipeImage, IMAGE_SIZES } from "@/lib/images";
import { Clock, ArrowLeft, Users, AlertTriangle, Lightbulb, Sparkles } from "lucide-react";
import type { Recipe } from "@/types/recipe";

// ── Motion constants ───────────────────────────────────────────────────────
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.4, ease: EASE } },
};

// ── Data helpers ───────────────────────────────────────────────────────────
const SECTION_LABELS: Record<string, string> = {
  body:       "Proteins & Produce",
  protein:    "Proteins & Produce",
  proteins:   "Proteins & Produce",
  produce:    "Produce & Vegetables",
  vegetable:  "Vegetables",
  vegetables: "Vegetables",
  base:       "Base & Grains",
  grains:     "Base & Grains",
  grain:      "Base & Grains",
  starch:     "Base & Starches",
  spice:      "Spice & Seasoning",
  spices:     "Spice & Seasoning",
  seasoning:  "Spice & Seasoning",
  liquid:     "Oils & Liquids",
  liquids:    "Oils & Liquids",
  oil:        "Oils & Liquids",
  oils:       "Oils & Liquids",
  dairy:      "Dairy",
  garnish:    "Garnish & Herbs",
  herbs:      "Garnish & Herbs",
  other:      "Other Ingredients",
};

// Accent color for recipe detail — uses the green/forest theme
const ACCENT_HEX = "#00694c";
const ACCENT_SUBTLE = "#004d37";

/** Pull every recipe from the latest generated plan stored in sessionStorage */
function getPlanRecipes(): Recipe[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem("latest_plan");
    if (!raw) return [];
    const plan = JSON.parse(raw);
    if (!plan?.days) return [];
    return plan.days.flatMap(
      (day: { meals?: { recipe: Recipe }[] }) =>
        (day.meals ?? []).map((m) => m.recipe)
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

// ── Page ───────────────────────────────────────────────────────────────────
export default function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const router = useRouter();

  // First try mock recipes, then sessionStorage plan recipes
  const [recipe, setRecipe] = useState<Recipe | null>(
    () => mockRecipes.find((r) => r.id === id) ?? null
  );
  const [loaded, setLoaded] = useState(!!recipe);
  const [servingMultiplier, setServingMultiplier] = useState(1);

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

  const [checkedItems, setCheckedItems] = useState<string[]>([]);

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

  const heroUrl = smartRecipeImage(recipe.imageQuery, IMAGE_SIZES.hero);

  const ingredientGroups = recipe.ingredients.reduce(
    (acc, ing) => {
      if (!acc[ing.section]) acc[ing.section] = [];
      acc[ing.section].push(ing);
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

  return (
    <>
      {/* ── Green ambient scrollbar ─────────────────────────────────── */}
      <motion.div
        style={{ scaleX, transformOrigin: "0%", background: `linear-gradient(90deg, ${ACCENT_HEX}, ${ACCENT_SUBTLE})` }}
        className="fixed top-0 left-0 right-0 h-[2px] z-[100] pointer-events-none"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1440px] mx-auto"
      >

        {/* ── Back ──────────────────────────────────────────────────── */}
        <motion.div variants={itemVariants} className="mb-12">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 kicker text-[10px] text-text-tertiary hover:text-teal transition-colors duration-300 cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" />
            BACK
          </button>
        </motion.div>

        {/* ── Hero: text left + image right ─────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-28 items-start">

          {/* Left — editorial text block */}
          <motion.div variants={itemVariants} className="lg:pt-4">
            <span className="kicker text-[10px] text-teal block mb-10">
              RECIPE DETAIL
            </span>

            <h1 className="font-headline text-5xl md:text-6xl lg:text-7xl leading-[1.0] tracking-tight text-[#F2F0EA] mb-4">
              {recipe.title}
            </h1>

            {recipe.subtitle && (
              <p className="font-headline italic text-xl text-[#9C9A92] leading-snug mb-12">
                {recipe.subtitle}
              </p>
            )}

            {/* Meta row */}
            <div className="border-t-[0.5px] border-white/20 pt-8 mt-8 grid grid-cols-3 gap-8">
              <div>
                <span className="kicker text-[9px] text-[#9C9A92] block mb-2">
                  ACTIVE TIME
                </span>
                <span className="font-headline italic text-2xl text-[#F2F0EA]">
                  {recipe.prepMinutes}m
                </span>
              </div>
              <div>
                <span className="kicker text-[9px] text-[#9C9A92] block mb-2">
                  TOTAL TIME
                </span>
                <span className="font-headline italic text-2xl text-[#F2F0EA]">
                  {recipe.prepMinutes + recipe.cookMinutes}m
                </span>
              </div>
              <div>
                <span className="kicker text-[9px] text-[#9C9A92] block mb-2">
                  YIELD
                </span>
                <span className="font-headline italic text-2xl text-[#F2F0EA]">
                  {recipe.servings}&nbsp;srv
                </span>
              </div>
            </div>

            {/* Energy + macros */}
            <div className="border-t-[0.5px] border-white/20 pt-6 mt-6 flex gap-8 flex-wrap">
              {[
                { label: "ENERGY / SRV",  val: `${recipe.kcal} kcal` },
                { label: "PROTEIN / SRV", val: `${recipe.proteinG}g` },
                { label: "CARBS / SRV",   val: `${recipe.carbsG}g` },
                { label: "FAT / SRV",     val: `${recipe.fatG}g` },
              ].map((m) => (
                <div key={m.label}>
                  <span className="kicker text-[9px] text-[#9C9A92] block mb-1">
                    {m.label}
                  </span>
                  <span className="font-label text-sm text-[#F2F0EA]">{m.val}</span>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="mt-8 flex flex-wrap gap-2">
              {recipe.tags.map((tag) => (
                <span
                  key={tag}
                  className="kicker text-[9px] text-[#9C9A92] border-[0.5px] border-white/20 px-3 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right — cinematic image that properly fills the frame */}
          <motion.div variants={itemVariants} className="relative">
            {/* Decorative offset box with green accent */}
            <div
              className="absolute inset-0 translate-x-4 translate-y-4 -z-10"
              style={{ background: ACCENT_SUBTLE, opacity: 0.3 }}
            />

            <div className="overflow-hidden w-full aspect-[3/4] md:aspect-[4/5] relative z-10">
              <motion.img
                src={heroUrl}
                alt={recipe.imageAlt}
                className="w-full h-full object-cover"
                style={{ objectPosition: "center center" }}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 2, ease: EASE }}
              />
              {/* Bottom readability scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#151514]/60 via-transparent to-transparent pointer-events-none" />

              {/* Floating cuisine badge */}
              {recipe.cuisines.length > 0 && (
                <div className="absolute bottom-6 left-6 flex gap-2">
                  {recipe.cuisines.map((c) => (
                    <span
                      key={c}
                      className="kicker text-[9px] bg-black/60 backdrop-blur-sm text-white/90 px-3 py-1.5 border border-white/10"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

        </section>

        {/* ── Manifest + Ritual ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">

          {/* ── The Manifest (sticky left) ─────────────────────────── */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-4 lg:sticky lg:top-32 self-start mb-16 lg:mb-0"
          >
            <div
              className="bg-[#1a1a19] p-8"
              style={{ borderLeft: `2px solid ${ACCENT_HEX}`, borderTop: "0.5px solid rgba(255,255,255,0.2)" }}
            >
              <h2 className="font-headline text-3xl text-teal mb-2">
                The Manifest
              </h2>
              <p className="font-body text-xs text-[#9C9A92] mb-4 leading-relaxed">
                Tap to cross off as you prep. Quantities shown per serving.
              </p>

              {/* Serving multiplier */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <Users className="w-4 h-4 text-teal" />
                <span className="font-mono text-[10px] text-[#9C9A92] tracking-wider">SERVINGS</span>
                <div className="flex items-center gap-1 ml-auto">
                  {[1, 2, 3, 4].map((n) => (
                    <button
                      key={n}
                      onClick={() => setServingMultiplier(n)}
                      className={`w-8 h-8 font-mono text-sm transition-colors cursor-pointer border ${
                        servingMultiplier === n
                          ? "bg-teal/15 border-teal/40 text-teal"
                          : "border-white/10 text-[#9C9A92] hover:border-white/20 hover:text-text-primary"
                      }`}
                    >
                      {n}×
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-7">
                {Object.keys(ingredientGroups).map((section) => {
                  const items = ingredientGroups[section];
                  if (!items?.length) return null;
                  return (
                    <div key={section}>
                      <p className="kicker text-[9px] text-teal pb-2 mb-2 border-b-[0.5px] border-white/10">
                        {SECTION_LABELS[section.toLowerCase()] || section.charAt(0).toUpperCase() + section.slice(1)}
                      </p>
                      <div className="space-y-0">
                        {items.map((ing) => {
                          const key = `${section}-${ing.name}`;
                          const checked = checkedItems.includes(key);
                          return (
                            <motion.div
                              key={ing.name}
                              role="button"
                              tabIndex={0}
                              onClick={() => toggleItem(key)}
                              onKeyDown={(e) => e.key === "Enter" && toggleItem(key)}
                              whileHover={{ x: 6, color: "#F2F0EA" }}
                              whileTap={{ scale: 0.98 }}
                              animate={{ opacity: checked ? 0.3 : 1 }}
                              transition={{ duration: 0.4, ease: "easeOut" }}
                              className="flex justify-between items-baseline gap-4 py-3 border-b-[0.5px] border-white/10 cursor-pointer group outline-none"
                            >
                              <span
                                className={`font-body text-sm transition-colors duration-200 ${
                                  checked
                                    ? "line-through text-[#9C9A92]"
                                    : "text-[#e6e6e6]"
                                }`}
                              >
                                {ing.name}
                              </span>
                              <span className="font-mono text-[11px] text-[#9C9A92] shrink-0 tabular-nums">
                                {scaleQty(ing.quantity)}&nbsp;{ing.unit}
                              </span>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Progress counter */}
              <AnimatePresence>
                {checkedItems.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center justify-between mt-6 pt-4 border-t-[0.5px] border-white/20">
                      <span className="kicker text-[10px] text-teal">
                        {checkedItems.length}/{recipe.ingredients.length} PREPPED
                      </span>
                      <button
                        onClick={() => setCheckedItems([])}
                        className="kicker text-[10px] text-[#9C9A92] hover:text-[#F2F0EA] transition-colors cursor-pointer"
                      >
                        RESET
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ── The Ritual (right) ─────────────────────────────────── */}
          <div className="lg:col-span-8 lg:pl-20 space-y-0">
            <motion.span
              variants={itemVariants}
              className="kicker text-[10px] text-teal block mb-16"
            >
              THE RITUAL
            </motion.span>

            {recipe.ritual.map((step) => (
              <motion.div
                key={step.stepNumber}
                variants={itemVariants}
                className="flex gap-10 pb-16 border-b-[0.5px] border-white/10 last:border-b-0 last:pb-0 mb-16 last:mb-0"
              >
                {/* Magnetic number */}
                <motion.div
                  whileHover={{ x: 8, color: ACCENT_HEX }}
                  transition={{ duration: 0.8, ease: EASE }}
                  className="shrink-0 pt-1"
                  style={{ color: "#2a2a28" }}
                >
                  <span className="font-headline text-7xl leading-none select-none">
                    {String(step.stepNumber).padStart(2, "0")}
                  </span>
                </motion.div>

                {/* Step content */}
                <div className="pt-3 flex-1">
                  <h3 className="font-headline text-2xl text-[#F2F0EA] mb-4 leading-tight">
                    {step.title}
                  </h3>
                  <p className="font-body text-lg text-[#9C9A92] leading-[1.8]">
                    {step.instruction}
                  </p>
                  {step.durationMinutes && (
                    <div className="flex items-center gap-2 mt-5">
                      <Clock className="w-3 h-3 text-teal" />
                      <span className="kicker text-[10px] text-[#9C9A92]">
                        {step.durationMinutes} MIN
                      </span>
                    </div>
                  )}

                  {/* ── Beginner-friendly callouts ──────────────────── */}
                  <div className="mt-5 space-y-3">
                    {step.warning && (
                      <div
                        className="flex gap-3 p-4"
                        style={{
                          background: "rgba(217, 79, 79, 0.06)",
                          borderLeft: "2px solid #D94F4F",
                          border: "0.5px solid rgba(217, 79, 79, 0.15)",
                          borderLeftWidth: "2px",
                          borderLeftColor: "#D94F4F",
                        }}
                      >
                        <AlertTriangle className="w-4 h-4 text-[#D94F4F] shrink-0 mt-0.5" />
                        <div>
                          <span className="kicker text-[9px] text-[#D94F4F] block mb-1">WARNING</span>
                          <p className="font-body text-sm text-[#c9a9a9] leading-relaxed">
                            {step.warning}
                          </p>
                        </div>
                      </div>
                    )}

                    {step.tip && (
                      <div
                        className="flex gap-3 p-4"
                        style={{
                          background: "rgba(0, 105, 76, 0.06)",
                          borderLeft: "2px solid var(--forest)",
                          border: "0.5px solid rgba(0, 105, 76, 0.15)",
                          borderLeftWidth: "2px",
                          borderLeftColor: "var(--forest)",
                        }}
                      >
                        <Lightbulb className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                        <div>
                          <span className="kicker text-[9px] text-teal block mb-1">TIP</span>
                          <p className="font-body text-sm text-[#9C9A92] leading-relaxed">
                            {step.tip}
                          </p>
                        </div>
                      </div>
                    )}

                    {step.optional && (
                      <div
                        className="flex gap-3 p-4"
                        style={{
                          background: "rgba(239, 159, 39, 0.05)",
                          borderLeft: "2px solid #EF9F27",
                          border: "0.5px solid rgba(239, 159, 39, 0.12)",
                          borderLeftWidth: "2px",
                          borderLeftColor: "#EF9F27",
                        }}
                      >
                        <Sparkles className="w-4 h-4 text-[#EF9F27] shrink-0 mt-0.5" />
                        <div>
                          <span className="kicker text-[9px] text-[#EF9F27] block mb-1">OPTIONAL UPGRADE</span>
                          <p className="font-body text-sm text-[#b5a080] leading-relaxed">
                            {step.optional}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Curator's note */}
            {recipe.curatorNote && (
              <motion.div variants={itemVariants} className="mt-16 pt-16 border-t-[0.5px] border-white/10">
                <span className="kicker text-[10px] text-teal block mb-6">
                  CURATOR&apos;S NOTE
                </span>
                <div
                  className="bg-[#1a1a19] p-10"
                  style={{
                    border: "0.5px solid rgba(255,255,255,0.12)",
                    borderLeft: `2px solid ${ACCENT_HEX}`,
                  }}
                >
                  <p className="font-headline italic text-2xl text-[#F2F0EA] leading-snug">
                    &ldquo;{recipe.curatorNote}&rdquo;
                  </p>
                </div>
              </motion.div>
            )}
          </div>

        </div>
      </motion.div>
    </>
  );
}
