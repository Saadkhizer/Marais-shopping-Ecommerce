import { useState } from "react";

/**
 * Image with a graceful failure state.
 *
 * If a remote photo does not load, the visitor sees a tinted panel carrying the
 * item name instead of a broken image icon. A portfolio site gets opened on
 * conference wifi and behind corporate proxies, and a broken image undoes the
 * whole impression.
 */
export default function SmartImage({ src, alt, className = "", label }) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-paper-alt ${className}`}
        role="img"
        aria-label={alt}
      >
        <span className="px-4 text-center font-mono text-[11px] tracking-[0.18em] uppercase text-ink-soft">
          {label || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
