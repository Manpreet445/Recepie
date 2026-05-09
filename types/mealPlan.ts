/** Meal plan, day, and archive types. */

import { Recipe } from "./recipe";
import { MacroTargets } from "./profile";

export interface Meal {
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  recipe: Recipe;
}

export interface PlanDay {
  dayNumber: number;
  meals: Meal[];
  dailyTotals: MacroTargets;
}

export interface MarketListEstimate {
  totalMin: number;
  totalMax: number;
}

export interface MealPlan {
  id: string;
  title: string;
  createdAt: string;
  durationDays: number;
  goal: string;
  macroTargets: MacroTargets;
  days: PlanDay[];
  marketListEstimate?: MarketListEstimate;
}

export interface ArchivedPlan {
  id: string;
  title: string;
  createdAt: string;
  durationDays: number;
  goal: string;
  mealsPerDay: number;
  macroTargets: MacroTargets;
}
