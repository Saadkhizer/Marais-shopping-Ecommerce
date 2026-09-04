import { useEffect } from "react";
import { Link } from "react-router-dom";
import SmartImage from "./SmartImage.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function CartDrawer() {
  const {
    items,
    count,
    subtotal,
    isOpen,
    closeCart,
    increment,
    decrement,
    remove,
  } = useCart();

  // Escape closes the drawer, and the page behind it stops scrolling while it is
  // open so the two do not fight over the wheel.
  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(event) {
      if (event.key === "Escape") closeCart();
    }
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, closeCart]);

  return (
    <>
      <div
        onClick={closeCart}
        aria-hidden="true"
        className={`fixed inset-0 z-50 bg-ink/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        aria-label="Shopping bag"
        aria-hidden={!isOpen}
        className={`fixed top-0 right-0 z-60 flex h-full w-full max-w-105 flex-col bg-white transition-transform duration-350 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-display text-lg font-semibold text-ink">
            Your bag ({count})
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close bag"
            className="flex h-9 w-9 items-center justify-center text-ink-soft transition-colors hover:text-ink"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4.5 w-4.5"
              fill="none"
              strokeWidth="1.7"
              stroke="currentColor"
            >
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-16 text-center">
              <div
                aria-hidden="true"
                className="flex h-14 w-14 items-center justify-center border border-line"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6 text-ink-soft"
                  fill="none"
                  strokeWidth="1.4"
                  stroke="currentColor"
                >
                  <path
                    d="M6.5 8h11l-1 11.5h-9L6.5 8z"
                    strokeLinejoin="round"
                  />
                  <path d="M9.5 8a2.5 2.5 0 0 1 5 0" strokeLinecap="round" />
                </svg>
              </div>
              <p className="mt-5 font-display text-[15px] font-medium text-ink">
                Nothing here yet
              </p>
              <p className="mt-1.5 max-w-[30ch] text-[13.5px] leading-relaxed text-ink-soft">
                Pieces you add appear here with size and quantity.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {items.map((item, index) => (
                <li key={`${item.id}-${item.size}`} className="flex gap-4 py-5">
                  <SmartImage
                    src={item.image}
                    alt={item.name}
                    label={item.name}
                    className="h-23 w-19 shrink-0 object-cover"
                  />

                  <div className="flex flex-1 flex-col">
                    <p className="text-[14px] font-medium text-ink">
                      {item.name}
                    </p>
                    <p className="mt-0.5 font-mono text-[11.5px] tracking-widest uppercase text-ink-soft">
                      Size {item.size}
                    </p>

                    <div className="mt-auto flex items-center justify-between gap-3">
                      <div className="flex items-center border border-line">
                        <button
                          type="button"
                          onClick={() => decrement(index)}
                          aria-label={`Reduce quantity of ${item.name}`}
                          className="h-7 w-7 text-ink transition-colors hover:bg-paper-alt"
                        >
                          &minus;
                        </button>
                        <span className="w-7 text-center font-mono text-[12px]">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => increment(index)}
                          aria-label={`Increase quantity of ${item.name}`}
                          className="h-7 w-7 text-ink transition-colors hover:bg-paper-alt"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-[12px] text-ink-soft underline decoration-line underline-offset-4 transition-colors hover:text-ink"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <span className="shrink-0 text-[14px] font-semibold text-ink">
                    ${item.price * item.qty}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-line px-6 py-5">
            <div className="flex items-center justify-between text-[15px] font-semibold text-ink">
              <span>Subtotal</span>
              <span>${subtotal}</span>
            </div>
            <p className="mt-1 text-[12px] text-ink-soft">
              Shipping calculated at checkout.
            </p>

            {/* Checkout CTA. Full width crimson bar, the highest intent action in
                the whole interface, so it is the only crimson fill on screen. */}
            <Link
              to="/checkout"
              onClick={closeCart}
              className="mt-4 block bg-accent-deep py-4 text-center text-[12px] font-semibold tracking-[0.14em] uppercase text-white transition-colors hover:bg-ink"
            >
              Checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
