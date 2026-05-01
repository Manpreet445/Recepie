// recipe types — shared between meal plan and pantry features

export interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
  section: "base" | "spice" | "body" | "garnish" | "liquid";
}

export interface RitualStep {
  stepNumber: number;
  title: string;
  instruction: string;
  durationMinutes?: number;
  /** Beginner-friendly warning — things that can go wrong if you're not careful */
  warning?: string;
  /** Helpful tip for home cooks — shortcuts, substitutions, or technique advice */
  tip?: string;
  /** Optional upgrade — something extra you can add to elevate the dish */
  optional?: string;
}

export interface Recipe {
  id: string;
  title: string;
  subtitle?: string;
  prepMinutes: number;
  cookMinutes: number;
  servings: number;
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  ingredients: Ingredient[];
  ritual: RitualStep[];
  curatorNote?: string;
  tags: string[];
  cuisines: string[];
  imageQuery: string;  // short search phrase for finding a matching photo
  imageAlt: string;    // alt text for accessibility
}
