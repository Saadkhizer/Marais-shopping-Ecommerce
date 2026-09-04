import SmartImage from "./SmartImage.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function ProductCard({ product, onQuickView }) {
  const { add } = useCart();

  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden bg-paper-alt">
        <button
          type="button"
          onClick={() => onQuickView(product)}
          aria-label={`View details for ${product.name}`}
          className="absolute inset-0 h-full w-full cursor-pointer"
        >
          <SmartImage
            src={product.image}
            alt={product.name}
            label={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        </button>

        {/* Quick add CTA. Its identity is the panel that rises from the bottom
            edge, unlike the hero button or the newsletter submit. */}
        <button
          type="button"
          onClick={() => add(product)}
          className="absolute bottom-3 left-3 right-3 translate-y-3 border border-ink bg-white/95 py-3 text-[11px] font-semibold tracking-[0.14em] uppercase text-ink opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-ink hover:text-white focus-visible:translate-y-0 focus-visible:opacity-100"
        >
          Quick add
        </button>
      </div>

      <div className="flex items-start justify-between gap-4 pt-4">
        <div>
          <h3 className="text-[14.5px] font-medium text-ink">{product.name}</h3>
          <p className="mt-0.5 font-mono text-[11.5px] tracking-[0.1em] uppercase text-ink-soft">
            {product.audience} / {product.category}
          </p>
        </div>
        <span className="shrink-0 text-[14.5px] font-semibold text-ink">
          ${product.price}
        </span>
      </div>
    </article>
  );
}
