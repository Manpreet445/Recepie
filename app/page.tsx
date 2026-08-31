"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import HomeNav from "@/components/nav/HomeNav";
import MarketingFooter from "@/components/footer/MarketingFooter";
import { CoverFlowCarousel, type CarouselItem } from "@/components/ui/3-d-coverflow-carousel";
import { mockRecipes } from "@/lib/mocks/data";
import { smartRecipeImage } from "@/lib/images";
import {
  ArrowRight,
  Carrot,
  ChefHat,
  ListChecks,
  Sparkles,
} from "lucide-react";

/** Portrait crop — the coverflow cards are tall, so a landscape source crops badly. */
const COVER_SIZE = [800, 1160] as [number, number];

const SEASONAL = ["Fig", "Sage", "Pumpkin", "Quince", "Walnut", "Chestnut", "Leek"];

/** What the hero's demo pantry holds, and what it resolves to. */
const PANTRY_CHIPS = ["chickpeas", "harissa", "lemon", "chicken thigh", "yoghurt", "cumin"];

const STEPS = [
  {
    icon: Carrot,
    title: "Tell us what you have",
    body: "Type the six things actually sitting in your fridge. No barcode scanning, no full inventory.",
  },
  {
    icon: Sparkles,
    title: "Get matched, not guessed",
    body: "We rank real recipes by how much of your shelf they already use, and name what is missing.",
  },
  {
    icon: ListChecks,
    title: "Shop one short list",
    body: "Every gap across the week is consolidated into a single list, summed by ingredient.",
  },
];

