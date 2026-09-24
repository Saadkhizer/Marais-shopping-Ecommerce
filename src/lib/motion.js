/**
 * Motion tokens.
 *
 * The libraries are not the design — easing, timing and restraint are. These
 * numbers are the editorial personality: short distances, quick settles, almost
 * imperceptible. A noir or duotone build would use the same recipes with very
 * different numbers; mixing personalities in one site is what makes a page read
 * as assembled rather than designed.
 *
 * Change these five values, not the components.
 */
export const M = {
  ease: {
    entrance: "power2.out",  // arriving — restrained, no overshoot
    exit: "power2.in",
    move: "power3.inOut",
    scrub: "none",           // scroll-linked motion is ALWAYS linear
  },
  duration: { fast: 0.35, base: 0.7, slow: 0.9 },
  stagger: { tight: 0.05, loose: 0.09 },
  distance: { near: 16, far: 24 },
};

/** Viewport-heights of scroll the hero flight occupies. Longer = slower. */
export const FLIGHT_SCROLL_VH = 460;

/**
 * The flight. Six stations, one plane each, drawn from the lookbook shoot.
 *
 * Every image here is distinct from every other image on the site — the whole
 * point of the rebuild was that one photograph was doing three jobs. Portrait
 * crops throughout (2:3) so the planes share a silhouette and the flight reads
 * as one corridor rather than a pile of different shapes.
 */
const U = (id, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=82`;

export const STATIONS = [
  {
    id: "open",
    image: U("photo-1586081493946-c75071ee57c0"),
    alt: "Model in a grey wool coat, autumn winter campaign",
    eyebrow: "Autumn Winter 2026",
    title: "Considered essentials,<em> made to last</em>.",
    body:
      "Wool, silk and linen cut for everyday wear, produced in short runs with mills in Portugal and Japan.",
    cta: { label: "Shop the collection", href: "#new" },
  },
  {
    id: "cloth",
    image: U("photo-1642513616538-e9cd88a842b8"),
    alt: "Close study of a black wool coat",
    eyebrow: "The cloth",
    title: "Woven before it is cut.",
    body: "Mills first, patterns second. The fabric decides what the garment can be.",
  },
  {
    id: "cut",
    image: U("photo-1643578545817-135602f5b9e2"),
    alt: "Model walking in a white tailored coat",
    eyebrow: "The cut",
    title: "Room to move in.",
    body: "Drafted on real bodies, graded across eight sizes, then made again until it hangs right.",
  },
  {
    id: "runs",
    image: U("photo-1673105793839-6c2811a4e1e7"),
    alt: "Model in a coat and scarf holding a book",
    eyebrow: "Short runs",
    title: "Forty of a thing, not four thousand.",
    body: "Small batches mean we can stop making something that is not working.",
  },
  {
    id: "wear",
    image: U("photo-1637102146291-c408b298e22b"),
    alt: "Model in a trench coat in front of a building",
    eyebrow: "In wear",
    title: "Better in the third year.",
    body: "Everything here is chosen to age — wool that softens, linen that creases properly.",
  },
  {
    id: "close",
    image: U("photo-1619470149201-63960dec27cf"),
    alt: "Model in a grey coat against a pale wall",
    eyebrow: "The edit",
    title: "Three edits, one wardrobe.",
    body: "Women, men and the pieces that sit between them.",
    cta: { label: "Browse the edit", href: "#women" },
  },
];
