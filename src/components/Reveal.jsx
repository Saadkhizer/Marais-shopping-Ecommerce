import { useEffect, useRef, useState } from "react";

/**
 * Scroll reveal that animates transform only, never opacity down to zero.
 *
 * Content that waits at opacity 0 for an IntersectionObserver disappears in
 * print, in screenshots, and for anyone whose observer never fires. Starting at
 * a low but nonzero opacity keeps the text present in every one of those cases
 * while still reading as a reveal on screen.
 */
export default function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Guard for older browsers: show the content rather than hide it forever.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-[transform,opacity] duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-40"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
