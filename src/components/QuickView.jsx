import { useEffect, useState } from "react";
import SmartImage from "./SmartImage.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function QuickView({ product, onClose }) {
  const { add } = useCart();
  const [size, setSize] = useState(null);

  useEffect(() => {
    if (product) {
      setSize(product.sizes?.[1] ?? product.sizes?.[0] ?? "One size");
    }
  }, [product]);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    if (product) {
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }
  }, [product, onClose]);

  if (!product) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
      className="fixed inset-0 z-70 flex items-center justify-center bg-ink/55 p-4 sm:p-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="grid max-h-[88vh] w-full max-w-[880px] grid-cols-1 overflow-hidden bg-surface md:grid-cols-2">
        <SmartImage
          src={product.image}
          alt={product.name}
          label={product.name}
          className="h-56 w-full object-cover md:h-full"
        />

        <div className="relative overflow-y-auto p-8 lg:p-10">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center text-ink-soft transition-colors hover:text-ink"
          >
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" strokeWidth="1.7" stroke="currentColor">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>

          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-accent-deep">
            {product.audience} / {product.category}
          </span>
          <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink">
            {product.name}
          </h3>
          <p className="mt-2 text-[16px] font-semibold text-ink">
            ${product.price}
          </p>
          <p className="mt-5 max-w-[46ch] text-[14px] leading-relaxed text-ink-soft">
            {product.description}
          </p>
          <p className="mt-4 font-mono text-[11.5px] tracking-[0.08em] text-ink-soft">
            {product.fabric}
          </p>

          <fieldset className="mt-8">
            <legend className="font-mono text-[11px] font-medium tracking-[0.16em] uppercase text-ink">
              Select size
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {(product.sizes ?? ["One size"]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSize(option)}
                  aria-pressed={size === option}
                  className={`min-w-[46px] border px-3 py-2.5 font-mono text-[12px] transition-colors ${
                    size === option
                      ? "border-ink bg-ink text-white"
                      : "border-line text-ink hover:border-ink"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Add to bag CTA. Its identity is the accent fill plus a one pixel
              press, distinct from the hero arrow and the quick add panel. */}
          <button
            type="button"
            onClick={() => {
              add(product, size);
              onClose();
            }}
            className="mt-8 w-full bg-accent-deep py-4 text-[12px] font-semibold tracking-[0.14em] uppercase text-white transition-colors hover:bg-ink active:translate-y-px"
          >
            Add to bag
          </button>
        </div>
      </div>
    </div>
  );
}
