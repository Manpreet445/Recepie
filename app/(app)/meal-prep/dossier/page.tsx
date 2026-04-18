"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Kicker from "@/components/shared/Kicker";
import SectionDivider from "@/components/shared/SectionDivider";
import { LoadingState, ErrorState } from "@/components/shared/StateComponents";
import { computeNutritionTargets } from "@/lib/nutrition/tdee";
import { ChevronRight } from "lucide-react";

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
        activityLevel: form.activityLevel as any,
        goal: form.goal as any,
        macroFocus: form.macroFocus as any,
      });

      // 2. Call our bridge API
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: form, targets }),
      });

      if (!response.ok) {
        throw new Error("The kitchen is having some trouble. Please try again.");
      }

      const plan = await response.json();

      // 3. Store in session so the protocol page can pick it up
      sessionStorage.setItem("latest_plan", JSON.stringify(plan));
      
      router.push("/meal-prep/protocol");
    } catch (err: any) {
      setError(err.message);
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
