/**
 * POST /api/generate-plan
 *
 * Accepts a user dossier and macro targets, generates an AI-powered meal plan
 * via the Gemini API, and returns the structured result. Falls back to mock
 * data if the AI provider is unavailable.
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { generateMealPlan, buildMealPlanPrompt } from "@/lib/gemini";
import type { DossierInput } from "@/types/profile";

const requestSchema = z.object({
  input: z.object({
    age: z.number().int().min(13).max(120),
    sex: z.enum(["male", "female"]),
    heightCm: z.number().min(50).max(300),
    weightKg: z.number().min(20).max(500),
    activityLevel: z.string(),
    goal: z.string(),
    macroFocus: z.string(),
    dietary: z.array(z.string()),
    allergies: z.string(),
    cuisines: z.array(z.string()),
    budgetMin: z.number().min(0),
    budgetMax: z.number().min(0),
    cadence: z.string(),
    durationDays: z.number().int().min(1).max(14),
    mealsPerDay: z.number().int().min(1).max(6),
  }),
  targets: z.object({
    kcal: z.number().positive(),
    proteinG: z.number().nonnegative(),
    carbsG: z.number().nonnegative(),
    fatG: z.number().nonnegative(),
  }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request payload.", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { input, targets } = parsed.data;
    const prompt = buildMealPlanPrompt(input as DossierInput, targets);

    let plan;
    try {
      plan = await generateMealPlan(prompt);
    } catch (error) {
      console.warn("AI generation failed, using draft protocol fallback:", error);
      // Fallback to mock data so the user isn't stuck with an error.
      const { mockMealPlan } = await import("@/lib/mocks/data");
      plan = {
        ...mockMealPlan,
        title: `Draft Protocol: ${input.goal.toUpperCase()}`,
        goal: input.goal,
        macroTargets: targets,
        durationDays: input.durationDays,
        days: Array.from({ length: input.durationDays }, (_, i) => {
          const mockDay = mockMealPlan.days[i % mockMealPlan.days.length];
          return {
            ...mockDay,
            dayNumber: i + 1,
          };
        }),
      };
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Critical failure in protocol generator:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred. Please try again later.";
    return NextResponse.json(
      { error: "Protocol generation failed.", details: errorMessage },
      { status: 500 },
    );
  }
}
