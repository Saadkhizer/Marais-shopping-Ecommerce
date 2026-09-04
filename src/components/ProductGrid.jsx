import Reveal from "./Reveal.jsx";
import ProductCard from "./ProductCard.jsx";

export default function ProductGrid({ products, loading, source, onQuickView }) {
  return (
    <section id="new" className="border-t border-line bg-surface">
      <div className="mx-auto max-w-[1280px] px-6 py-20 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Reveal>
            <span className="font-mono text-[11px] font-medium tracking-[0.22em] uppercase text-accent-deep">
              Best sellers
            </span>
            <h2 className="mt-4 max-w-[20ch] font-display text-3xl leading-tight font-semibold tracking-tight text-ink md:text-4xl">
              Most loved this month
            </h2>
          </Reveal>

          {/* Live status of where the catalog came from. Useful in a portfolio
              piece: it shows the client the backend is real and wired up. */}
          <Reveal delay={80}>
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-ink-soft">
              {loading
                ? "Loading catalog"
                : source === "api"
                ? "Catalog served from Supabase"
                : "Catalog served from local seed data"}
            </span>
          </Reveal>
        </div>

        {loading ? (
          <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index}>
                <div className="aspect-[4/5] animate-pulse bg-paper-alt" />
                <div className="mt-4 h-3.5 w-2/3 animate-pulse bg-paper-alt" />
                <div className="mt-2 h-3 w-1/3 animate-pulse bg-paper-alt" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="mt-16 border border-line px-6 py-16 text-center">
            <p className="font-display text-lg font-medium text-ink">
              No pieces to show yet
            </p>
            <p className="mx-auto mt-2 max-w-[42ch] text-[14px] leading-relaxed text-ink-soft">
              Add rows to the products table in Supabase, or run the seed script
              in server/db/schema.sql, and they appear here.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {products.map((product, index) => (
              <Reveal key={product.id} delay={(index % 4) * 70}>
                <ProductCard product={product} onQuickView={onQuickView} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
