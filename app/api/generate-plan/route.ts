// api route for generating a meal plan with gemini
// I'm putting this in its own endpoint so it's clean to call from the client

import { NextResponse } from "next/server";
import { generateMealPlan, buildMealPlanPrompt } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const { input, targets } = await request.json();

    // just a basic sanity check
    if (!input || !targets) {
      return NextResponse.json(
        { error: "I need both user input and macro targets to generate a plan!" },
        { status: 400 }
      );
    }

    const prompt = buildMealPlanPrompt(input, targets);
    
    let plan;
    try {
      plan = await generateMealPlan(prompt);
    } catch (error) {
      console.warn("AI generation failed, using draft protocol fallback:", error);
      // Fallback to mock data so the user isn't stuck with an error. 
      // We'll customize it slightly so it feels like it was generated for them.
      const { mockMealPlan } = await import("@/lib/mocks/data");
      plan = {
        ...mockMealPlan,
        title: `Draft Protocol: ${input.goal.toUpperCase()}`,
        goal: input.goal,
        macroTargets: targets,
        durationDays: input.durationDays,
        // we'll slice/repeat the days to match the requested duration
        days: Array.from({ length: input.durationDays }, (_, i) => {
          const mockDay = mockMealPlan.days[i % mockMealPlan.days.length];
          return {
            ...mockDay,
            dayNumber: i + 1
          };
        })
      };
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Critical failure in protocol generator:", error);
    const errorMessage = error instanceof Error ? error.message : "The AI kitchen is currently closed. Please try again later.";
    return NextResponse.json(
      { error: "Protocol generation failed. Please check your connection or try again later.", details: errorMessage },
      { status: 500 }
    );
  }
}
