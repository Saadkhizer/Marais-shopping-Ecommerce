import { Router } from "express";
import { adminClient, withTimeout } from "../lib/supabase.js";

export const subscribersRouter = Router();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

subscribersRouter.post("/", async (request, response) => {
  const email = String(request.body?.email ?? "").trim().toLowerCase();

  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return response.status(400).json({ error: "Enter a valid email address." });
  }

  if (!adminClient) {
    return response.status(503).json({
      error: "Subscriber storage is not configured. Set SUPABASE_SERVICE_ROLE_KEY.",
    });
  }

  // upsert rather than insert so a repeat signup is a no-op instead of a 409.
  const result = await withTimeout(
    adminClient
      .from("subscribers")
      .upsert({ email }, { onConflict: "email" })
      .select("email")
      .single(),
    { fallback: { data: null, error: { message: "database timed out" } } }
  );

  if (result.error) {
    return response.status(502).json({ error: result.error.message });
  }

  return response.status(201).json({ email: result.data.email });
});