export default function HomePage() {
  const reduce = useReducedMotion();

  /** Real recipes from the collection, shaped for the coverflow. */
  const featured: CarouselItem[] = useMemo(
    () =>
      mockRecipes.map((r) => ({
        tag: r.tags[0] ? `#${r.tags[0].replace(/\s+/g, "")}` : undefined,
        titleLine1: r.title,
        titleLine2: r.cuisines[0],
        desc: r.subtitle ?? r.curatorNote,
        img: smartRecipeImage(r.imageQuery, COVER_SIZE),
        imgAlt: r.imageAlt,
        ctaText: "View recipe",
        ctaUrl: `/recipe/${r.id}`,
      })),
    []
  );

  /** Entrance offsets collapse to zero when reduced motion is requested. */
  const rise = (delay: number) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } }
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay },
        };

  return (
    <>
      <HomeNav />

      <main id="main" className="flex-1">
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pt-32 pb-20 md:px-8 lg:grid-cols-12 lg:gap-16 lg:pt-40 lg:pb-28">
            <motion.div className="lg:col-span-6" {...rise(0.05)}>
              <span className="kicker mb-6 inline-flex items-center gap-2 rounded-pill bg-herb-wash px-3 py-1.5 text-[10px] text-herb-ink">
                <Carrot aria-hidden="true" className="h-3.5 w-3.5" />
                Pantry-first meal planning
              </span>

              <h1 className="display mb-6 text-5xl text-ink sm:text-6xl lg:text-7xl">
                Cook what you
                <br />
                <span className="text-terracotta">already have.</span>
              </h1>

              <p className="mb-9 max-w-lg text-lg leading-relaxed text-ink-soft">
                Most meal planners hand you a shopping list for food you do not own. Recepie
                starts at the other end — your shelf — and builds the week outward from it.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/pantry"
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-pill bg-terracotta px-7 text-sm font-medium text-white transition-colors hover:bg-terracotta-deep"
                >
                  Start with my pantry
                  <ArrowRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
                <Link
                  href="/meal-prep/dossier"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-pill border border-line-strong bg-surface px-7 text-sm font-medium text-ink transition-colors hover:border-terracotta-edge hover:text-terracotta"
                >
                  Generate a full week
                </Link>
              </div>

              <p className="numeric mt-5 text-xs text-ink-faint">
                No account needed · Runs in guest mode
              </p>
            </motion.div>

            {/* The product's actual mechanic, shown rather than described. */}
            <motion.div className="lg:col-span-6" {...rise(0.2)}>
              <div className="card overflow-hidden shadow-lg">
                <div className="flex items-center justify-between border-b border-line bg-surface-muted px-5 py-3">
                  <span className="kicker text-[10px] text-ink-faint">Your shelf</span>
                  <span className="numeric text-[10px] text-ink-faint">
                    {PANTRY_CHIPS.length} items
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 p-5">
                  {PANTRY_CHIPS.map((chip, i) => (
                    <motion.span
                      key={chip}
                      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.32, delay: 0.45 + i * 0.05 }}
                      className="rounded-pill border border-line-strong bg-paper px-3 py-1.5 text-sm text-ink-soft"
                    >
                      {chip}
                    </motion.span>
                  ))}
                </div>

                <div className="flex items-center gap-2 border-y border-line bg-herb-wash px-5 py-2.5">
                  <ChefHat aria-hidden="true" className="h-3.5 w-3.5 text-herb-ink" />
                  <span className="kicker text-[10px] text-herb-ink">
                    5 of 6 matched — 1 recipe found
                  </span>
                </div>

                <div className="flex gap-4 p-5">
                  <div className="relative h-[92px] w-[124px] shrink-0 overflow-hidden rounded-sm bg-surface-muted">
                    <Image
                      src="https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=400&h=300&q=80"
                      alt="Harissa roasted chicken thighs with chickpeas"
                      fill
                      className="object-cover"
                      sizes="124px"
                      priority
                    />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-headline text-lg leading-snug text-ink">
                      Harissa chicken &amp; chickpeas
                    </h2>
                    <p className="numeric mt-1 text-[11px] text-ink-faint">
                      45m · 612 kcal · 48g protein
                    </p>
                    <p className="kicker mt-2 inline-flex rounded-pill bg-ember-wash px-2 py-0.5 text-[9px] text-ember-ink">
                      Missing: labneh
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── In season ─────────────────────────────────────────────────── */}
        <section aria-labelledby="season-heading" className="border-y border-line bg-paper-deep">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:px-8">
            <h2 id="season-heading" className="kicker shrink-0 text-[10px] text-terracotta">
              In season now
            </h2>
            <ul className="flex flex-wrap gap-2">
              {SEASONAL.map((item) => (
                <li
                  key={item}
                  className="rounded-pill border border-line-strong bg-surface px-3 py-1 text-sm text-ink-soft"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── How it works ──────────────────────────────────────────────── */}
        <section aria-labelledby="how-heading" className="mx-auto max-w-7xl px-4 py-24 md:px-8">
          <h2 id="how-heading" className="display mb-3 max-w-2xl text-4xl text-ink md:text-5xl">
            Three steps, one shopping trip.
          </h2>
          <p className="mb-14 max-w-xl text-lg text-ink-soft">
            The whole loop takes about four minutes on a Sunday evening.
          </p>

          <ol className="grid gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title} className="card relative p-7">
                <span
                  aria-hidden="true"
                  className="numeric absolute right-6 top-6 text-4xl font-semibold text-line-strong"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  aria-hidden="true"
                  className="mb-6 flex h-12 w-12 items-center justify-center rounded-md bg-terracotta-wash text-terracotta"
                >
                  <step.icon className="h-5 w-5" />
                </span>
                <h3 className="mb-2 font-headline text-xl text-ink">{step.title}</h3>
                <p className="text-sm leading-relaxed text-ink-soft">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Featured recipes ──────────────────────────────────────────── */}
        <CoverFlowCarousel
          items={featured}
          sectionLabel="From the collection"
          autoplayDelay={6000}
        />

        {/* ── Entry points ──────────────────────────────────────────────── */}
        <section
          aria-labelledby="start-heading"
          className="border-t border-line bg-paper-deep"
        >
          <div className="mx-auto max-w-7xl px-4 py-24 md:px-8">
            <h2 id="start-heading" className="display mb-14 text-4xl text-ink md:text-5xl">
              Two ways in.
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  href: "/pantry",
                  eyebrow: "Pantry inventory",
                  title: "Match what is on the shelf",
                  body: "Add ingredients, get ranked recipes with the gaps named up front. Best when you are cooking tonight.",
                  img: "https://images.unsplash.com/photo-1505935428862-770b6f24f629?auto=format&fit=crop&w=800&h=600&q=80",
                  alt: "Jars and dry goods on an open pantry shelf",
                },
                {
                  href: "/meal-prep/dossier",
                  eyebrow: "Meal prep protocol",
                  title: "Design a full week",
                  body: "Set your macros and constraints once. Get a day-by-day plan, a prep order, and one consolidated market list.",
                  img: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=800&h=600&q=80",
                  alt: "Prepared meals portioned into containers",
                },
              ].map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className="card card-interactive group block overflow-hidden"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-surface-muted">
                    <Image
                      src={card.img}
                      alt={card.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="p-7">
                    <p className="kicker mb-2 text-[10px] text-terracotta">{card.eyebrow}</p>
                    <h3 className="mb-2 font-headline text-2xl text-ink transition-colors group-hover:text-terracotta">
                      {card.title}
                    </h3>
                    <p className="mb-5 text-sm leading-relaxed text-ink-soft">{card.body}</p>
                    <span className="kicker inline-flex items-center gap-2 text-[10px] text-terracotta">
                      Open
                      <ArrowRight
                        aria-hidden="true"
                        className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Journal ───────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
          <div className="card grid overflow-hidden md:grid-cols-2">
            <div className="relative min-h-[240px] bg-surface-muted">
              <Image
                src="https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=1000&h=800&q=80"
                alt="Ingredients laid out in preparation for cooking"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="flex flex-col justify-center p-8 md:p-12">
              <p className="kicker mb-4 text-[10px] text-terracotta">From the journal</p>
              <blockquote className="font-headline text-2xl leading-snug text-ink md:text-3xl">
                Mise en place is not a chore before the cooking. It is most of the cooking.
              </blockquote>
              <Link
                href="/journal"
                className="kicker mt-8 inline-flex items-center gap-2 text-[10px] text-terracotta transition-opacity hover:opacity-70"
              >
                Read the journal
                <ArrowRight aria-hidden="true" className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </>
  );
}
