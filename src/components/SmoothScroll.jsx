import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Smooth scroll provider. Mounted once, at the app root — never nested.
 *
 * Lenis rather than ScrollSmoother: lighter, and noticeably better on phones,
 * which is where most of this traffic lands. Running both at once is a known
 * way to get two scroll positions fighting each other, so only one exists here.
 *
 * Two things this has to get right:
 *
 *   - Reduced motion means no smoothing at all. Hijacked scroll is one of the
 *     worst offenders for anyone with vestibular sensitivity, so the whole
 *     thing is skipped rather than shortened.
 *   - CSS `scroll-behavior: smooth` fights Lenis for control of the same
 *     scroll. It is set to auto while Lenis owns scrolling and restored on
 *     unmount, so the stylesheet default still applies if this never runs.
 */
export default function SmoothScroll({ children }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      touchMultiplier: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      root.style.scrollBehavior = previousBehavior;
    };
  }, []);

  return children;
}
