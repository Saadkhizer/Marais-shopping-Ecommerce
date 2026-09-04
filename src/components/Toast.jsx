import { useCart } from "../context/CartContext.jsx";

export default function Toast() {
  const { toast } = useCart();

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed bottom-7 left-1/2 z-80 -translate-x-1/2 bg-ink px-6 py-3.5 text-[13.5px] text-white transition-all duration-300 ${
        toast ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      {toast}
    </div>
  );
}
