import { createClient } from "@supabase/supabase-js";

/**
 * Server side Supabase clients.
 *
 * Two separate clients on purpose:
 *   publicClient  uses the anon key and is subject to row level security. Used
 *                 for reads that any visitor is allowed to make.
 *   adminClient   uses the service role key, which bypasses row level security
 *                 entirely. Only ever used for writes the server owns, such as
 *                 inserting an order. This key must never reach the browser.
 *
 * Both are null when the environment is not configured, so the API degrades to
 * a clear 503 rather than crashing on boot.
 */
const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const publicClient =
  url && anonKey
    ? createClient(url, anonKey, { auth: { persistSession: false } })
    : null;

export const adminClient =
  url && serviceKey
    ? createClient(url, serviceKey, { auth: { persistSession: false } })
    : null;

export const isConfigured = Boolean(publicClient);

/**
 * Wraps any Supabase call so a slow or unreachable database returns a fallback
 * instead of hanging the request until the client gives up.
 */
export async function withTimeout(promise, { ms = 5000, fallback = null } = {}) {
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`timed out after ${ms}ms`)), ms)
      ),
    ]);
  } catch (error) {
    console.warn("[supabase] call failed:", error.message);
    return fallback;
  }
}
