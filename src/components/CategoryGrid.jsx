import Reveal from "./Reveal.jsx";
import SmartImage from "./SmartImage.jsx";
import { categories } from "../data/products.js";

/**
 * Deliberately asymmetric: the first tile takes half the row so the group never
 * reads as the generic three identical cards.
 */
export default function CategoryGrid() {
  return (
    <section className="mx-auto max-w-[1280px] px-6 py-20 lg:py-24">
      <Reveal>
        <h2 className="max-w-[18ch] font-display text-3xl leading-tight font-semibold tracking-tight text-ink md:text-4xl">
          Three edits, one wardrobe
        </h2>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        {categories.map((category, index) => (
          <Reveal
            key={category.slug}
            delay={index * 90}
            className={index === 0 ? "lg:col-span-2" : ""}
          >
            <a
              href={`#${category.slug}`}
              id={category.slug}
              className="group relative flex h-[420px] items-end overflow-hidden bg-ink"
            >
              <SmartImage
                src={category.image}
                alt={`${category.label} collection`}
                label={category.label}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent"
              />
              <span className="relative z-10 p-7">
                <span className="block font-display text-2xl font-medium text-white">
                  {category.label}
                </span>
                <span className="mt-1 block font-mono text-[11px] tracking-[0.16em] uppercase text-white/75">
                  {category.count} pieces
                </span>
              </span>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
