import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * A rule that draws itself left to right as it enters.
 *
 * The editorial look uses hairline rules where other styles use cards, so
 * drawing the rule is motion that belongs to the design rather than motion
 * added on top of it. It is also the cheapest possible animation: one scaleX
 * on one element, no layout, no paint.
 *
 * `once: true` on purpose. Re-running an entrance every time the visitor
 * scrolls back up is the clearest tell of a page that animates for its own
 * sake.
 */
export default function Hairline({ className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(el, {
        scaleX: 0,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`block h-px w-full origin-left bg-line ${className}`}
    />
  );
}
