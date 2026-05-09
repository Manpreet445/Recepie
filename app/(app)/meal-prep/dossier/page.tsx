"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Kicker from "@/components/shared/Kicker";
import SectionDivider from "@/components/shared/SectionDivider";
import { LoadingState, ErrorState } from "@/components/shared/StateComponents";
import { computeNutritionTargets } from "@/lib/nutrition/tdee";
import { DossierInput } from "@/types/profile";
import { ChevronRight } from "lucide-react";
import { savePlan } from "@/lib/plans";

const activityLevels = [
  { value: "sedentary", label: "Sedentary", desc: "Little or no exercise" },
  { value: "lightly_active", label: "Light", desc: "1–3 days/week" },
  { value: "moderately_active", label: "Moderate", desc: "3–5 days/week" },
  { value: "very_active", label: "Very Active", desc: "6–7 days/week" },
  { value: "extra_active", label: "Extra Active", desc: "2× per day" },
];

const goals = [
  { value: "cut", label: "Cut", desc: "Caloric deficit" },
  { value: "maintain", label: "Maintain", desc: "Equilibrium" },
  { value: "bulk", label: "Bulk", desc: "Caloric surplus" },
];

const macroOptions = [
  { value: "balanced", label: "Balanced" },
  { value: "high_protein", label: "High Protein" },
  { value: "low_carb", label: "Low Carb" },
];

const dietaryOptions = ["Vegetarian", "Vegan", "Pescatarian", "Keto", "Paleo", "Gluten-Free", "Dairy-Free"];
const cuisineOptions = ["Italian", "Japanese", "Mexican", "Indian", "Mediterranean", "Thai", "Korean", "American", "French"];

const cadenceOptions = [
  { value: "variety", label: "MAXIMUM VARIETY", desc: "No repeats" },
  { value: "4_3_split", label: "4/3 SPLIT", desc: "Batch cook twice a week" },
  { value: "uniformity", label: "UNIFORMITY", desc: "Eat the same daily" },
];

