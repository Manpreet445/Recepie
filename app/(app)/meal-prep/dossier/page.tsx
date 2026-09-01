"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import Kicker from "@/components/shared/Kicker";
import SectionDivider from "@/components/shared/SectionDivider";
import { LoadingState, ErrorState } from "@/components/shared/StateComponents";
import { computeNutritionTargets } from "@/lib/nutrition/tdee";
import { DossierInput } from "@/types/profile";
import { savePlan } from "@/lib/plans";

const activityLevels = [
  { value: "sedentary", label: "Sedentary", desc: "Little or no exercise" },
  { value: "lightly_active", label: "Light", desc: "1–3 days/week" },
  { value: "moderately_active", label: "Moderate", desc: "3–5 days/week" },
  { value: "very_active", label: "Very active", desc: "6–7 days/week" },
  { value: "extra_active", label: "Extra active", desc: "2× per day" },
];

const goals = [
  { value: "cut", label: "Cut", desc: "Caloric deficit" },
  { value: "maintain", label: "Maintain", desc: "Equilibrium" },
  { value: "bulk", label: "Bulk", desc: "Caloric surplus" },
];

const macroOptions = [
  { value: "balanced", label: "Balanced" },
  { value: "high_protein", label: "High protein" },
  { value: "low_carb", label: "Low carb" },
];

const dietaryOptions = [
  "Vegetarian",
  "Vegan",
  "Pescatarian",
  "Keto",
  "Paleo",
  "Gluten-Free",
  "Dairy-Free",
];

const cuisineOptions = [
  "Italian",
  "Japanese",
  "Mexican",
  "Indian",
  "Mediterranean",
  "Thai",
  "Korean",
  "American",
  "French",
];

const cadenceOptions = [
  { value: "variety", label: "Maximum variety", desc: "No repeats" },
  { value: "4_3_split", label: "4/3 split", desc: "Batch cook twice a week" },
  { value: "uniformity", label: "Uniformity", desc: "Eat the same daily" },
];

/* ── Field primitives ────────────────────────────────────────────────────── */

const inputClass =
  "min-h-11 w-full rounded-sm border border-line-strong bg-surface px-3.5 text-sm text-ink transition-colors placeholder:text-ink-faint focus:border-terracotta focus:outline-none";

function SectionHeading({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <>
      <legend className="kicker text-[10px] text-terracotta">{children}</legend>
      {hint && <p className="mb-4 mt-1.5 text-xs text-ink-faint">{hint}</p>}
    </>
  );
}

/**
 * Radio group built on real inputs — the visual control is the label, so arrow
 * keys and screen-reader semantics come for free rather than being simulated.
 */
function RadioCards({
  name,
  options,
  value,
  onChange,
  columns,
}: {
  name: string;
  options: { value: string; label: string; desc?: string }[];
  value: string;
  onChange: (v: string) => void;
  columns: string;
}) {
  return (
    <div className={`grid gap-3 ${columns}`}>
      {options.map((opt) => {
        const id = `${name}-${opt.value}`;
        const selected = value === opt.value;
        return (
          <div key={opt.value}>
            <input
              type="radio"
              id={id}
              name={name}
              value={opt.value}
              checked={selected}
              onChange={() => onChange(opt.value)}
              className="peer sr-only"
            />
            <label
              htmlFor={id}
              className={`flex min-h-16 cursor-pointer flex-col justify-center rounded-sm border px-4 py-3 transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-terracotta ${
                selected
                  ? "border-terracotta bg-terracotta-wash"
                  : "border-line bg-surface hover:border-line-strong"
              }`}
            >
              <span
                className={`text-sm font-medium ${selected ? "text-terracotta" : "text-ink"}`}
              >
                {opt.label}
              </span>
              {opt.desc && <span className="mt-0.5 text-xs text-ink-faint">{opt.desc}</span>}
            </label>
          </div>
        );
      })}
    </div>
  );
}

