import { describe, it, expect, vi } from "vitest";
import { buildMealPlanPrompt, generateMealPlan } from "./gemini";
import { DossierInput, MacroTargets } from "@/types/profile";

// mock the google generative ai package
vi.mock("@google/generative-ai", () => {
  class GoogleGenerativeAI {
    getGenerativeModel = vi.fn().mockReturnValue({
      generateContent: vi.fn().mockResolvedValue({
        response: {
          text: () => JSON.stringify({ title: "Test Plan", id: "123" }),
        },
      }),
    });
  }

  return {
    GoogleGenerativeAI,
    SchemaType: {
      OBJECT: "OBJECT",
      STRING: "STRING",
      NUMBER: "NUMBER",
      ARRAY: "ARRAY",
    },
  };
});

process.env.GEMINI_API_KEY = "dummy-key";

describe("gemini lib", () => {
  const mockInput: DossierInput = {
    age: 30,
    sex: "male",
    heightCm: 180,
    weightKg: 80,
    activityLevel: "moderately_active",
    goal: "maintain",
    macroFocus: "balanced",
    dietary: ["Vegan"],
    allergies: "Nuts",
    cuisines: ["Italian"],
    durationDays: 3,
    mealsPerDay: 3,
  };

  const mockTargets: MacroTargets = {
    kcal: 2500,
    proteinG: 150,
    carbsG: 300,
    fatG: 80,
  };

  it("buildMealPlanPrompt should generate a valid prompt string", () => {
    const prompt = buildMealPlanPrompt(mockInput, mockTargets);
    expect(prompt).toContain("Act as a Michelin-star chef");
    expect(prompt).toContain("3-day meal plan");
    expect(prompt).toContain("2500 kcal");
    expect(prompt).toContain("Vegan");
    expect(prompt).toContain("Nuts");
  });

  it("generateMealPlan should return a parsed plan", async () => {
    // Note: this uses the mocked genAI
    const plan = await generateMealPlan("dummy prompt");
    expect(plan).toBeDefined();
    expect(plan.title).toBe("Test Plan");
  });
});
