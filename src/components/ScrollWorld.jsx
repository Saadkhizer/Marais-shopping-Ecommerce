import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FLIGHT_SCROLL_VH, STATIONS } from "../lib/motion.js";

/* ---------------------------------------------------------------------------
   Scroll-world hero — a scrubbed camera flight through the lookbook.

   The camera moves forward down a corridor of image planes while the page
   scrolls. It is the site's one signature move; everything below it stays
   deliberately still, which is what keeps this reading as editorial rather
   than as a showreel.

   Three decisions worth keeping:

   1. No video. The equivalent effect is usually pre-rendered clips, which
      means a render bill and megabytes of MP4. Six JPEGs on planes cost
      nothing to produce and the images are the ones already earning their
      place in the collection.

   2. The <h1> and every caption live in normal DOM, above the canvas. If
      WebGL is unavailable, the script fails, or the visitor has reduced
      motion turned on, the static Hero renders instead and no copy is lost.
      Text gated behind a canvas is text a crawler never sees.

   3. Progress is read in one rAF loop straight from the container's rect,
      and written to refs — never to React state. Driving a scrubbed
      animation through setState re-renders the tree sixty times a second.

   This module is loaded lazily by HeroStage and pulls in all of three.js, so
   nothing here runs — or downloads — for a visitor who gets the static hero.
--------------------------------------------------------------------------- */

const SPACING = 7;          // world units between stations
const LEAD = 5.5;           // how far IN FRONT of a plane the camera sits at that
                            // station's peak — see the derivation below
const PLANE_W = 1.7;
const PLANE_H = 2.55;       // 2:3, matching the crops

/*
 * Camera path, derived rather than eyeballed.
 *
 * Caption i peaks at p = (i + 0.5) / N, and plane i sits at z = -i * SPACING.
 * For the photograph to be framed when its caption is at full strength, the
 * camera has to be LEAD units in front of that plane at that exact moment:
 *
 *     camZ(p_i) = -i * SPACING + LEAD
 *
 * camZ is linear in p and p is linear in i, so one pair of endpoints satisfies
 * every station at once:
 *
 *     CAM_START = LEAD + SPACING / 2
 *     CAM_END   = CAM_START - SPACING * N
 *
 * The first attempt used round numbers instead, which put the camera level
 * with each plane exactly when its caption peaked — so every photograph swung
 * past the edge of the frame at the moment it was meant to be read.
 */
const CAM_START = LEAD + SPACING / 2;

// Lateral placement per station.
//
// Every plane sits right of centre, which is not decoration: the captions hold
// the left column, and a photograph passing behind dark serif type is a
// legibility failure no amount of art direction fixes. Varying the depth and
// the amount of right-hand offset keeps it from reading as a single sliding
// column, and the split mirrors the static hero the fallback shows anyway.
// At LEAD units away the visible half-width is about 3.1 world units, so
// these land each photograph between roughly 70% and 85% of the frame width —
// clear of the caption column without sliding out of shot.
const OFFSETS = [1.55, 1.85, 1.45, 1.95, 1.6, 1.75];