/** Multi-select chip. Toggles are buttons with aria-pressed, not radios. */
function ToggleChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex min-h-10 cursor-pointer items-center rounded-pill border px-4 text-sm transition-colors ${
        active
          ? "border-herb-edge bg-herb-wash text-herb-ink"
          : "border-line-strong bg-surface text-ink-soft hover:border-terracotta-edge hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */

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

    cadence: "4_3_split",
    durationDays: 3,
    mealsPerDay: 3,
  });

  const toggleArray = (arr: string[], value: string) =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  /**
   * Targets recompute as the form changes so the numbers are visible before
   * committing to a generation run, rather than only appearing afterwards.
   */
  const targets = useMemo(
    () =>
      computeNutritionTargets({
        age: form.age,
        sex: form.sex,
        heightCm: form.heightCm,
        weightKg: form.weightKg,
        activityLevel: form.activityLevel as DossierInput["activityLevel"],
        goal: form.goal as DossierInput["goal"],
        macroFocus: form.macroFocus as DossierInput["macroFocus"],
      }),
    [
      form.age,
      form.sex,
      form.heightCm,
      form.weightKg,
      form.activityLevel,
      form.goal,
      form.macroFocus,
    ]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);

    try {
      const payload = { ...form };
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: payload, targets }),
      });

      if (!response.ok) {
        throw new Error("The kitchen is having some trouble. Please try again.");
      }

      const plan = await response.json();

      // Keep in sessionStorage so protocol page can read it immediately
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
      <div className="mx-auto max-w-2xl py-20">
        <LoadingState
          variant="spinner"
          message="Calculating macros and drafting your protocol…"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl py-20">
        <ErrorState message={error} onRetry={() => setError(null)} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Kicker numeral="II" className="mb-5">
        The dossier
      </Kicker>
      <h1 className="display mb-4 text-4xl text-ink md:text-5xl">Your nutritional profile.</h1>
      <p className="mb-10 max-w-lg text-lg leading-relaxed text-ink-soft">
        We calculate your targets with the Mifflin&#8209;St Jeor equation, then build a plan
        against them. Everything below has a sensible default — adjust only what matters.
      </p>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* ── Biometrics ────────────────────────────────────────────────── */}
        <fieldset>
          <SectionHeading>Biometrics</SectionHeading>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <label htmlFor="age" className="mb-1.5 block text-xs text-ink-soft">
                Age
              </label>
              <input
                id="age"
                type="number"
                inputMode="numeric"
                min={14}
                max={100}
                value={form.age}
                onChange={(e) => setForm({ ...form, age: +e.target.value })}
                className={`numeric ${inputClass}`}
              />
            </div>
            <div>
              <label htmlFor="sex" className="mb-1.5 block text-xs text-ink-soft">
                Sex
              </label>
              <select
                id="sex"
                value={form.sex}
                onChange={(e) => setForm({ ...form, sex: e.target.value as "male" | "female" })}
                className={inputClass}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label htmlFor="height" className="mb-1.5 block text-xs text-ink-soft">
                Height (cm)
              </label>
              <input
                id="height"
                type="number"
                inputMode="numeric"
                min={120}
                max={230}
                value={form.heightCm}
                onChange={(e) => setForm({ ...form, heightCm: +e.target.value })}
                className={`numeric ${inputClass}`}
              />
            </div>
            <div>
              <label htmlFor="weight" className="mb-1.5 block text-xs text-ink-soft">
                Weight (kg)
              </label>
              <input
                id="weight"
                type="number"
                inputMode="numeric"
                min={35}
                max={250}
                value={form.weightKg}
                onChange={(e) => setForm({ ...form, weightKg: +e.target.value })}
                className={`numeric ${inputClass}`}
              />
            </div>
          </div>
        </fieldset>

        <SectionDivider />

        {/* ── Activity ──────────────────────────────────────────────────── */}
        <fieldset>
          <SectionHeading>Activity level</SectionHeading>
          <div className="mt-4">
            <RadioCards
              name="activity"
              options={activityLevels}
              value={form.activityLevel}
              onChange={(v) => setForm({ ...form, activityLevel: v })}
              columns="grid-cols-2 md:grid-cols-5"
            />
          </div>
        </fieldset>

        {/* ── Goal ──────────────────────────────────────────────────────── */}
        <fieldset>
          <SectionHeading>Goal</SectionHeading>
          <div className="mt-4">
            <RadioCards
              name="goal"
              options={goals}
              value={form.goal}
              onChange={(v) => setForm({ ...form, goal: v })}
              columns="grid-cols-3"
            />
          </div>
        </fieldset>

        {/* ── Macro focus ───────────────────────────────────────────────── */}
        <fieldset>
          <SectionHeading>Macro focus</SectionHeading>
          <div className="mt-4">
            <RadioCards
              name="macro"
              options={macroOptions}
              value={form.macroFocus}
              onChange={(v) => setForm({ ...form, macroFocus: v })}
              columns="grid-cols-3"
            />
          </div>
        </fieldset>

        {/* ── Live targets ──────────────────────────────────────────────── */}
        <section
          aria-live="polite"
          className="card overflow-hidden border-terracotta-edge bg-terracotta-wash"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <h2 className="kicker text-[10px] text-terracotta">Your daily targets</h2>
              <p className="mt-1 text-xs text-ink-soft">
                Updates as you adjust the fields above.
              </p>
            </div>
            <dl className="flex flex-wrap gap-x-6 gap-y-2">
              {[
                ["Energy", `${targets.kcal}`, "kcal"],
                ["Protein", `${targets.proteinG}`, "g"],
                ["Carbs", `${targets.carbsG}`, "g"],
                ["Fat", `${targets.fatG}`, "g"],
              ].map(([label, value, unit]) => (
                <div key={label}>
                  <dt className="kicker text-[9px] text-ink-faint">{label}</dt>
                  <dd className="numeric text-xl font-semibold text-ink">
                    {value}
                    <span className="ml-0.5 text-xs font-normal text-ink-faint">{unit}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <SectionDivider />

        {/* ── Dietary ───────────────────────────────────────────────────── */}
        <fieldset>
          <SectionHeading hint="Select any that apply.">Dietary preferences</SectionHeading>
          <div className="flex flex-wrap gap-2">
            {dietaryOptions.map((d) => (
              <ToggleChip
                key={d}
                active={form.dietary.includes(d)}
                onClick={() => setForm({ ...form, dietary: toggleArray(form.dietary, d) })}
              >
                {d}
              </ToggleChip>
            ))}
          </div>
        </fieldset>

        {/* ── Allergies ─────────────────────────────────────────────────── */}
        <fieldset>
          <SectionHeading>Allergies</SectionHeading>
          <label htmlFor="allergies" className="mb-1.5 mt-4 block text-xs text-ink-soft">
            Ingredients to exclude entirely
          </label>
          <input
            id="allergies"
            type="text"
            placeholder="nuts, shellfish, soy…"
            value={form.allergies}
            onChange={(e) => setForm({ ...form, allergies: e.target.value })}
            aria-describedby="allergies-help"
            className={inputClass}
          />
          <p id="allergies-help" className="mt-2 text-xs text-ink-faint">
            Comma-separated. These are passed through as hard exclusions.
          </p>
        </fieldset>

        {/* ── Cuisines ──────────────────────────────────────────────────── */}
        <fieldset>
          <SectionHeading hint="Leave empty for no preference.">
            Cuisine preferences
          </SectionHeading>
          <div className="flex flex-wrap gap-2">
            {cuisineOptions.map((c) => (
              <ToggleChip
                key={c}
                active={form.cuisines.includes(c)}
                onClick={() => setForm({ ...form, cuisines: toggleArray(form.cuisines, c) })}
              >
                {c}
              </ToggleChip>
            ))}
          </div>
        </fieldset>

        {/* ── Cadence ───────────────────────────────────────────────────── */}
        <fieldset>
          <SectionHeading hint="How often you want to actually cook.">
            Preparation cadence
          </SectionHeading>
          <RadioCards
            name="cadence"
            options={cadenceOptions}
            value={form.cadence}
            onChange={(v) => setForm({ ...form, cadence: v })}
            columns="grid-cols-1 sm:grid-cols-3"
          />
        </fieldset>

        <SectionDivider />

        {/* ── Plan config ───────────────────────────────────────────────── */}
        <fieldset>
          <SectionHeading>Plan configuration</SectionHeading>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="duration" className="mb-1.5 block text-xs text-ink-soft">
                Duration
              </label>
              <select
                id="duration"
                value={form.durationDays}
                onChange={(e) => setForm({ ...form, durationDays: +e.target.value })}
                className={inputClass}
              >
                {[1, 2, 3, 5, 7].map((d) => (
                  <option key={d} value={d}>
                    {d} {d === 1 ? "day" : "days"}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="meals" className="mb-1.5 block text-xs text-ink-soft">
                Meals per day
              </label>
              <select
                id="meals"
                value={form.mealsPerDay}
                onChange={(e) => setForm({ ...form, mealsPerDay: +e.target.value })}
                className={inputClass}
              >
                {[2, 3, 4, 5].map((m) => (
                  <option key={m} value={m}>
                    {m} meals
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        {/* ── Submit ────────────────────────────────────────────────────── */}
        {/* Not sticky: a pinned bar would sit over whichever field has focus
            further up the form, which is exactly what WCAG 2.2 forbids. */}
        <div className="pt-2">
          <button
            type="submit"
            className="group flex min-h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-pill bg-terracotta px-6 py-3.5 text-sm font-medium text-on-terracotta shadow-md transition-colors hover:bg-terracotta-deep"
          >
            Generate protocol
            <ChevronRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
            />
          </button>
        </div>
      </form>
    </div>
  );
}
