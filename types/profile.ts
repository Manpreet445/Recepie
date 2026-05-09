/** User profile and dossier form types. */

export type Sex = "male" | "female";

export type ActivityLevel =
  | "sedentary"
  | "lightly_active"
  | "moderately_active"
  | "very_active"
  | "extra_active";

export type Goal = "cut" | "maintain" | "bulk";

export type MacroFocus = "balanced" | "high_protein" | "low_carb";

export type Cadence = "variety" | "4_3_split" | "uniformity";

export interface DossierInput {
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: Goal;
  macroFocus: MacroFocus;
  dietary: string[];
  allergies: string;
  cuisines: string[];
  budgetMin: number;
  budgetMax: number;
  cadence: Cadence;
  durationDays: number;
  mealsPerDay: number;
}

export interface MacroTargets {
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}
