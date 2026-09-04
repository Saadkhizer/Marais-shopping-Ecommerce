import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="mx-auto max-w-[1280px] px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-[440px] text-center">
        <span className="font-mono text-[11px] font-medium tracking-[0.22em] uppercase text-accent-deep">
          Page not found
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-[-0.03em] text-ink lg:text-4xl">
          That page has moved on
        </h1>
        <p className="mt-4 text-[14.5px] leading-relaxed text-ink-soft">
          The link may be out of date, or the piece may have sold through.
        </p>
        <Link
          to="/"
          className="mt-8 inline-block bg-ink px-8 py-4 text-[12px] font-semibold tracking-[0.14em] uppercase text-white transition-colors hover:bg-accent-deep"
        >
          Back to the collection
        </Link>
      </div>
    </main>
  );
}
