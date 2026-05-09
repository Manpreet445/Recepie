import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { generateMealPlan } from "@/lib/gemini";
import { MealPlan } from "@/types/mealPlan";

// Mock the gemini lib
vi.mock("@/lib/gemini", () => ({
  generateMealPlan: vi.fn(),
  buildMealPlanPrompt: vi.fn().mockReturnValue("mock prompt"),
}));

describe("POST /api/generate-plan", () => {
  const validPayload = {
    input: {
      age: 30,
      sex: "male",
      heightCm: 180,
      weightKg: 80,
      activityLevel: "sedentary",
      goal: "maintain",
      macroFocus: "balanced",
      dietary: [],
      allergies: "None",
      cuisines: ["Italian"],
      budgetMin: 50,
      budgetMax: 100,
      cadence: "variety",
      durationDays: 3,
      mealsPerDay: 3,
    },
    targets: {
      kcal: 2000,
      proteinG: 150,
      carbsG: 200,
      fatG: 70,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  it("should return 400 if input or targets are missing or invalid", async () => {
    const request = new Request("http://localhost/api/generate-plan", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("Invalid request payload.");
  });

  it("should return 200 and the plan on success", async () => {
    const mockPlan = { id: "plan-123", title: "Gourmet Plan" };
    vi.mocked(generateMealPlan).mockResolvedValue(mockPlan as unknown as MealPlan);

    const request = new Request("http://localhost/api/generate-plan", {
      method: "POST",
      body: JSON.stringify(validPayload),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual(mockPlan);
  });

  it("should fallback to mock data and return 200 if gemini fails", async () => {
    vi.mocked(generateMealPlan).mockRejectedValue(new Error("AI error"));

    const request = new Request("http://localhost/api/generate-plan", {
      method: "POST",
      body: JSON.stringify(validPayload),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.title).toContain("Draft Protocol:");
  });
});