export default function ScrollWorld({ onFail }) {
  const shellRef = useRef(null);   // the tall section — drives progress
  const stageRef = useRef(null);   // the sticky viewport box — drives size
  const canvasRef = useRef(null);
  const captionRefs = useRef([]);
  const progressRef = useRef(0);

  useEffect(() => {
    const shell = shellRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!shell || !stage || !canvas) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      });
    } catch {
      // Context creation can still fail after the capability check (blocklisted
      // driver, too many live contexts). Hand back to the static hero.
      onFail?.();
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0xffffff, 1);

    const scene = new THREE.Scene();
    // Planes emerge out of white instead of out of black. On an editorial page
    // the ground colour is the brand; a dark vignette would read as a different
    // site entirely.
    scene.fog = new THREE.Fog(0xffffff, 5, 30);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, CAM_START);

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");

    const geometry = new THREE.PlaneGeometry(PLANE_W, PLANE_H);
    const disposables = [geometry];
    const planes = [];

    STATIONS.forEach((station, i) => {
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,          // held until the texture actually arrives
        toneMapped: false,
      });
      disposables.push(material);

      loader.load(
        station.image,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.anisotropy = Math.min(
            4,
            renderer.capabilities.getMaxAnisotropy()
          );
          material.map = texture;
          material.opacity = 1;
          material.needsUpdate = true;
          disposables.push(texture);
        },
        undefined,
        () => {
          // A photo that never loads leaves a soft grey panel rather than a
          // hole in the corridor.
          material.color.set(0xeeebe4);
          material.opacity = 1;
          material.needsUpdate = true;
        }
      );

      const mesh = new THREE.Mesh(geometry, material);
      const x = OFFSETS[i] ?? 0;
      mesh.position.set(x, i % 2 === 0 ? 0.12 : -0.1, -i * SPACING);
      // Angle each plane back toward the centre line so the row reads as a
      // corridor you are moving through, not a wall you are sliding past.
      mesh.rotation.y = -0.22;
      scene.add(mesh);
      planes.push(mesh);
    });

    const camEnd = CAM_START - SPACING * STATIONS.length;
    const captions = captionRefs.current;

    function resize() {
      // Measure the sticky stage, never the shell. The shell is 460vh tall, so
      // sizing the renderer from it produces a 1280x3956 drawing buffer inside
      // an 860px-tall canvas — every plane stretched and mis-framed.
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // Pull the corridor in on narrow screens, otherwise the planes sit
      // outside the frame and the flight looks like an empty white tunnel.
      const narrow = Math.min(1, w / 900);
      camera.fov = 42 + (1 - narrow) * 16;
      camera.updateProjectionMatrix();
    }

    let frame = 0;

    function tick() {
      frame = requestAnimationFrame(tick);

      const rect = shell.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const raw = travel > 0 ? -rect.top / travel : 0;
      const p = Math.min(1, Math.max(0, raw));
      progressRef.current = p;

      // Linear, always. Easing a scrubbed tween fights the user's finger.
      camera.position.z = CAM_START + (camEnd - CAM_START) * p;
      // A hair of lateral drift so the flight has a hand on it.
      camera.position.x = Math.sin(p * Math.PI * 1.6) * 0.32;
      camera.rotation.y = -camera.position.x * 0.045;

      // The one blur on this page: the corridor softens as it hands off to the
      // page below, so the seam between canvas and content is not a hard cut.
      const handoff = Math.max(0, (p - 0.86) / 0.14);
      canvas.style.filter = handoff > 0 ? `blur(${(handoff * 7).toFixed(2)}px)` : "";
      canvas.style.opacity = String(1 - handoff * 0.35);

      // Captions: each owns a slice of the flight and fades at its edges.
      const slice = 1 / STATIONS.length;
      captions.forEach((node, i) => {
        if (!node) return;
        const centre = slice * (i + 0.5);
        const d = Math.abs(p - centre) / (slice * 0.78);
        const vis = Math.max(0, 1 - d);
        node.style.opacity = String(vis);
        node.style.transform = `translate3d(0, ${((1 - vis) * 22).toFixed(1)}px, 0)`;
        node.style.pointerEvents = vis > 0.55 ? "auto" : "none";
        node.setAttribute("aria-hidden", vis > 0.35 ? "false" : "true");
      });

      renderer.render(scene, camera);
    }

    resize();
    window.addEventListener("resize", resize);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      planes.forEach((mesh) => scene.remove(mesh));
      disposables.forEach((d) => d.dispose?.());
      renderer.dispose();
    };
  }, [onFail]);

  return (
    <section
      ref={shellRef}
      id="top"
      className="relative border-b border-line bg-paper"
      style={{ height: `${FLIGHT_SCROLL_VH}vh` }}
      aria-label="Autumn Winter 2026 collection"
    >
      <div ref={stageRef} className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
          style={{ willChange: "filter, opacity" }}
        />

        {/* Reading ground for the caption column. A plain left-to-right
            gradient rather than a backdrop-filter: it costs one paint, works
            on every GPU, and the page's single blur is already spent on the
            handoff at the end of the flight. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, #fff 0%, #fff 26%, rgba(255,255,255,0.86) 40%, rgba(255,255,255,0) 58%)",
          }}
        />

        {/* Copy sits in the DOM, not in the canvas. Readable with the scene
            broken, selectable, and crawlable. */}
        <div className="pointer-events-none absolute inset-0 flex items-center">
          <div className="relative mx-auto w-full max-w-[1280px] px-6 sm:px-8">
            {STATIONS.map((station, i) => (
              <div
                key={station.id}
                ref={(node) => {
                  captionRefs.current[i] = node;
                }}
                className="absolute top-1/2 w-full max-w-[30ch] -translate-y-1/2 transition-none lg:max-w-[34ch]"
                style={{ opacity: i === 0 ? 1 : 0, willChange: "opacity, transform" }}
              >
                <span className="font-display text-[15px] italic text-ink-soft">
                  {station.eyebrow}
                </span>

                {i === 0 ? (
                  <h1
                    className="mt-4 font-display text-[2.75rem] leading-[1.02] font-normal tracking-[-0.015em] text-ink md:text-6xl lg:text-[4.25rem]"
                    style={{ fontVariationSettings: '"opsz" 120' }}
                    dangerouslySetInnerHTML={{ __html: station.title }}
                  />
                ) : (
                  <p
                    className="mt-4 font-display text-[2rem] leading-[1.08] font-normal tracking-[-0.015em] text-ink md:text-[2.75rem]"
                    style={{ fontVariationSettings: '"opsz" 96' }}
                    dangerouslySetInnerHTML={{ __html: station.title }}
                  />
                )}

                <p className="mt-6 max-w-[42ch] text-[15px] leading-relaxed text-ink-soft">
                  {station.body}
                </p>

                {station.cta && (
                  <a
                    href={station.cta.href}
                    className="group pointer-events-auto mt-8 inline-flex items-center gap-3 bg-ink px-8 py-4 text-[13px] font-medium tracking-[0.02em] text-white transition-transform active:translate-y-px"
                  >
                    {station.cta.label}
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      strokeWidth="1.8"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M4 12h15M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
