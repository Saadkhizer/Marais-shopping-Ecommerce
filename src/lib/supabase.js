import { createClient } from "@supabase/supabase-js";

/**
 * Browser-side Supabase client.
 *
 * Only used for things the browser is allowed to do directly: reading public
 * catalog rows and signing a visitor in. Anything privileged (writing orders,
 * reading another customer's data) goes through the Express API instead, so the
 * service role key never touches the bundle.
 *
 * Returns null when the environment variables are absent, which lets the site
 * run standalone from local seed data. That matters for a portfolio demo: it
 * opens and works with no backend running at all.
 */
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase =
  url && anonKey ? createClient(url, anonKey) : null;

export const isSupabaseConfigured = Boolean(supabase);
