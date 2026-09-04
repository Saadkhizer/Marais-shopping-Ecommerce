import Reveal from "./Reveal.jsx";
import SmartImage from "./SmartImage.jsx";

/**
 * Full bleed image with an offset panel laid over it. A different layout family
 * from every other section on the page.
 */
export default function Editorial() {
  return (
    <section id="men" className="relative">
      <SmartImage
        src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1800&q=80"
        alt="MARAIS studio interior with garment rails"
        label="Inside the studio"
        className="h-[560px] w-full object-cover lg:h-[620px]"
      />
      <span aria-hidden="true" className="absolute inset-0 bg-ink/45" />

      <div className="absolute inset-0 mx-auto flex max-w-[1280px] items-center px-6">
        <Reveal className="w-full">
          <div className="max-w-[520px] bg-surface p-9 lg:p-11">
            <h2 className="max-w-[16ch] font-display text-3xl leading-tight font-semibold tracking-tight text-ink md:text-[38px]">
              Short runs, no overproduction
            </h2>
            <p className="mt-5 max-w-[44ch] text-[14.5px] leading-relaxed text-ink-soft">
              We keep production deliberately small. Every style is cut to a
              planned quantity, which means fewer markdowns, no deadstock, and no
              filler pieces in the range.
            </p>

            {/* Story CTA. Its identity is the growing underline, deliberately
                lighter than the ink and accent buttons elsewhere. */}
            <a
              href="#accessories"
              className="group mt-7 inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.14em] uppercase text-ink"
            >
              <span className="border-b border-ink pb-1 transition-colors group-hover:border-accent-deep group-hover:text-accent-deep">
                Read our approach
              </span>
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" strokeWidth="2" stroke="currentColor">
                <path d="M5 12h13M12 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
