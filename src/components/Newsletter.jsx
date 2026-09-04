import { useState } from "react";
import { api } from "../lib/api.js";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState({ status: "idle", message: "" });

  async function handleSubmit(event) {
    event.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setState({ status: "error", message: "Enter a valid email address." });
      return;
    }

    setState({ status: "working", message: "" });
    try {
      await api.subscribe(email);
      setState({
        status: "done",
        message: "You are on the list. Your code is on its way.",
      });
      setEmail("");
    } catch {
      setState({
        status: "error",
        message:
          "Could not reach the subscribe service. Start the Express server with npm run server.",
      });
    }
  }

  return (
    <section className="bg-ink text-white">
      <div className="mx-auto max-w-[1280px] px-6 py-20 text-center lg:py-24">
        <span className="font-mono text-[11px] font-medium tracking-[0.22em] uppercase text-white/75">
          Stay in the loop
        </span>
        <h2 className="mx-auto mt-4 max-w-[22ch] font-display text-3xl leading-tight font-semibold tracking-tight md:text-[38px]">
          Fifteen percent off your first order
        </h2>
        <p className="mx-auto mt-4 max-w-[46ch] text-[14.5px] leading-relaxed text-white/80">
          Early access to new drops, restocks and studio news. One email a month,
          nothing else.
        </p>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mx-auto mt-9 flex w-full max-w-[440px] flex-col gap-3 text-left sm:flex-row"
        >
          <div className="flex-1">
            <label
              htmlFor="newsletter-email"
              className="mb-2 block font-mono text-[11px] tracking-[0.14em] uppercase text-white/80"
            >
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              aria-invalid={state.status === "error"}
              className="w-full border border-white/45 bg-transparent px-4 py-3.5 text-[14px] text-white transition-colors outline-none placeholder:text-white/55 focus:border-white"
            />
          </div>

          {/* Subscribe CTA. Its identity is the inverted white block that lifts
              on hover, the only inverted button on the page. */}
          <button
            type="submit"
            disabled={state.status === "working"}
            className="mt-0 shrink-0 self-end bg-white px-7 py-3.5 text-[12px] font-semibold tracking-[0.14em] uppercase text-ink transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {state.status === "working" ? "Sending" : "Subscribe"}
          </button>
        </form>

        {state.message && (
          <p
            role="status"
            className="mx-auto mt-4 max-w-[46ch] text-[13px] leading-relaxed text-white/90"
          >
            {state.message}
          </p>
        )}
      </div>
    </section>
  );
}
