/**
 * Seed catalog.
 *
 * The Express API serves the real catalog from Supabase. This array is the
 * offline fallback so the site is fully browsable with nothing else running,
 * and it doubles as the shape contract the API rows have to match.
 *
 * Replace the image URLs with the client's own product photography. Generic
 * stock imagery is the single biggest tell that a site came off a template.
 */
export const products = [
  {
    id: 1,
    name: "Wool Overcoat",
    category: "Outerwear",
    audience: "Women",
    price: 248,
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80",
    description:
      "Double breasted overcoat in Portuguese wool, lined for warmth without the bulk. Falls just below the knee.",
    fabric: "82% wool, 18% recycled polyamide",
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: 2,
    name: "Silk Slip Dress",
    category: "Dresses",
    audience: "Women",
    price: 128,
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80",
    description:
      "Bias cut silk with adjustable straps. Wears alone in summer and layers under knitwear the rest of the year.",
    fabric: "100% mulberry silk",
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: 3,
    name: "Relaxed Linen Shirt",
    category: "Shirts",
    audience: "Men",
    price: 98,
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80",
    description:
      "Garment washed linen with a soft collar and dropped shoulder, cut generously through the body.",
    fabric: "100% European flax linen",
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: 4,
    name: "Tailored Trousers",
    category: "Trousers",
    audience: "Men",
    price: 138,
    image:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80",
    description:
      "Mid rise wool blend trousers with a tapered leg and a single clean front pleat.",
    fabric: "68% wool, 30% viscose, 2% elastane",
    sizes: ["28", "30", "32", "34", "36"],
  },
  {
    id: 5,
    name: "Cashmere Crew",
    category: "Knitwear",
    audience: "Women",
    price: 168,
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80",
    description:
      "Two ply cashmere, brushed for softness, in a relaxed crew neck that holds its shape.",
    fabric: "100% grade A cashmere",
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: 6,
    name: "Selvedge Denim Jacket",
    category: "Outerwear",
    audience: "Men",
    price: 158,
    image:
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=900&q=80",
    description:
      "Rigid selvedge denim, built to break in and soften into its own shape with wear.",
    fabric: "100% cotton selvedge denim, 13.5oz",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 7,
    name: "Pleated Midi Skirt",
    category: "Skirts",
    audience: "Women",
    price: 112,
    image:
      "https://images.unsplash.com/photo-1583496661160-fb5886a13d77?auto=format&fit=crop&w=900&q=80",
    description:
      "Fluid pleating in a satin back crepe, finished with a concealed side zip and no waistband bulk.",
    fabric: "100% recycled polyester crepe",
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: 8,
    name: "Leather Tote",
    category: "Bags",
    audience: "Accessories",
    price: 198,
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80",
    description:
      "Vegetable tanned leather with reinforced handles and an internal zip pocket. Fits a 14 inch laptop.",
    fabric: "Vegetable tanned full grain leather",
    sizes: ["One size"],
  },
];

export const categories = [
  {
    slug: "women",
    label: "Women",
    count: 42,
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "men",
    label: "Men",
    count: 36,
    image:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "accessories",
    label: "Accessories",
    count: 18,
    image:
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=800&q=80",
  },
];

export const lookbook = [
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1495121605193-b116b5b9c5fe?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=700&q=80",
];
