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
    const plan = await generateMealPlan(prompt);

    return NextResponse.json(plan);
  } catch (error: any) {
    console.error("Gemini failed me:", error);
    return NextResponse.json(
      { error: "The AI kitchen is currently closed. Please try again later.", details: error.message },
      { status: 500 }
    );
  }
}
