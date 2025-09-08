"use client";
import { createClient } from "@supabase/supabase-js";

let client;

export function getSupabaseClient() {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    // Provide a friendly error for missing envs in the browser console.
    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-console
      console.warn("Supabase env vars are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
    }
    return null;
  }
  client = createClient(url, anon, { auth: { persistSession: false } });
  return client;
}


