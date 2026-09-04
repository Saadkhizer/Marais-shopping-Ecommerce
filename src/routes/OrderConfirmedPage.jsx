import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Notice from "../components/Notice.jsx";
import { api } from "../lib/api.js";

export default function OrderConfirmedPage() {
  const { reference } = useParams();
  const location = useLocation();

  // The checkout hands the order over in navigation state, so the happy path
  // renders with no extra request. A shared or reloaded link falls back to
  // fetching it by reference.
  const [order, setOrder] = useState(location.state?.order ?? null);
  const [status, setStatus] = useState(location.state?.order ? "ready" : "loading");

  useEffect(() => {
    if (order) return;
    let cancelled = false;

    api
      .getOrder(reference)
      .then((found) => {
        if (cancelled) return;
        setOrder(found);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("missing");
      });

    return () => {
      cancelled = true;
    };
  }, [order, reference]);

  return (
    <main className="mx-auto max-w-[1280px] px-6 py-16 lg:py-24">
      <div className="mx-auto max-w-[560px]">
        <span className="font-mono text-[11px] font-medium tracking-[0.22em] uppercase text-accent-deep">
          Order received
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-[-0.03em] text-ink lg:text-4xl">
          Thank you for your order
        </h1>
        <p className="mt-4 text-[14.5px] leading-relaxed text-ink-soft">
          Your reference is{" "}
          <span className="font-mono font-medium text-ink">{reference}</span>. Keep
          it for any questions about this order.
        </p>

        {status === "loading" && (
          <div className="mt-8 space-y-3" aria-live="polite">
            <div className="h-4 w-1/3 animate-pulse bg-paper-alt" />
            <div className="h-4 w-2/3 animate-pulse bg-paper-alt" />
          </div>
        )}

        {status === "missing" && (
          <Notice tone="error" title="Could not load the order" className="mt-8">
            The API did not return this reference. If the server is not running,
            start it with npm run server, then reload this page.
          </Notice>
        )}

        {status === "ready" && order && (
          <dl className="mt-9 divide-y divide-line border-y border-line">
            <div className="flex justify-between py-3.5 text-[14px]">
              <dt className="text-ink-soft">Reference</dt>
              <dd className="font-mono font-medium text-ink">{order.reference}</dd>
            </div>
            {order.created_at && (
              <div className="flex justify-between py-3.5 text-[14px]">
                <dt className="text-ink-soft">Placed</dt>
                <dd className="text-ink">
                  {new Date(order.created_at).toLocaleString()}
                </dd>
              </div>
            )}
            {order.shipping !== undefined && (
              <div className="flex justify-between py-3.5 text-[14px]">
                <dt className="text-ink-soft">Shipping</dt>
                <dd className="text-ink">
                  {Number(order.shipping) === 0 ? "Free" : `$${order.shipping}`}
                </dd>
              </div>
            )}
            <div className="flex justify-between py-3.5 text-[15px] font-semibold">
              <dt>Total paid</dt>
              <dd>${order.total ?? order.subtotal}</dd>
            </div>
          </dl>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-6">
          <Link
            to="/"
            className="bg-ink px-8 py-4 text-[12px] font-semibold tracking-[0.14em] uppercase text-white transition-colors hover:bg-accent-deep"
          >
            Continue shopping
          </Link>
          <Link
            to="/account"
            className="text-[12px] font-semibold tracking-[0.14em] uppercase text-ink underline decoration-line underline-offset-[6px] transition-colors hover:text-accent-deep"
          >
            View your orders
          </Link>
        </div>
      </div>
    </main>
  );
}
