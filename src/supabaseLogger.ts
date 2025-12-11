import { supabase } from './supabaseClient';

export type SupabaseSet = {
  reps: number;
  weight: number;
  rpe?: number;
};

export async function logExerciseToSupabase(options: {
  date: string;           // e.g. '2025-12-10'
  exerciseName: string;   // e.g. 'Barbell Bench Press'
  sets: SupabaseSet[];
}) {
  const { date, exerciseName, sets } = options;

  const rows = sets.map((set, index) => ({
    date,
    exercise: exerciseName,
    set_number: index + 1,
    reps: set.reps,
    weight_kg: set.weight,
    rpe: set.rpe ?? null,
  }));

  if (!rows.length) return;

  const { error } = await supabase.from('lifts').insert(rows);

  if (error) {
    console.error('Supabase insert error:', error);
  } else {
    console.log('Logged to Supabase:', rows);
  }
}
