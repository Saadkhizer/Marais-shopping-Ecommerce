import { Router } from "express";
import { publicClient, isConfigured, withTimeout } from "../lib/supabase.js";

export const productsRouter = Router();

/**
 * Maps a database row onto the exact shape the React components expect. Keeping
 * this in one place means a column rename touches one function, not ten
 * components.
 */
function toProduct(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    audience: row.audience,
    price: Number(row.price),
    image: row.image_url,
    description: row.description,
    fabric: row.fabric,
    sizes: row.sizes ?? [],
  };
}

productsRouter.get("/", async (_request, response) => {
  if (!isConfigured) {
    return response.status(503).json({
      error: "Supabase is not configured. Copy server/.env.example to server/.env.",
    });
  }

  const result = await withTimeout(
    publicClient
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("id", { ascending: true }),
    { fallback: { data: null, error: { message: "database timed out" } } }
  );

  if (result.error) {
    return response.status(502).json({ error: result.error.message });
  }

  return response.json((result.data ?? []).map(toProduct));
});

productsRouter.get("/:id", async (request, response) => {
  const id = Number(request.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return response.status(400).json({ error: "Product id must be a positive integer." });
  }

  if (!isConfigured) {
    return response.status(503).json({ error: "Supabase is not configured." });
  }

  const result = await withTimeout(
    publicClient.from("products").select("*").eq("id", id).maybeSingle(),
    { fallback: { data: null, error: { message: "database timed out" } } }
  );

  if (result.error) {
    return response.status(502).json({ error: result.error.message });
  }
  if (!result.data) {
    return response.status(404).json({ error: "Product not found." });
  }

  return response.json(toProduct(result.data));
});
