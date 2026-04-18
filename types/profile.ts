// types for the user profile / dossier form

export type Sex = "male" | "female";

export type ActivityLevel =
  | "sedentary"
  | "lightly_active"
  | "moderately_active"
  | "very_active"
  | "extra_active";

export type Goal = "cut" | "maintain" | "bulk";

export type MacroFocus = "balanced" | "high_protein" | "low_carb";

export interface DossierInput {
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: Goal;
  macroFocus: MacroFocus;
  dietaryPreferences: string[];
  allergies: string[];
  cuisinePreferences: string[];
  durationDays: number;
  mealsPerDay: number;
}

export interface MacroTargets {
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}
