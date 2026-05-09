"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, ArrowRight, ArrowLeft } from "lucide-react";
import { listPlans } from "@/lib/plans";
import { ArchivedPlan } from "@/types/mealPlan";

// ── Motion constants ───────────────────────────────────────────────────────
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: EASE } },
};

const GOAL_COLOR: Record<string, string> = {
  cut:      "#ba1a1a",
  maintain: "#1D9E75",
  bulk:     "#EF9F27",
};

// ── Helpers ────────────────────────────────────────────────────────────────
function formatDateRange(iso: string, durationDays: number): string {
  const start = new Date(iso);
  const end   = new Date(start);
  end.setDate(start.getDate() + durationDays - 1);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "2-digit" }).toUpperCase();
  return `${fmt(start)} — ${fmt(end)}`;
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function ArchivePage() {
  const [plans, setPlans]     = useState<ArchivedPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listPlans()
      .then(setPlans)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const activePlan   = plans[0] ?? null;
  const previousPlans = plans.slice(1);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >

      {/* ── Back ─────────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="mb-8">
        <Link
          href="/meal-prep/dossier"
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-text-tertiary hover:text-teal transition-colors duration-300"
        >
          <ArrowLeft className="w-3 h-3" />
          DOSSIER / BACK
        </Link>
      </motion.div>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="mb-16 pb-12 border-b-[0.5px] border-white/20 text-center"
      >
        <span className="kicker text-[10px] text-teal tracking-[0.2em] block mb-6">
          VI. THE ARCHIVE
        </span>
        <h1 className="font-headline text-5xl md:text-6xl text-text-primary mb-4 leading-tight">
          Your personal ledgers.
        </h1>
        <p className="font-body text-lg text-text-secondary max-w-md mx-auto leading-relaxed">
          Review past protocols or initiate a new culinary sequence.
        </p>
      </motion.div>

      {loading ? (
        <motion.div variants={itemVariants} className="text-center py-20">
          <span className="kicker text-[10px] text-text-secondary tracking-[0.2em]">
            LOADING LEDGER…
          </span>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 max-w-[1280px] mx-auto">

          {/* ── Left: Currently Active (col-span-5) ─────────────────── */}
          <motion.div variants={itemVariants} className="lg:col-span-5 group">

            {/* Image card */}
            <div className="relative h-[300px] overflow-hidden border-[0.5px] border-b-0 border-white/20">
              <motion.img
                src="https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?q=80&w=800&auto=format&fit=crop"
                alt="Open notebook on dark surface"
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#151514]/90 via-[#151514]/30 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 p-6 z-10">
                <span className="kicker text-[10px] text-teal block mb-2">
                  CURRENTLY ACTIVE
                </span>
                {activePlan ? (
                  <>
                    <h2 className="font-headline text-3xl text-text-primary leading-tight mb-2">
                      {activePlan.title}
                    </h2>
                    <span className="kicker text-[10px] text-text-secondary">
                      {formatDateRange(activePlan.createdAt, activePlan.durationDays)}
                    </span>
                  </>
                ) : (
                  <h2 className="font-headline text-2xl text-text-secondary leading-tight">
                    No active protocol
                  </h2>
                )}
              </div>
            </div>

            {/* Stats box */}
            <div className="bg-[#1a1a19] border-[0.5px] border-white/20 p-6">
              {activePlan ? (
                <div className="flex justify-between items-center">
                  <span
                    className="border-[0.5px] border-outline-variant px-3 py-1 kicker text-[10px]"
                    style={{ color: GOAL_COLOR[activePlan.goal] ?? "#9C9A92" }}
                  >
                    {activePlan.goal.toUpperCase()}
                  </span>
                  <span className="kicker text-xs text-text-secondary">
                    {activePlan.macroTargets.kcal} KCAL / DAY
                  </span>
                </div>
              ) : (
                <span className="kicker text-[10px] text-text-secondary">
                  Generate your first protocol below.
                </span>
              )}
              <div className="border-t-[0.5px] border-white/20 pt-4 mt-6 flex justify-end">
                <motion.div
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                  className="cursor-pointer"
                >
                  <Link
                    href="/meal-prep/protocol"
                    className="inline-flex items-center gap-2 kicker text-[10px] text-teal"
                  >
                    RESUME PROTOCOL
                    <motion.span
                      variants={{
                        rest:  { x: 0 },
                        hover: { x: 4, transition: { duration: 0.4, ease: EASE } },
                      }}
                    >
                      <ArrowRight className="w-3 h-3" />
                    </motion.span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* ── Right: Actions & History (col-span-7) ───────────────── */}
          <motion.div variants={itemVariants} className="lg:col-span-7">

            {/* Create new plan CTA */}
            <Link href="/meal-prep/dossier">
              <motion.div
                whileHover={{ scale: 0.995, backgroundColor: "#1a1a19" }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="border-[0.5px] border-white/20 p-6 flex items-center gap-6 cursor-pointer group"
              >
                <motion.div
                  whileHover={{ backgroundColor: "rgba(29,158,117,0.08)" }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="border-[0.5px] border-white/20 p-4 shrink-0"
                >
                  <Plus className="w-5 h-5 text-teal" />
                </motion.div>

                <div>
                  <p className="kicker text-xs text-text-primary mb-1">
                    CREATE NEW PLAN
                  </p>
                  <p className="font-body text-sm text-text-secondary leading-relaxed">
                    Generate a new protocol from your dossier. AI-calibrated macros, ritual recipes.
                  </p>
                </div>

                <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-teal ml-auto shrink-0 transition-colors duration-300" />
              </motion.div>
            </Link>

            {/* Previous dossiers */}
            {previousPlans.length > 0 && (
              <div className="mt-16">
                <p className="kicker text-[10px] text-text-secondary mb-6 tracking-[0.2em]">
                  PREVIOUS DOSSIERS
                </p>

                <div>
                  {previousPlans.map((plan) => (
                    <motion.div
                      key={plan.id}
                      initial="rest"
                      whileHover="hover"
                      animate="rest"
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      variants={{
                        rest:  { backgroundColor: "transparent" },
                        hover: { backgroundColor: "rgba(26,26,25,0.5)" },
                      }}
                      className="border-t-[0.5px] border-white/20 py-6 flex justify-between items-center group cursor-pointer last:border-b-[0.5px]"
                    >
                      <Link
                        href="/meal-prep/protocol"
                        className="flex justify-between items-center w-full gap-8"
                      >
                        <span className="kicker text-[10px] text-[#9C9A92] shrink-0 w-28">
                          {formatDateRange(plan.createdAt, plan.durationDays)}
                        </span>

                        <h3 className="font-headline text-2xl text-text-primary flex-1">
                          {plan.title}
                        </h3>

                        <div className="flex items-center gap-8 shrink-0">
                          <span
                            className="kicker text-[10px]"
                            style={{ color: GOAL_COLOR[plan.goal] ?? "#9C9A92" }}
                          >
                            {plan.goal.toUpperCase()}
                          </span>
                          <motion.span
                            variants={{
                              rest:  { x: 0, color: "rgba(255,255,255,0.3)" },
                              hover: { x: 4, color: "#e6e6e6", transition: { duration: 0.4, ease: EASE } },
                            }}
                            className="kicker text-[10px] flex items-center gap-1"
                          >
                            OPEN
                            <ArrowRight className="w-3 h-3 inline" />
                          </motion.span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer meta */}
            <motion.div
              variants={itemVariants}
              className="mt-16 pt-6 border-t-[0.5px] border-white/10 flex items-center justify-between"
            >
              <span className="kicker text-[10px] text-text-secondary">
                {plans.length} TOTAL PROTOCOL{plans.length !== 1 ? "S" : ""}
              </span>
              <span className="kicker text-[10px] text-text-secondary">
                RECEPIE — ISSUE Nº 001
              </span>
            </motion.div>

          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
