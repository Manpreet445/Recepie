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
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should return 400 if input or targets are missing", async () => {
    const request = new Request("http://localhost/api/generate-plan", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("I need both user input and macro targets");
  });

  it("should return 200 and the plan on success", async () => {
    const mockPlan = { id: "plan-123", title: "Gourmet Plan" };
    vi.mocked(generateMealPlan).mockResolvedValue(mockPlan as unknown as MealPlan);

    const request = new Request("http://localhost/api/generate-plan", {
      method: "POST",
      body: JSON.stringify({
        input: { durationDays: 3, goal: "maintain" },
        targets: { kcal: 2000 },
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual(mockPlan);
  });

  it("should return 500 if gemini fails", async () => {
    vi.mocked(generateMealPlan).mockRejectedValue(new Error("AI error"));

    const request = new Request("http://localhost/api/generate-plan", {
      method: "POST",
      body: JSON.stringify({
        input: { durationDays: 3, goal: "maintain" },
        targets: { kcal: 2000 },
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toContain("AI kitchen is currently closed");
  });
});
