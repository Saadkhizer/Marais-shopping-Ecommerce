import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Reveal from "./Reveal.jsx";
import SmartImage from "./SmartImage.jsx";
import { lookbook } from "../data/products.js";

/* ---------------------------------------------------------------------------
   The Autumn lookbook — a continuously drifting rail.

   The arrows are gone: a lookbook is for browsing, not for operating, and a
   pair of chevrons turns a mood into a control panel. The rail moves on its
   own instead.

   Three things this has to get right, none of them optional:

   1. It must be stoppable. Content that moves for more than five seconds
      needs a way to pause it (WCAG 2.2.2), so the drift stops on hover and
      on keyboard focus anywhere inside the rail. Without that this is an
      accessibility failure, not a design choice.
   2. Reduced motion gets no drift at all — the rail falls back to the plain
      swipeable strip it used to be. Not a slower marquee; none.
   3. The loop must not visibly jump. The images are rendered twice and the
      track travels exactly -50%, so the moment it wraps, frame one is
      already sitting where frame one was.
--------------------------------------------------------------------------- */

// Seconds per full pass of one copy of the set. Slow on purpose: this is
// ambient, and anything quick enough to notice reads as an advertisement.
const SECONDS_PER_IMAGE = 6;

export default function Lookbook() {
  const trackRef = useRef(null);
  const shellRef = useRef(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    const shell = shellRef.current;
    if (!track || !shell) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // No drift — but the rail still has to be reachable, so it becomes a
      // plain scrollable strip. Stopping the motion without restoring the
      // scroll would put half the lookbook permanently out of reach.
      setReduced(true);
      return;
    }

    const drift = gsap.to(track, {
      xPercent: -50,
      duration: lookbook.length * SECONDS_PER_IMAGE,
      ease: "none",          // linear: a marquee that eases is a marquee that stutters
      repeat: -1,
    });

    const pause = () => drift.pause();
    const play = () => drift.play();

    shell.addEventListener("pointerenter", pause);
    shell.addEventListener("pointerleave", play);
    shell.addEventListener("focusin", pause);
    shell.addEventListener("focusout", play);
    // Nothing should animate in a background tab.
    const onVisibility = () => (document.hidden ? drift.pause() : drift.play());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      shell.removeEventListener("pointerenter", pause);
      shell.removeEventListener("pointerleave", play);
      shell.removeEventListener("focusin", pause);
      shell.removeEventListener("focusout", play);
      document.removeEventListener("visibilitychange", onVisibility);
      drift.kill();
    };
  }, []);

  // Rendered twice so the wrap lands on an identical frame. The second copy
  // is decorative duplication, so it is hidden from assistive tech. With the
  // drift off there is nothing to wrap, so one copy is enough.
  const frames = reduced ? lookbook : [...lookbook, ...lookbook];

  return (
    <section id="accessories" className="border-t border-line py-20 lg:py-24">
      <div className="mx-auto max-w-[1280px] px-6">
        <Reveal>
          <h2 className="max-w-[20ch] font-display text-3xl leading-tight font-semibold tracking-tight text-ink md:text-4xl">
            The Autumn lookbook
          </h2>
        </Reveal>
      </div>

      <div
        ref={shellRef}
        className={`relative mt-10 ${
          reduced ? "rail-scroll overflow-x-auto px-6 pb-2" : "overflow-hidden"
        }`}
      >
        <div
          ref={trackRef}
          className="flex w-max gap-3"
          style={reduced ? undefined : { willChange: "transform" }}
        >
          {frames.map((src, index) => {
            const duplicate = index >= lookbook.length;
            return (
              <SmartImage
                key={`${src}-${index}`}
                src={src}
                alt={duplicate ? "" : `Autumn lookbook frame ${index + 1}`}
                label={`Look ${(index % lookbook.length) + 1}`}
                className="h-[300px] w-[240px] shrink-0 object-cover md:h-[420px] md:w-[330px]"
              />
            );
          })}
        </div>

        {/* The rail runs edge to edge, so both ends fade into the page rather
            than stopping at a hard cut. Gradients, not a blur — the page's
            one blur is spent on the hero handoff. Skipped when the rail is a
            scrollable strip, where a fade would just obscure the ends. */}
        {!reduced && (
        <>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-28"
          style={{ background: "linear-gradient(to right, #fff, rgba(255,255,255,0))" }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-28"
          style={{ background: "linear-gradient(to left, #fff, rgba(255,255,255,0))" }}
        />
        </>
        )}
      </div>
    </section>
  );
}
