import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isConfigured =
  supabaseUrl &&
  supabaseUrl !== "https://your-project.supabase.co" &&
  supabaseAnonKey &&
  supabaseAnonKey !== "your-anon-key";

if (!isConfigured) {
  console.warn(
    "Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
  );
}

export function getSupabase() {
  if (!isConfigured) {
    return null;
  }
  return createClient(supabaseUrl!, supabaseAnonKey!);
}

export const supabase = isConfigured ? createClient(supabaseUrl!, supabaseAnonKey!) : null;
