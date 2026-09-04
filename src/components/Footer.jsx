const columns = [
  {
    heading: "Shop",
    links: ["Women", "Men", "Accessories", "Gift cards"],
  },
  {
    heading: "Help",
    links: ["Shipping and returns", "Size guide", "Track order", "Contact us"],
  },
  {
    heading: "Studio",
    links: ["Our approach", "Materials", "Stockists", "Careers"],
  },
];

const socials = [
  { label: "Instagram", d: "M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zm4 5.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" },
  { label: "Pinterest", d: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm-2.6 14.2c1-2.9 1.5-5.8 1.5-7.6a2.5 2.5 0 0 1 5 0c0 1.6-1 4-2.6 4" },
  { label: "Newsletter", d: "M3.5 6.5h17v11h-17zM3.5 7l8.5 6 8.5-6" },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto max-w-[1280px] px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 gap-10 border-b border-line pb-12 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-[22px] font-semibold tracking-[0.22em] text-ink">
              MARAIS
            </p>
            <p className="mt-4 max-w-[34ch] text-[14px] leading-relaxed text-ink-soft">
              Considered wardrobe essentials in natural fabrics, designed in
              house and produced in small batches.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.heading}>
              <p className="font-mono text-[11px] font-medium tracking-[0.16em] uppercase text-ink-soft">
                {column.heading}
              </p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#top"
                      className="text-[14px] text-ink transition-colors hover:text-accent-deep"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-7">
          <p className="font-mono text-[11.5px] tracking-[0.06em] text-ink-soft">
            2026 MARAIS Studio. Demo store built with React, Express and Supabase.
          </p>

          <div className="flex gap-2.5">
            {socials.map((social) => (
              <a
                key={social.label}
                href="#top"
                aria-label={social.label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" strokeWidth="1.4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <path d={social.d} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
