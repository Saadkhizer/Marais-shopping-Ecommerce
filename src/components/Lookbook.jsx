import { useRef } from "react";
import Reveal from "./Reveal.jsx";
import SmartImage from "./SmartImage.jsx";
import { lookbook } from "../data/products.js";

/**
 * Horizontal scrolling rail. Distinct layout family from the vertical grids
 * above it, and it degrades to a plain swipeable strip on touch devices.
 */
export default function Lookbook() {
  const railRef = useRef(null);

  function scrollBy(direction) {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * rail.clientWidth * 0.8, behavior: "smooth" });
  }

  return (
    <section id="accessories" className="border-t border-line py-20 lg:py-24">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-end justify-between gap-4 px-6">
        <Reveal>
          <h2 className="max-w-[20ch] font-display text-3xl leading-tight font-semibold tracking-tight text-ink md:text-4xl">
            The Autumn lookbook
          </h2>
        </Reveal>

        <Reveal delay={80}>
          <div className="flex gap-2">
            {[
              { dir: -1, label: "Scroll left", d: "M15 6l-6 6 6 6" },
              { dir: 1, label: "Scroll right", d: "M9 6l6 6-6 6" },
            ].map((control) => (
              <button
                key={control.label}
                type="button"
                onClick={() => scrollBy(control.dir)}
                aria-label={control.label}
                className="flex h-10 w-10 items-center justify-center border border-line text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white active:scale-95"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" strokeWidth="1.8" stroke="currentColor">
                  <path d={control.d} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      <div
        ref={railRef}
        className="rail-scroll mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2"
      >
        {lookbook.map((src, index) => (
          <SmartImage
            key={src}
            src={src}
            alt={`Autumn lookbook frame ${index + 1}`}
            label={`Look ${index + 1}`}
            className="h-[300px] w-[240px] shrink-0 snap-start object-cover md:h-[420px] md:w-[330px]"
          />
        ))}
      </div>
    </section>
  );
}
