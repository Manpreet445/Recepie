import { supabase } from "./supabase";
import { MealPlan, ArchivedPlan } from "@/types/mealPlan";

// Stable guest identity — persists across sessions without requiring auth
function guestId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("recepie_guest_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("recepie_guest_id", id);
  }
  return id;
}

export async function savePlan(plan: MealPlan): Promise<void> {
  const { error } = await supabase.from("meal_plans").upsert({
    id: plan.id,
    guest_id: guestId(),
    title: plan.title,
    goal: plan.goal,
    duration_days: plan.durationDays,
    meals_per_day: plan.days[0]?.meals.length ?? 3,
    macro_targets: plan.macroTargets,
    plan_data: plan,
    created_at: plan.createdAt,
  });
  if (error) throw error;
}

export async function loadLatestPlan(): Promise<MealPlan | null> {
  const { data, error } = await supabase
    .from("meal_plans")
    .select("plan_data")
    .eq("guest_id", guestId())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return (data?.plan_data as MealPlan) ?? null;
}

export async function loadPlanById(id: string): Promise<MealPlan | null> {
  const { data, error } = await supabase
    .from("meal_plans")
    .select("plan_data")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data?.plan_data as MealPlan) ?? null;
}

export async function listPlans(): Promise<ArchivedPlan[]> {
  const { data, error } = await supabase
    .from("meal_plans")
    .select("id, title, goal, duration_days, meals_per_day, macro_targets, created_at")
    .eq("guest_id", guestId())
    .order("created_at", { ascending: false });
  if (error) throw error;
  if (!data) return [];

  return data.map((row) => ({
    id:           row.id,
    title:        row.title,
    createdAt:    row.created_at,
    durationDays: row.duration_days,
    goal:         row.goal,
    mealsPerDay:  row.meals_per_day,
    macroTargets: row.macro_targets,
  }));
}
