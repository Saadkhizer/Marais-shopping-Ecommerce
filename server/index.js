import "node:process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import { productsRouter } from "./routes/products.js";
import { ordersRouter } from "./routes/orders.js";
import { subscribersRouter } from "./routes/subscribers.js";
import { isConfigured } from "./lib/supabase.js";

const here = dirname(fileURLToPath(import.meta.url));

/**
 * Minimal .env loader.
 *
 * Node 20.6+ can do this natively with --env-file, but reading the file here
 * means npm run server works on every Node version without a flag, and without
 * adding dotenv as a dependency.
 */
function loadEnv() {
  try {
    const raw = readFileSync(join(here, ".env"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const separator = trimmed.indexOf("=");
      if (separator === -1) continue;
      const key = trimmed.slice(0, separator).trim();
      const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, "");
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    console.warn("[server] no server/.env found, running with defaults");
  }
}

loadEnv();

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "100kb" }));

// Small request log. Useful when a fetch from the React app returns something
// unexpected and you need to see whether it even arrived.
app.use((request, _response, next) => {
  console.log(`${request.method} ${request.originalUrl}`);
  next();
});

app.get("/api/health", (_request, response) => {
  response.json({
    ok: true,
    supabase: isConfigured ? "configured" : "not configured",
    uptimeSeconds: Math.round(process.uptime()),
  });
});

app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/subscribers", subscribersRouter);

app.use((_request, response) => {
  response.status(404).json({ error: "Route not found." });
});

// Final error handler. Without this Express prints a stack trace to the client
// in some configurations, which leaks file paths.
app.use((error, _request, response, _next) => {
  console.error("[server] unhandled error:", error);
  response.status(500).json({ error: "Internal server error." });
});

app.listen(port, () => {
  console.log(`[server] listening on http://127.0.0.1:${port}`);
  console.log(`[server] supabase ${isConfigured ? "configured" : "NOT configured"}`);
});
