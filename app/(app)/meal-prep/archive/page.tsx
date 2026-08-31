"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Plus, ArrowRight, ArrowLeft } from "lucide-react";
import Kicker from "@/components/shared/Kicker";
import StatusBadge from "@/components/shared/StatusBadge";
import { LoadingState, EmptyState } from "@/components/shared/StateComponents";
import { listPlans } from "@/lib/plans";
import { ArchivedPlan } from "@/types/mealPlan";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/** Map a plan goal onto a semantic badge variant. */
function goalVariant(goal: string) {
  if (goal === "cut") return "deficit" as const;
  if (goal === "bulk") return "surplus" as const;
  return "maintenance" as const;
}

function formatDateRange(iso: string, durationDays: number): string {
  const start = new Date(iso);
  const end = new Date(start);
  end.setDate(start.getDate() + durationDays - 1);
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(start)} – ${fmt(end)}`;
}

export default function ArchivePage() {
  const [plans, setPlans] = useState<ArchivedPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const reduce = useReducedMotion();

  useEffect(() => {
    listPlans()
      .then(setPlans)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const activePlan = plans[0] ?? null;
  const previousPlans = plans.slice(1);

  return (
    <motion.div
      variants={reduce ? undefined : containerVariants}
      initial={reduce ? undefined : "hidden"}
      animate={reduce ? undefined : "visible"}
    >
      <Link
        href="/meal-prep/dossier"
        className="kicker mb-8 inline-flex min-h-11 items-center gap-2 text-[10px] text-ink-faint transition-colors hover:text-terracotta"
      >
        <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
        Back to dossier
      </Link>

      <motion.header variants={itemVariants} className="mb-14 max-w-2xl">
        <Kicker numeral="VI" className="mb-5">
          The archive
        </Kicker>
        <h1 className="display mb-4 text-4xl text-ink md:text-5xl">Your past plans.</h1>
        <p className="text-lg leading-relaxed text-ink-soft">
          Pick up where a protocol left off, or start a new one from your dossier.
        </p>
      </motion.header>

      {loading ? (
        <LoadingState message="Opening the ledger…" />
      ) : (
        <div className="grid gap-10 lg:grid-cols-12">
          {/* ── Currently active ──────────────────────────────────────── */}
          <motion.section
            variants={itemVariants}
            aria-labelledby="active-heading"
            className="lg:col-span-5"
          >
            <h2 id="active-heading" className="kicker mb-4 text-[10px] text-terracotta">
              Currently active
            </h2>

            {activePlan ? (
              <div className="card group overflow-hidden">
                <div className="relative h-[220px] overflow-hidden bg-surface-muted">
                  <Image
                    src="https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=800&h=600&q=80"
                    alt=""
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </div>

                <div className="p-6">
                  <h3 className="mb-2 font-headline text-2xl leading-tight text-ink">
                    {activePlan.title}
                  </h3>
                  <p className="numeric mb-5 text-xs text-ink-faint">
                    {formatDateRange(activePlan.createdAt, activePlan.durationDays)}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
                    <StatusBadge variant={goalVariant(activePlan.goal)}>
                      {activePlan.goal}
                    </StatusBadge>
                    <span className="numeric text-xs text-ink-soft">
                      {activePlan.macroTargets.kcal} kcal/day
                    </span>
                  </div>

                  <Link
                    href="/meal-prep/protocol"
                    className="kicker group/link mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-pill bg-terracotta px-5 text-[10px] text-white transition-colors hover:bg-terracotta-deep"
                  >
                    Resume protocol
                    <ArrowRight
                      aria-hidden="true"
                      className="h-3 w-3 transition-transform duration-200 group-hover/link:translate-x-1"
                    />
                  </Link>
                </div>
              </div>
            ) : (
              <EmptyState
                title="No active protocol"
                message="Once you generate a plan from the dossier, it will sit here ready to resume."
              />
            )}
          </motion.section>

          {/* ── Actions and history ───────────────────────────────────── */}
          <motion.div variants={itemVariants} className="lg:col-span-7">
            <Link
              href="/meal-prep/dossier"
              className="card card-interactive group flex items-center gap-5 p-6 hover:border-terracotta-edge"
            >
              <span
                aria-hidden="true"
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-terracotta-wash text-terracotta"
              >
                <Plus className="h-6 w-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-headline text-xl text-ink transition-colors group-hover:text-terracotta">
                  Create a new plan
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-ink-soft">
                  Set your macros and constraints in the dossier, and we will build the week.
                </span>
              </span>
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-ink-faint transition-transform duration-200 group-hover:translate-x-1 group-hover:text-terracotta"
              />
            </Link>

            {previousPlans.length > 0 && (
              <section aria-labelledby="previous-heading" className="mt-12">
                <h2 id="previous-heading" className="kicker mb-4 text-[10px] text-ink-faint">
                  Previous plans
                </h2>

                <ul className="card divide-y divide-line overflow-hidden">
                  {previousPlans.map((plan) => (
                    <li key={plan.id}>
                      <Link
                        href="/meal-prep/protocol"
                        className="group flex flex-wrap items-center gap-x-6 gap-y-2 p-5 transition-colors hover:bg-surface-muted"
                      >
                        <span className="numeric w-28 shrink-0 text-xs text-ink-faint">
                          {formatDateRange(plan.createdAt, plan.durationDays)}
                        </span>
                        <span className="min-w-0 flex-1 font-headline text-lg text-ink transition-colors group-hover:text-terracotta">
                          {plan.title}
                        </span>
                        <StatusBadge variant={goalVariant(plan.goal)}>{plan.goal}</StatusBadge>
                        <ArrowRight
                          aria-hidden="true"
                          className="h-4 w-4 shrink-0 text-ink-faint transition-transform duration-200 group-hover:translate-x-1 group-hover:text-terracotta"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <p className="numeric mt-8 border-t border-line pt-5 text-xs text-ink-faint">
              {plans.length} total plan{plans.length !== 1 ? "s" : ""}
            </p>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
