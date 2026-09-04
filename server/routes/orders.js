import { Router } from "express";
import { adminClient, publicClient, withTimeout } from "../lib/supabase.js";

export const ordersRouter = Router();

const SHIPPING_RULES = {
  standard: { cost: 6, freeOver: 75 },
  express: { cost: 14 },
};

function makeReference() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-6);
  const noise = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `MR-${stamp}${noise}`;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validatePayload(body) {
  const { items, customer, shippingAddress, shippingMethod } = body ?? {};

  if (!Array.isArray(items) || items.length === 0) {
    return "An order needs at least one item.";
  }
  if (items.length > 50) {
    return "That is more items than a single order allows.";
  }
  for (const item of items) {
    const id = Number(item?.id);
    const qty = Number(item?.qty);
    if (!Number.isInteger(id) || id < 1) return "Every item needs a valid product id.";
    if (!Number.isInteger(qty) || qty < 1 || qty > 20) {
      return "Item quantities must be between 1 and 20.";
    }
  }

  if (!customer || !EMAIL_PATTERN.test(String(customer.email ?? ""))) {
    return "A valid customer email is required.";
  }
  if (!String(customer.fullName ?? "").trim()) {
    return "A customer name is required.";
  }

  if (!shippingAddress) return "A shipping address is required.";
  for (const field of ["line1", "city", "postcode", "country"]) {
    if (!String(shippingAddress[field] ?? "").trim()) {
      return `Shipping address is missing ${field}.`;
    }
  }

  if (shippingMethod && !SHIPPING_RULES[shippingMethod]) {
    return "Unknown shipping method.";
  }

  return null;
}

/** POST /api/orders */
ordersRouter.post("/", async (request, response) => {
  const problem = validatePayload(request.body);
  if (problem) return response.status(400).json({ error: problem });

  if (!adminClient) {
    return response.status(503).json({
      error:
        "Order storage is not configured. Set SUPABASE_SERVICE_ROLE_KEY in server/.env.",
    });
  }

  const { items, customer, shippingAddress, shippingMethod = "standard", notes } =
    request.body;

  // Prices come from the database, never from the request. A client that can
  // post its own totals can post its own discount.
  const ids = [...new Set(items.map((item) => Number(item.id)))];
  const lookup = await withTimeout(
    publicClient.from("products").select("id, name, price").in("id", ids),
    { fallback: { data: null, error: { message: "database timed out" } } }
  );

  if (lookup.error) return response.status(502).json({ error: lookup.error.message });

  const catalog = new Map((lookup.data ?? []).map((row) => [row.id, row]));
  let subtotal = 0;
  const lineItems = [];

  for (const item of items) {
    const row = catalog.get(Number(item.id));
    if (!row) {
      return response.status(400).json({ error: `Unknown product id ${item.id}.` });
    }
    const qty = Number(item.qty);
    const unitPrice = Number(row.price);
    subtotal += unitPrice * qty;
    lineItems.push({
      product_id: row.id,
      name: row.name,
      size: item.size ? String(item.size).slice(0, 20) : null,
      qty,
      unit_price: unitPrice,
    });
  }

  const rule = SHIPPING_RULES[shippingMethod];
  const shipping =
    rule.freeOver !== undefined && subtotal >= rule.freeOver ? 0 : rule.cost;
  const total = subtotal + shipping;

  const reference = makeReference();

  const insert = await withTimeout(
    adminClient
      .from("orders")
      .insert({
        reference,
        user_id: customer.userId ?? null,
        customer_email: String(customer.email).trim().toLowerCase(),
        customer_name: String(customer.fullName).trim().slice(0, 120),
        customer_phone: customer.phone ? String(customer.phone).slice(0, 40) : null,
        shipping_address: shippingAddress,
        shipping_method: shippingMethod,
        shipping,
        subtotal,
        total,
        items: lineItems,
        notes: notes ? String(notes).slice(0, 500) : null,
        status: "pending",
      })
      .select("reference, subtotal, shipping, total, status, created_at")
      .single(),
    { fallback: { data: null, error: { message: "database timed out" } } }
  );

  if (insert.error) return response.status(502).json({ error: insert.error.message });

  return response.status(201).json(insert.data);
});

/**
 * GET /api/orders/mine
 *
 * Declared before /:reference so the literal path is not swallowed by the
 * parameter route.
 */
ordersRouter.get("/mine", async (request, response) => {
  const header = request.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return response.status(401).json({ error: "Sign in to view your orders." });
  if (!adminClient || !publicClient) {
    return response.status(503).json({ error: "Supabase is not configured." });
  }

  // The token is verified against Supabase rather than decoded locally, so a
  // forged or expired token cannot read anybody's order history.
  const identity = await withTimeout(publicClient.auth.getUser(token), {
    fallback: { data: { user: null }, error: { message: "auth lookup timed out" } },
  });

  if (identity.error || !identity.data?.user) {
    return response.status(401).json({ error: "That session is no longer valid." });
  }

  const result = await withTimeout(
    adminClient
      .from("orders")
      .select("reference, subtotal, shipping, total, status, created_at")
      .eq("user_id", identity.data.user.id)
      .order("created_at", { ascending: false })
      .limit(50),
    { fallback: { data: null, error: { message: "database timed out" } } }
  );

  if (result.error) return response.status(502).json({ error: result.error.message });

  return response.json(result.data ?? []);
});

/** GET /api/orders/:reference */
ordersRouter.get("/:reference", async (request, response) => {
  const reference = String(request.params.reference).trim().toUpperCase();

  if (!/^MR-[A-Z0-9]{6,12}$/.test(reference)) {
    return response.status(400).json({ error: "That is not a valid order reference." });
  }
  if (!adminClient) {
    return response.status(503).json({ error: "Supabase is not configured." });
  }

  const result = await withTimeout(
    adminClient
      .from("orders")
      // Deliberately narrow. Anyone holding a reference can read it, so the
      // address, phone number and email are never included here.
      .select("reference, subtotal, shipping, total, status, created_at, items")
      .eq("reference", reference)
      .maybeSingle(),
    { fallback: { data: null, error: { message: "database timed out" } } }
  );

  if (result.error) return response.status(502).json({ error: result.error.message });
  if (!result.data) return response.status(404).json({ error: "Order not found." });

  return response.json(result.data);
});
