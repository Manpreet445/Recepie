// setting up the gemini client and the prompt for generating meal plans
// I'm using the official google generative ai package here

import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { DossierInput, MacroTargets } from "@/types/profile";
import { MealPlan } from "@/types/mealPlan";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

// I'm using a strict json schema so gemini always returns exactly what the app expects
// this matches the MealPlan and Recipe types I defined earlier
const mealPlanSchema = {
  description: "A comprehensive meal plan with recipes and nutrition data",
  type: SchemaType.OBJECT,
  properties: {
    id: { type: SchemaType.STRING },
    title: { type: SchemaType.STRING },
    createdAt: { type: SchemaType.STRING },
    durationDays: { type: SchemaType.NUMBER },
    goal: { type: SchemaType.STRING },
    macroTargets: {
      type: SchemaType.OBJECT,
      properties: {
        kcal: { type: SchemaType.NUMBER },
        proteinG: { type: SchemaType.NUMBER },
        carbsG: { type: SchemaType.NUMBER },
        fatG: { type: SchemaType.NUMBER },
      },
      required: ["kcal", "proteinG", "carbsG", "fatG"],
    },
    days: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          dayNumber: { type: SchemaType.NUMBER },
          meals: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                mealType: { type: SchemaType.STRING },
                recipe: {
                  type: SchemaType.OBJECT,
                  properties: {
                    id: { type: SchemaType.STRING },
                    title: { type: SchemaType.STRING },
                    subtitle: { type: SchemaType.STRING },
                    prepMinutes: { type: SchemaType.NUMBER },
                    cookMinutes: { type: SchemaType.NUMBER },
                    servings: { type: SchemaType.NUMBER },
                    kcal: { type: SchemaType.NUMBER },
                    proteinG: { type: SchemaType.NUMBER },
                    carbsG: { type: SchemaType.NUMBER },
                    fatG: { type: SchemaType.NUMBER },
                    ingredients: {
                      type: SchemaType.ARRAY,
                      items: {
                        type: SchemaType.OBJECT,
                        properties: {
                          name: { type: SchemaType.STRING },
                          quantity: { type: SchemaType.STRING },
                          unit: { type: SchemaType.STRING },
                          section: { type: SchemaType.STRING },
                        },
                        required: ["name", "quantity", "unit", "section"],
                      },
                    },
                    ritual: {
                      type: SchemaType.ARRAY,
                      items: {
                        type: SchemaType.OBJECT,
                        properties: {
                          stepNumber: { type: SchemaType.NUMBER },
                          title: { type: SchemaType.STRING },
                          instruction: { type: SchemaType.STRING },
                          durationMinutes: { type: SchemaType.NUMBER },
                        },
                        required: ["stepNumber", "title", "instruction"],
                      },
                    },
                    curatorNote: { type: SchemaType.STRING },
                    tags: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                    cuisines: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                    imageQuery: { type: SchemaType.STRING },
                    imageAlt: { type: SchemaType.STRING },
                  },
                  required: [
                    "id", "title", "prepMinutes", "cookMinutes", "servings",
                    "kcal", "proteinG", "carbsG", "fatG", "ingredients",
                    "ritual", "tags", "cuisines", "imageQuery", "imageAlt"
                  ],
                },
              },
              required: ["mealType", "recipe"],
            },
          },
          dailyTotals: {
            type: SchemaType.OBJECT,
            properties: {
              kcal: { type: SchemaType.NUMBER },
              proteinG: { type: SchemaType.NUMBER },
              carbsG: { type: SchemaType.NUMBER },
              fatG: { type: SchemaType.NUMBER },
            },
            required: ["kcal", "proteinG", "carbsG", "fatG"],
          },
        },
        required: ["dayNumber", "meals", "dailyTotals"],
      },
    },
  },
  required: ["id", "title", "createdAt", "durationDays", "goal", "macroTargets", "days"],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

// I'm using gemini-1.5-flash-latest because it's fast and cheap for this kind of thing
const model = genAI.getGenerativeModel({
  model: "gemini-flash-latest",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: mealPlanSchema,
  },
});

// the main function to generate a plan based on user dossier and target macros
export async function generateMealPlan(prompt: string): Promise<MealPlan> {
  const currentApiKey = process.env.GEMINI_API_KEY;
  if (!currentApiKey) {
    throw new Error("I forgot to set the GEMINI_API_KEY in the environment!");
  }

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text()) as MealPlan;
}

// helper to build the prompt string with all the user's constraints
export function buildMealPlanPrompt(input: DossierInput, targets: MacroTargets) {
  return `
    Act as a Michelin-star chef and clinical nutritionist. 
    Create a ${input.durationDays}-day meal plan with ${input.mealsPerDay} meals per day.
    
    User Profile:
    - Target: ${targets.kcal} kcal per day
    - Macros: ${targets.proteinG}g Protein, ${targets.carbsG}g Carbs, ${targets.fatG}g Fat
    - Goal: ${input.goal}
    - Dietary: ${input.dietary.join(", ") || "No restrictions"}
    - Allergies: ${input.allergies || "None"}
    - Cuisines preferred: ${input.cuisines.join(", ") || "Global"}
    
    Rules for your protocol:
    1. Every recipe must be real, high-quality, and detailed. 
    2. The daily totals across the meals must roughly match the targets (within +/- 5%).
    3. Use "imageQuery" to provide a 2-4 word search term for a photo of the dish (e.g. "shrimp scampi bowl").
    4. Use "imageAlt" for a descriptive accessibility text.
    5. Recipes should be sophisticated but doable in a home kitchen.
    6. Include a "curatorNote" for every recipe explaining why it fits the user's profile.
    7. Ensure diverse ingredients (don't give chicken for every meal).
    
    Generate exactly ${input.durationDays} days of content.
  `;
}
