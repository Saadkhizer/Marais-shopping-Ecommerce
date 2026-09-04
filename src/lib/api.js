/**
 * Thin wrapper around the Express API.
 *
 * Every call has a timeout and every caller has a fallback. A store that white
 * screens because a backend is not running is worse than one that quietly falls
 * back to seed data, so no network failure here is ever fatal.
 */
async function request(path, { method = "GET", body, token, timeoutMs = 8000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const response = await fetch(`/api${path}`, {
      method,
      headers: Object.keys(headers).length ? headers : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      const error = new Error(payload?.error || `Request failed with ${response.status}`);
      error.status = response.status;
      throw error;
    }
    return payload;
  } finally {
    clearTimeout(timer);
  }
}

export const api = {
  getProducts: () => request("/products"),
  getProduct: (id) => request(`/products/${id}`),
  createOrder: (payload) => request("/orders", { method: "POST", body: payload }),
  getOrder: (reference) => request(`/orders/${encodeURIComponent(reference)}`),
  getMyOrders: (token) => request("/orders/mine", { token }),
  subscribe: (email) => request("/subscribers", { method: "POST", body: { email } }),
};
