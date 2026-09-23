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
          {/* Small italic serif eyebrow. Replaces the tracked-out ALL-CAPS mono
              treatment which is one of the strongest tells of a templated
              page; italic serif reads as a magazine dateline rather than a
              label, which is closer to what we want the eyebrow to do here. */}
          <Reveal>
            <span className="font-display text-[15px] italic text-ink-soft">
              Autumn Winter 2026
            </span>
          </Reveal>

          {/* Headline. Fraunces at large optical size, weight 400 with a light
              negative tracking. The italic phrase inside the headline is where
              the visual identity lives; without a coloured accent, type itself
              has to do the emphasis work. Bold serifs at this size collapse
              their counters and read newspaper-y, so regular weight throughout. */}
          <Reveal delay={80}>
            <h1
              className="mt-4 max-w-[16ch] font-display text-[2.75rem] leading-[1.02] font-normal tracking-[-0.015em] text-ink md:text-6xl lg:text-[4.5rem]"
              style={{ fontVariationSettings: '"opsz" 120' }}
            >
              Considered essentials,{" "}
              <em className="font-light italic">made to last</em>.
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-7 max-w-[44ch] text-[15px] leading-relaxed text-ink-soft">
              Wool, silk and linen cut for everyday wear, produced in short runs
              with mills in Portugal and Japan.
            </p>
          </Reveal>

          <Reveal delay={240}>
            {/* Primary CTA. Its identity is the arrow that travels on hover;
                without a coloured accent, motion is what signals interaction.
                Sentence case rather than ALL-CAPS to match the editorial
                voice of the headline above. */}
            <a
              href="#new"
              className="group mt-10 inline-flex items-center gap-3 bg-ink px-8 py-4 text-[13px] font-medium tracking-[0.02em] text-white transition-transform active:translate-y-px"
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
