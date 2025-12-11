import { supabase } from "./supabaseClient";

export async function testSupabaseInsert() {
  try {
    const today = new Date().toISOString().slice(0, 10);

    const { error } = await supabase.from("lifts").insert({
      date: today,
      exercise: "TEST_ENTRY",
      set_number: 1,
      reps: 1,
      weight_kg: 1,
      rpe: null,
    });

    if (error) {
      console.error("Supabase TEST INSERT error:", error);
    } else {
      console.log("Supabase TEST INSERT success!");
    }
  } catch (err) {
    console.error("Supabase TEST INSERT exception:", err);
  }
}
