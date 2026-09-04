/**
 * Thin divided band. Borders rather than cards, because none of these four
 * items sits at a different level of hierarchy from the others.
 */
const items = [
  {
    title: "Free shipping over $75",
    body: "Two to four working days",
    path: "M3 7.5h12v9H3zM15 10.5h3.2l2.3 3.2v2.8H15z",
  },
  {
    title: "Thirty day returns",
    body: "Free exchanges both ways",
    path: "M4 5v5h5M20 19v-5h-5M20 10a8 8 0 0 0-14-4.5M4 14a8 8 0 0 0 14 4.5",
  },
  {
    title: "Traceable production",
    body: "Named mills, audited factories",
    path: "M12 3.5l7.5 3.6v4.6c0 4.6-3.2 7.9-7.5 8.3-4.3-.4-7.5-3.7-7.5-8.3V7.1z",
  },
  {
    title: "Encrypted checkout",
    body: "Card details never stored",
    path: "M4.5 10.5h15v9h-15zM8.2 10.5V7.4a3.8 3.8 0 0 1 7.6 0v3.1",
  },
];

export default function UspStrip() {
  return (
    <section className="border-y border-line bg-paper-alt">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 divide-y divide-line px-6 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
        {items.map((item) => (
          <div key={item.title} className="flex gap-4 py-8 lg:px-8 lg:first:pl-0 lg:last:pr-0">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="mt-0.5 h-5 w-5 shrink-0 text-accent-deep"
              fill="none"
              strokeWidth="1.4"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={item.path} />
            </svg>
            <div>
              <p className="text-[13.5px] font-semibold text-ink">{item.title}</p>
              <p className="mt-1 text-[12.5px] text-ink-soft">{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
