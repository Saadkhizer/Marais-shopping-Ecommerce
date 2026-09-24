import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import Hero from "./Hero.jsx";

/**
 * Decides which hero the visitor gets, and keeps three.js out of the main
 * bundle for everyone who does not get the flight.
 *
 * The scroll-world is roughly 650KB of library before a single photograph
 * loads. Importing it at the top of the module would put that on the critical
 * path of every route, including checkout — so it is a lazy import behind a
 * capability check, and the static hero is both the fallback and the default.
 *
 * Order matters here: render Hero first, decide afterwards. A visitor on a
 * slow connection sees a complete, readable hero immediately rather than a
 * blank frame waiting on a chunk, and if anything at all goes wrong — reduced
 * motion, no WebGL, a chunk that fails to arrive, a context that dies on
 * creation — that is simply where the page stays.
 */
const ScrollWorld = lazy(() => import("./ScrollWorld.jsx"));

function canFly() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return false;

  // A phone that can just about run the corridor still has to download it
  // first, usually on mobile data. Not worth it — the static hero is the
  // better experience there, not a lesser one.
  if (window.matchMedia?.("(max-width: 767px)").matches) return false;
  if (navigator.connection?.saveData) return false;

  try {
    const probe = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (probe.getContext("webgl2") || probe.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

export default function HeroStage() {
  const [flying, setFlying] = useState(false);

  useEffect(() => {
    if (canFly()) setFlying(true);
  }, []);

  const fallBack = useCallback(() => setFlying(false), []);

  if (!flying) return <Hero />;

  return (
    <Suspense fallback={<Hero />}>
      <ScrollWorld onFail={fallBack} />
    </Suspense>
  );
}
