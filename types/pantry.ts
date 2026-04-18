// pantry search + matching types

import { Recipe } from "./recipe";

export interface PantrySearch {
  ingredients: string[];
  maxTimeMinutes?: number;
  dietary?: string[];
  macroFocus?: string;
}

export interface PantryMatch {
  recipe: Recipe;
  matchedIngredients: string[];
  missingIngredients: string[];
  matchPercentage: number;
}
