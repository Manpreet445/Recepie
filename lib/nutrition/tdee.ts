/**
 * TDEE (Total Daily Energy Expenditure) calculator.
 *
 * Uses the Mifflin-St Jeor equation — the most widely recommended formula
 * for estimating basal metabolic rate in clinical nutrition.
 */

import type { Sex, ActivityLevel, Goal, MacroFocus, MacroTargets } from "@/types/profile";

/** Standard activity multipliers from TDEE reference tables. */
const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
};

/** Caloric adjustments based on user goal. */
const GOAL_ADJUSTMENTS: Record<Goal, number> = {
  cut: -500,
  maintain: 0,
  bulk: 300,
};

/** Macro split ratios (protein / carbs / fat) by focus preference. */
const MACRO_RATIOS: Record<MacroFocus, { protein: number; carbs: number; fat: number }> = {
  balanced: { protein: 0.3, carbs: 0.4, fat: 0.3 },
  high_protein: { protein: 0.4, carbs: 0.35, fat: 0.25 },
  low_carb: { protein: 0.35, carbs: 0.2, fat: 0.45 },
};

/**
 * Calculate Basal Metabolic Rate using Mifflin-St Jeor.
 *
 * Male:   10 × weight(kg) + 6.25 × height(cm) − 5 × age + 5
 * Female: 10 × weight(kg) + 6.25 × height(cm) − 5 × age − 161
 */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: Sex,
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === "male" ? base + 5 : base - 161;
}

/** Multiply BMR by the appropriate activity factor to get TDEE. */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}

/** Apply goal-based caloric adjustment. Floors at 1200 kcal to prevent physiologically unsafe targets. */
export function applyGoalAdjustment(tdee: number, goal: Goal): number {
  return Math.max(1200, tdee + GOAL_ADJUSTMENTS[goal]);
}

/**
 * Convert total daily calories into gram targets for protein, carbs, and fat.
 *
 * Conversion factors: protein & carbs = 4 kcal/g, fat = 9 kcal/g.
 */
export function calculateMacros(
  adjustedKcal: number,
  macroFocus: MacroFocus,
): MacroTargets {
  const ratios = MACRO_RATIOS[macroFocus];

  return {
    kcal: adjustedKcal,
    proteinG: Math.round((adjustedKcal * ratios.protein) / 4),
    carbsG: Math.round((adjustedKcal * ratios.carbs) / 4),
    fatG: Math.round((adjustedKcal * ratios.fat) / 9),
  };
}

/** Full pipeline — takes user biometrics and returns daily macro targets. */
export function computeNutritionTargets(input: {
  weightKg: number;
  heightCm: number;
  age: number;
  sex: Sex;
  activityLevel: ActivityLevel;
  goal: Goal;
  macroFocus: MacroFocus;
}): MacroTargets {
  const bmr = calculateBMR(input.weightKg, input.heightCm, input.age, input.sex);
  const tdee = calculateTDEE(bmr, input.activityLevel);
  const adjusted = applyGoalAdjustment(tdee, input.goal);
  return calculateMacros(adjusted, input.macroFocus);
}
