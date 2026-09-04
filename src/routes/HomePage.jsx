import { useCallback, useEffect, useState } from "react";
import Hero from "../components/Hero.jsx";
import CategoryGrid from "../components/CategoryGrid.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import Editorial from "../components/Editorial.jsx";
import UspStrip from "../components/UspStrip.jsx";
import Lookbook from "../components/Lookbook.jsx";
import Newsletter from "../components/Newsletter.jsx";
import QuickView from "../components/QuickView.jsx";
import { api } from "../lib/api.js";
import { products as seedProducts } from "../data/products.js";

export default function HomePage() {
  const [catalog, setCatalog] = useState([]);
  const [source, setSource] = useState("seed");
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCatalog() {
      try {
        const rows = await api.getProducts();
        if (cancelled) return;
        if (Array.isArray(rows) && rows.length > 0) {
          setCatalog(rows);
          setSource("api");
          return;
        }
        setCatalog(seedProducts);
        setSource("seed");
      } catch {
        // Seed fallback keeps the store browsable with no server and no database.
        if (!cancelled) {
          setCatalog(seedProducts);
          setSource("seed");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCatalog();
    return () => {
      cancelled = true;
    };
  }, []);

  const closeQuickView = useCallback(() => setQuickViewProduct(null), []);

  return (
    <>
      <Hero />
      <CategoryGrid />
      <ProductGrid
        products={catalog}
        loading={loading}
        source={source}
        onQuickView={setQuickViewProduct}
      />
      <Editorial />
      <UspStrip />
      <Lookbook />
      <Newsletter />
      <QuickView product={quickViewProduct} onClose={closeQuickView} />
    </>
  );
}
