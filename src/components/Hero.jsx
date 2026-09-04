import Reveal from "./Reveal.jsx";
import SmartImage from "./SmartImage.jsx";

export default function Hero() {
  return (
    <section id="top" className="grid border-b border-line lg:grid-cols-2">
      {/* Copy column. justify-end plus a max width keeps the text aligned with
          the 1280px container used by every section below, while the section
          itself spans the full viewport. */}
      <div className="flex items-center justify-end px-6 py-16 sm:px-8 lg:py-28">
        <div className="w-full max-w-[600px] lg:pr-14">
          <Reveal>
            <span className="font-mono text-[11px] font-medium tracking-[0.22em] uppercase text-accent-deep">
              Autumn Winter 2026
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-5 max-w-[15ch] font-display text-[2.75rem] leading-[0.98] font-bold tracking-[-0.035em] text-ink md:text-6xl lg:text-[4.25rem]">
              Considered essentials, made to last.
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-7 max-w-[44ch] text-[15px] leading-relaxed text-ink-soft">
              Wool, silk and linen cut for everyday wear, produced in short runs
              with mills in Portugal and Japan.
            </p>
          </Reveal>

          <Reveal delay={240}>
            {/* Primary CTA. Its identity is the arrow that travels on hover. */}
            <a
              href="#new"
              className="group mt-10 inline-flex items-center gap-3 bg-ink px-8 py-4 text-[12px] font-semibold tracking-[0.14em] uppercase text-white transition-colors hover:bg-accent-deep active:translate-y-px"
            >
              Shop the collection
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                strokeWidth="1.8"
                stroke="currentColor"
              >
                <path d="M4 12h15M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </Reveal>
        </div>
      </div>

      {/* Image column. Bleeds to the right edge of the viewport, and tall enough
          to hold the fold on a laptop without the copy column feeling short. */}
      <div className="relative min-h-[420px] sm:min-h-[520px] lg:min-h-[680px]">
        <SmartImage
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=85"
          alt="Model in a MARAIS wool overcoat, autumn winter campaign"
          label="Autumn Winter campaign"
          className="absolute inset-0 h-full w-full object-cover object-[50%_30%]"
        />
      </div>
    </section>
  );
}
