import { describe, it, expect } from "vitest";
import {
  calculateBMR,
  calculateTDEE,
  applyGoalAdjustment,
  calculateMacros,
  computeNutritionTargets,
} from "./tdee";

describe("calculateBMR", () => {
  it("calculates BMR for male (standard profile)", () => {
    // 10*80 + 6.25*178 - 5*28 + 5 = 800 + 1112.5 - 140 + 5 = 1777.5
    expect(calculateBMR(80, 178, 28, "male")).toBeCloseTo(1777.5);
  });

  it("calculates BMR for female (standard profile)", () => {
    // 10*65 + 6.25*165 - 5*30 - 161 = 650 + 1031.25 - 150 - 161 = 1370.25
    expect(calculateBMR(65, 165, 30, "female")).toBeCloseTo(1370.25);
  });

  it("handles edge case: young lightweight female", () => {
    // 10*50 + 6.25*155 - 5*18 - 161 = 500 + 968.75 - 90 - 161 = 1217.75
    expect(calculateBMR(50, 155, 18, "female")).toBeCloseTo(1217.75);
  });

  it("handles edge case: older heavier male", () => {
    // 10*100 + 6.25*185 - 5*55 + 5 = 1000 + 1156.25 - 275 + 5 = 1886.25
    expect(calculateBMR(100, 185, 55, "male")).toBeCloseTo(1886.25);
  });
});

describe("calculateTDEE", () => {
  const bmr = 1777.5;

  it("applies sedentary multiplier (1.2)", () => {
    expect(calculateTDEE(bmr, "sedentary")).toBe(Math.round(bmr * 1.2));
  });

  it("applies lightly active multiplier (1.375)", () => {
    expect(calculateTDEE(bmr, "lightly_active")).toBe(Math.round(bmr * 1.375));
  });

  it("applies moderately active multiplier (1.55)", () => {
    expect(calculateTDEE(bmr, "moderately_active")).toBe(Math.round(bmr * 1.55));
  });

  it("applies very active multiplier (1.725)", () => {
    expect(calculateTDEE(bmr, "very_active")).toBe(Math.round(bmr * 1.725));
  });

  it("applies extra active multiplier (1.9)", () => {
    expect(calculateTDEE(bmr, "extra_active")).toBe(Math.round(bmr * 1.9));
  });
});

describe("applyGoalAdjustment", () => {
  it("subtracts 500 kcal for cut", () => {
    expect(applyGoalAdjustment(2500, "cut")).toBe(2000);
  });

  it("returns same value for maintain", () => {
    expect(applyGoalAdjustment(2500, "maintain")).toBe(2500);
  });

  it("adds 300 kcal for bulk", () => {
    expect(applyGoalAdjustment(2500, "bulk")).toBe(2800);
  });

  it("floors at 1200 kcal for extreme cut", () => {
    expect(applyGoalAdjustment(1400, "cut")).toBe(1200);
  });
});

describe("calculateMacros", () => {
  it("calculates balanced macros (30/40/30)", () => {
    const result = calculateMacros(2000, "balanced");
    expect(result.kcal).toBe(2000);
    expect(result.proteinG).toBe(Math.round((2000 * 0.3) / 4)); // 150
    expect(result.carbsG).toBe(Math.round((2000 * 0.4) / 4)); // 200
    expect(result.fatG).toBe(Math.round((2000 * 0.3) / 9)); // 67
  });

  it("calculates high protein macros (40/35/25)", () => {
    const result = calculateMacros(2200, "high_protein");
    expect(result.proteinG).toBe(Math.round((2200 * 0.4) / 4)); // 220
    expect(result.carbsG).toBe(Math.round((2200 * 0.35) / 4)); // 193
    expect(result.fatG).toBe(Math.round((2200 * 0.25) / 9)); // 61
  });

  it("calculates low carb macros (35/20/45)", () => {
    const result = calculateMacros(1800, "low_carb");
    expect(result.proteinG).toBe(Math.round((1800 * 0.35) / 4)); // 158
    expect(result.carbsG).toBe(Math.round((1800 * 0.2) / 4)); // 90
    expect(result.fatG).toBe(Math.round((1800 * 0.45) / 9)); // 90
  });
});

describe("computeNutritionTargets (full pipeline)", () => {
  it("male, moderately active, maintain, balanced", () => {
    const result = computeNutritionTargets({
      weightKg: 80,
      heightCm: 178,
      age: 28,
      sex: "male",
      activityLevel: "moderately_active",
      goal: "maintain",
      macroFocus: "balanced",
    });

    // BMR = 1777.5, TDEE = round(1777.5 * 1.55) = 2755, adjusted = 2755
    expect(result.kcal).toBe(2755);
    expect(result.proteinG).toBeGreaterThan(0);
    expect(result.carbsG).toBeGreaterThan(0);
    expect(result.fatG).toBeGreaterThan(0);
  });

  it("female, sedentary, cut, high_protein", () => {
    const result = computeNutritionTargets({
      weightKg: 65,
      heightCm: 165,
      age: 30,
      sex: "female",
      activityLevel: "sedentary",
      goal: "cut",
      macroFocus: "high_protein",
    });

    // BMR = 1370.25, TDEE = round(1370.25 * 1.2) = 1644, adjusted = 1644 - 500 = 1144 -> floor 1200
    expect(result.kcal).toBe(1200);
    expect(result.proteinG).toBe(Math.round((1200 * 0.4) / 4)); // 120
  });

  it("male, extra active, bulk, low_carb", () => {
    const result = computeNutritionTargets({
      weightKg: 90,
      heightCm: 185,
      age: 25,
      sex: "male",
      activityLevel: "extra_active",
      goal: "bulk",
      macroFocus: "low_carb",
    });

    // BMR = 10*90 + 6.25*185 - 5*25 + 5 = 900 + 1156.25 - 125 + 5 = 1936.25
    // TDEE = round(1936.25 * 1.9) = 3679
    // adjusted = 3679 + 300 = 3979
    expect(result.kcal).toBe(3979);
    expect(result.fatG).toBeGreaterThanOrEqual(result.carbsG); // low_carb: fat% > carbs%
  });

  it("female, very active, maintain, balanced", () => {
    const result = computeNutritionTargets({
      weightKg: 58,
      heightCm: 168,
      age: 35,
      sex: "female",
      activityLevel: "very_active",
      goal: "maintain",
      macroFocus: "balanced",
    });

    // BMR = 10*58 + 6.25*168 - 5*35 - 161 = 580 + 1050 - 175 - 161 = 1294
    // TDEE = round(1294 * 1.725) = 2232
    expect(result.kcal).toBe(2232);
  });
});
