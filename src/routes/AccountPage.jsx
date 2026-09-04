import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Notice from "../components/Notice.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../lib/api.js";

export default function AccountPage() {
  const { user, initialising, signOut, accessToken, isDemoMode } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [ordersState, setOrdersState] = useState("loading");

  // Route guard. Waits for the session check to finish first, otherwise a
  // signed in visitor gets bounced to login on every hard refresh.
  useEffect(() => {
    if (!initialising && !user) {
      navigate("/login", { replace: true, state: { from: "/account" } });
    }
  }, [initialising, user, navigate]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function loadOrders() {
      try {
        const token = await accessToken();
        if (!token) {
          if (!cancelled) setOrdersState("unavailable");
          return;
        }
        const rows = await api.getMyOrders(token);
        if (cancelled) return;
        setOrders(Array.isArray(rows) ? rows : []);
        setOrdersState("ready");
      } catch {
        if (!cancelled) setOrdersState("unavailable");
      }
    }

    loadOrders();
    return () => {
      cancelled = true;
    };
  }, [user, accessToken]);

  if (initialising || !user) {
    return (
      <main className="mx-auto max-w-[1280px] px-6 py-24">
        <div className="mx-auto max-w-[420px] space-y-3" aria-live="polite">
          <div className="h-6 w-1/2 animate-pulse bg-paper-alt" />
          <div className="h-4 w-3/4 animate-pulse bg-paper-alt" />
        </div>
      </main>
    );
  }

  const displayName = user.user_metadata?.full_name || user.email;

  return (
    <main className="mx-auto max-w-[1280px] px-6 py-16 lg:py-20">
      <div className="flex flex-wrap items-end justify-between gap-5 border-b border-line pb-7">
        <div>
          <span className="font-mono text-[11px] font-medium tracking-[0.22em] uppercase text-accent-deep">
            Your account
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-[-0.03em] text-ink lg:text-4xl">
            {displayName}
          </h1>
          <p className="mt-2 text-[14px] text-ink-soft">{user.email}</p>
        </div>

        <button
          type="button"
          onClick={async () => {
            await signOut();
            navigate("/", { replace: true });
          }}
          className="border border-ink px-6 py-3 text-[12px] font-semibold tracking-[0.14em] uppercase text-ink transition-colors hover:bg-ink hover:text-white active:translate-y-px"
        >
          Sign out
        </button>
      </div>

      {isDemoMode && (
        <Notice tone="info" title="Demo mode" className="mt-8">
          This session is held in memory only. Connect Supabase to store real
          accounts and order history.
        </Notice>
      )}

      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
          Order history
        </h2>

        {ordersState === "loading" && (
          <div className="mt-6 space-y-3" aria-live="polite">
            {[0, 1].map((row) => (
              <div key={row} className="h-16 animate-pulse bg-paper-alt" />
            ))}
          </div>
        )}

        {ordersState === "unavailable" && (
          <Notice tone="info" className="mt-6">
            Order history needs the API and Supabase running. Start the server with
            npm run server, then reload.
          </Notice>
        )}

        {ordersState === "ready" && orders.length === 0 && (
          <div className="mt-6 border border-line px-6 py-14 text-center">
            <p className="font-display text-[15px] font-medium text-ink">
              No orders yet
            </p>
            <p className="mx-auto mt-2 max-w-[40ch] text-[13.5px] leading-relaxed text-ink-soft">
              Once you place an order it appears here with its reference and total.
            </p>
            <Link
              to="/"
              className="mt-7 inline-block bg-ink px-7 py-3.5 text-[12px] font-semibold tracking-[0.14em] uppercase text-white transition-colors hover:bg-accent-deep"
            >
              Browse the collection
            </Link>
          </div>
        )}

        {ordersState === "ready" && orders.length > 0 && (
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {orders.map((order) => (
              <li
                key={order.reference}
                className="flex flex-wrap items-center justify-between gap-4 py-5"
              >
                <div>
                  <Link
                    to={`/order/${order.reference}`}
                    className="font-mono text-[13px] font-medium text-ink underline decoration-line underline-offset-4 transition-colors hover:text-accent-deep"
                  >
                    {order.reference}
                  </Link>
                  <p className="mt-1 text-[12.5px] text-ink-soft">
                    {new Date(order.created_at).toLocaleDateString()} /{" "}
                    {order.status}
                  </p>
                </div>
                <span className="text-[14.5px] font-semibold text-ink">
                  ${order.total ?? order.subtotal}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
