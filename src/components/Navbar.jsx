import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const sectionLinks = [
  { href: "/#new", label: "New Arrivals" },
  { href: "/#women", label: "Women" },
  { href: "/#men", label: "Men" },
  { href: "/#accessories", label: "Accessories" },
];

export default function Navbar() {
  const { count, openCart } = useCart();
  const { user } = useAuth();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile drawer whenever the route changes, otherwise it stays open
  // over the page the visitor just navigated to.
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        scrolled ? "border-line bg-white/95 backdrop-blur-md" : "border-line bg-white"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-6">
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation"
          className="-ml-2 flex h-10 w-10 items-center justify-center text-ink lg:hidden"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" strokeWidth="1.7" stroke="currentColor">
            {mobileOpen ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M3 7h18M3 17h18" strokeLinecap="round" />
            )}
          </svg>
        </button>

        <Link
          to="/"
          className="font-display text-[22px] font-bold tracking-[0.22em] text-ink"
        >
          MARAIS
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {sectionLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative py-1 text-[14px] text-ink-soft transition-colors hover:text-ink"
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-accent transition-[width] duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-3">
          {/* Account control. Its identity is the underline that appears on the
              label, keeping it visibly lighter than the bag button beside it. */}
          <NavLink
            to={user ? "/account" : "/login"}
            className="group hidden h-10 items-center gap-2 px-2.5 text-[13px] text-ink sm:flex"
          >
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" strokeWidth="1.6" stroke="currentColor">
              <circle cx="12" cy="8" r="3.4" />
              <path d="M4.8 20c1.5-3.5 4.3-5.3 7.2-5.3S17.7 16.5 19.2 20" strokeLinecap="round" />
            </svg>
            <span className="border-b border-transparent pb-0.5 transition-colors group-hover:border-ink">
              {user ? "Account" : "Sign in"}
            </span>
          </NavLink>

          {/* Bag control. Its identity is the ring that tightens on hover. */}
          <button
            type="button"
            onClick={openCart}
            className="group relative -mr-2 flex h-10 items-center gap-2 px-3 text-[13px] font-medium text-ink ring-1 ring-transparent transition-all hover:ring-ink active:scale-[0.97]"
          >
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" strokeWidth="1.6" stroke="currentColor">
              <path d="M6.5 8h11l-1 11.5h-9L6.5 8z" strokeLinejoin="round" />
              <path d="M9.5 8a2.5 2.5 0 0 1 5 0" strokeLinecap="round" />
            </svg>
            <span className="hidden sm:inline">Bag</span>
            {count > 0 && (
              <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent-deep px-1 font-mono text-[10px] font-medium text-white">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-line bg-white px-6 py-4 lg:hidden">
          {sectionLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block border-b border-line py-3 text-[15px] text-ink"
            >
              {link.label}
            </a>
          ))}
          <Link
            to={user ? "/account" : "/login"}
            className="block py-3 text-[15px] font-medium text-ink"
          >
            {user ? "Your account" : "Sign in or create an account"}
          </Link>
        </nav>
      )}
    </header>
  );
}
