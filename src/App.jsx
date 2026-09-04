import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import Toast from "./components/Toast.jsx";
import HomePage from "./routes/HomePage.jsx";
import CheckoutPage from "./routes/CheckoutPage.jsx";
import LoginPage from "./routes/LoginPage.jsx";
import SignupPage from "./routes/SignupPage.jsx";
import AccountPage from "./routes/AccountPage.jsx";
import OrderConfirmedPage from "./routes/OrderConfirmedPage.jsx";
import NotFoundPage from "./routes/NotFoundPage.jsx";

/**
 * Client side routing keeps the anchor links on the home page working while
 * giving checkout and the account screens real URLs a visitor can bookmark.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Only reset for real navigations, not for the in page anchors on the home
    // page, which the browser should handle itself.
    if (!window.location.hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />

      <div className="bg-ink px-4 py-2.5 text-center font-mono text-[11.5px] tracking-widest text-white/85">
        Free shipping over $75. Autumn Winter 2026 is now live.
      </div>

      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/order/:reference" element={<OrderConfirmedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Footer />

      <CartDrawer />
      <Toast />
    </>
  );
}
