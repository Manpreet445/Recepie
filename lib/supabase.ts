/**
 * Supabase client singleton.
 *
 * Reads connection credentials from environment variables. If the variables
 * are missing at runtime the app will fail fast with a descriptive error
 * rather than silently producing undefined behavior.
 */

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anon) {
  throw new Error(
    "Missing Supabase environment variables. " +
      "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local. " +
      "See .env.example for reference.",
  );
}

export const supabase = createClient(url, anon);