export default function DossierPage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    age: 28,
    sex: "male" as "male" | "female",
    heightCm: 178,
    weightKg: 80,
    activityLevel: "moderately_active",
    goal: "maintain",
    macroFocus: "balanced",
    dietary: [] as string[],
    allergies: "",
    cuisines: [] as string[],
    budgetMin: "",
    budgetMax: "",
    cadence: "4_3_split",
    durationDays: 3,
    mealsPerDay: 3,
  });

  const toggleArray = (arr: string[], value: string) =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);

    try {
      // 1. Calculate targets locally so we can tell the AI exactly what we need
      const targets = computeNutritionTargets({
        age: form.age,
        sex: form.sex,
        heightCm: form.heightCm,
        weightKg: form.weightKg,
        activityLevel: form.activityLevel as DossierInput["activityLevel"],
        goal: form.goal as DossierInput["goal"],
        macroFocus: form.macroFocus as DossierInput["macroFocus"],
      });

      // 2. Call our bridge API — parse budget strings to numbers for the backend
      const payload = {
        ...form,
        budgetMin: parseFloat(form.budgetMin) || 0,
        budgetMax: parseFloat(form.budgetMax) || 0,
      };
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: payload, targets }),
      });

      if (!response.ok) {
        throw new Error("The kitchen is having some trouble. Please try again.");
      }

      const plan = await response.json();

      // 3. Keep in sessionStorage so protocol page can read it immediately
      sessionStorage.setItem("latest_plan", JSON.stringify(plan));

      // Persist to Supabase in the background — don't block navigation
      savePlan(plan).catch((err) =>
        console.warn("Could not save plan to Supabase (non-blocking):", err)
      );

      router.push("/meal-prep/protocol");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="max-w-2xl mx-auto py-20">
        <LoadingState 
          variant="spinner" 
          message="Calculating macros and drafting your protocol..." 
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-20">
        <ErrorState 
          message={error} 
          onRetry={() => setError(null)} 
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Kicker numeral="II" className="mb-4">
        THE DOSSIER
      </Kicker>
      <h1 className="font-serif text-3xl md:text-4xl text-text-primary mb-2">
        Your nutritional profile.
      </h1>
      <p className="text-sm text-text-secondary mb-8 max-w-lg">
        Fill in your details below. We&apos;ll calculate your targets using the Mifflin-St Jeor
        equation, then generate a calibrated meal plan.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Biometrics */}
        <section>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-teal mb-4">
            Biometrics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-text-secondary mb-1.5">Age</label>
              <input
                type="number"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: +e.target.value })}
                className="w-full px-3 py-2.5 bg-bg-card border border-border rounded-lg text-sm text-text-primary focus:border-teal/40 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1.5">Sex</label>
              <select
                value={form.sex}
                onChange={(e) => setForm({ ...form, sex: e.target.value as "male" | "female" })}
                className="w-full px-3 py-2.5 bg-bg-card border border-border rounded-lg text-sm text-text-primary focus:border-teal/40 focus:outline-none transition-colors"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1.5">Height (cm)</label>
              <input
                type="number"
                value={form.heightCm}
                onChange={(e) => setForm({ ...form, heightCm: +e.target.value })}
                className="w-full px-3 py-2.5 bg-bg-card border border-border rounded-lg text-sm text-text-primary focus:border-teal/40 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1.5">Weight (kg)</label>
              <input
                type="number"
                value={form.weightKg}
                onChange={(e) => setForm({ ...form, weightKg: +e.target.value })}
                className="w-full px-3 py-2.5 bg-bg-card border border-border rounded-lg text-sm text-text-primary focus:border-teal/40 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* Activity Level */}
        <section>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-teal mb-4">
            Activity Level
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {activityLevels.map((level) => (
              <button
                type="button"
                key={level.value}
                onClick={() => setForm({ ...form, activityLevel: level.value })}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  form.activityLevel === level.value
                    ? "border-teal/40 bg-teal/5 shadow-[0_0_15px_rgba(94,234,212,0.06)]"
                    : "border-border bg-bg-card hover:border-border-strong"
                }`}
              >
                <p className="text-sm text-text-primary font-medium">{level.label}</p>
                <p className="text-[10px] text-text-tertiary mt-0.5">{level.desc}</p>
              </button>
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* Goal */}
        <section>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-teal mb-4">
            Goal
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {goals.map((g) => (
              <button
                type="button"
                key={g.value}
                onClick={() => setForm({ ...form, goal: g.value })}
                className={`p-4 rounded-lg border text-center transition-all cursor-pointer ${
                  form.goal === g.value
                    ? "border-teal/40 bg-teal/5"
                    : "border-border bg-bg-card hover:border-border-strong"
                }`}
              >
                <p className="font-serif text-lg text-text-primary">{g.label}</p>
                <p className="text-[10px] text-text-tertiary mt-0.5">{g.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Macro Focus */}
        <section>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-teal mb-4">
            Macro Focus
          </h2>
          <div className="flex flex-wrap gap-2">
            {macroOptions.map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => setForm({ ...form, macroFocus: opt.value })}
                className={`px-4 py-2 rounded-full border font-mono text-[11px] uppercase tracking-[0.1em] transition-all cursor-pointer ${
                  form.macroFocus === opt.value
                    ? "border-teal/40 bg-teal/10 text-teal"
                    : "border-border text-text-secondary hover:border-border-strong"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* Dietary Preferences */}
        <section>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-teal mb-4">
            Dietary Preferences
          </h2>
          <div className="flex flex-wrap gap-2">
            {dietaryOptions.map((d) => (
              <button
                type="button"
                key={d}
                onClick={() => setForm({ ...form, dietary: toggleArray(form.dietary, d) })}
                className={`px-3 py-1.5 rounded-full border text-xs transition-all cursor-pointer ${
                  form.dietary.includes(d)
                    ? "border-teal/40 bg-teal/10 text-teal"
                    : "border-border text-text-secondary hover:border-border-strong"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </section>

        {/* Allergies */}
        <section>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-teal mb-4">
            Allergies
          </h2>
          <input
            type="text"
            placeholder="e.g., nuts, shellfish, soy..."
            value={form.allergies}
            onChange={(e) => setForm({ ...form, allergies: e.target.value })}
            className="w-full px-4 py-2.5 bg-bg-card border border-border rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:border-teal/40 focus:outline-none transition-colors"
          />
        </section>

        {/* Cuisine preferences */}
        <section>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-teal mb-4">
            Cuisine Preferences
          </h2>
          <div className="flex flex-wrap gap-2">
            {cuisineOptions.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setForm({ ...form, cuisines: toggleArray(form.cuisines, c) })}
                className={`px-3 py-1.5 rounded-full border text-xs transition-all cursor-pointer ${
                  form.cuisines.includes(c)
                    ? "border-amber/40 bg-amber/10 text-amber"
                    : "border-border text-text-secondary hover:border-border-strong"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* Weekly Allocation (Budget Range) */}
        <section>
          <h2 className="font-label text-[10px] uppercase tracking-[0.2em] text-text-tertiary mb-4">
            Weekly Allocation
          </h2>
          <div className="flex items-baseline gap-6">
            <div className="flex-1 border-b-[0.5px] border-white/20 pb-2 flex items-baseline gap-2 transition-colors focus-within:border-teal">
              <span className="font-label text-sm text-text-tertiary">$</span>
              <input
                type="text"
                inputMode="decimal"
                placeholder="MIN"
                value={form.budgetMin}
                onChange={(e) => setForm({ ...form, budgetMin: e.target.value })}
                className="font-body bg-transparent border-none focus:ring-0 focus:outline-none p-0 text-base text-text-primary placeholder:text-text-tertiary w-full"
              />
            </div>
            <span className="font-label text-[10px] uppercase tracking-[0.15em] text-text-tertiary">to</span>
            <div className="flex-1 border-b-[0.5px] border-white/20 pb-2 flex items-baseline gap-2 transition-colors focus-within:border-teal">
              <span className="font-label text-sm text-text-tertiary">$</span>
              <input
                type="text"
                inputMode="decimal"
                placeholder="MAX"
                value={form.budgetMax}
                onChange={(e) => setForm({ ...form, budgetMax: e.target.value })}
                className="font-body bg-transparent border-none focus:ring-0 focus:outline-none p-0 text-base text-text-primary placeholder:text-text-tertiary w-full"
              />
            </div>
          </div>
        </section>

        {/* Preparation Cadence */}
        <section>
          <h2 className="font-label text-[10px] uppercase tracking-[0.2em] text-text-tertiary mb-1">
            Preparation Cadence
          </h2>
          <p className="font-body text-[12px] text-text-secondary mb-3">
            Determine your batch-cooking frequency.
          </p>
          <div className="flex flex-col gap-2">
            {cadenceOptions.map((opt) => (
              <motion.button
                type="button"
                key={opt.value}
                onClick={() => setForm({ ...form, cadence: opt.value })}
                whileHover={{ scale: 0.995 }}
                whileTap={{ scale: 0.98 }}
                className={`font-body w-full text-left p-4 border-[0.5px] rounded-none text-[13px] transition-colors flex justify-between items-center group cursor-pointer ${
                  form.cadence === opt.value
                    ? "bg-bg-card border-teal text-text-primary"
                    : "bg-transparent border-white/20 text-text-secondary hover:border-white/40"
                }`}
              >
                <span>{opt.label}</span>
                <span className={`text-[11px] ${
                  form.cadence === opt.value ? "text-teal" : "text-text-tertiary"
                }`}>
                  {opt.desc}
                </span>
              </motion.button>
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* Plan config */}
        <section>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-teal mb-4">
            Plan Configuration
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-secondary mb-1.5">Duration (days)</label>
              <select
                value={form.durationDays}
                onChange={(e) => setForm({ ...form, durationDays: +e.target.value })}
                className="w-full px-3 py-2.5 bg-bg-card border border-border rounded-lg text-sm text-text-primary focus:border-teal/40 focus:outline-none transition-colors"
              >
                {[1, 2, 3, 5, 7].map((d) => (
                  <option key={d} value={d}>{d} {d === 1 ? "day" : "days"}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1.5">Meals per day</label>
              <select
                value={form.mealsPerDay}
                onChange={(e) => setForm({ ...form, mealsPerDay: +e.target.value })}
                className="w-full px-3 py-2.5 bg-bg-card border border-border rounded-lg text-sm text-text-primary focus:border-teal/40 focus:outline-none transition-colors"
              >
                {[2, 3, 4, 5].map((m) => (
                  <option key={m} value={m}>{m} meals</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Submit */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-teal text-bg-page font-mono text-sm uppercase tracking-[0.1em] rounded-lg hover:bg-teal-subtle transition-colors font-medium cursor-pointer"
        >
          Generate Protocol
          <ChevronRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
