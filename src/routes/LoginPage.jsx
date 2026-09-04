import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FormField from "../components/FormField.jsx";
import Notice from "../components/Notice.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { collectErrors, validateEmail } from "../lib/validate.js";

export default function LoginPage() {
  const { signIn, isDemoMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from ?? "/account";

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [busy, setBusy] = useState(false);

  function update(field) {
    return (value) => {
      setForm((current) => ({ ...current, [field]: value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
      setSubmitError("");
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const found = collectErrors({
      email: validateEmail(form.email),
      password: form.password ? null : "Enter your password.",
    });
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setBusy(true);
    setSubmitError("");
    try {
      await signIn({ email: form.email.trim(), password: form.password });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setSubmitError(error.message || "Could not sign you in. Check your details.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex max-w-[1280px] flex-col justify-center px-6 py-16 lg:py-24">
      <div className="mx-auto w-full max-w-[420px]">
        <h1 className="font-display text-3xl font-bold tracking-[-0.03em] text-ink">
          Sign in
        </h1>
        <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">
          Track orders, save addresses and check out faster.
        </p>

        {isDemoMode && (
          <Notice tone="info" title="Demo mode" className="mt-6">
            Supabase is not connected, so any email and password will sign you in
            and the session lasts until you close the tab. Add your keys to
            .env to switch on real accounts.
          </Notice>
        )}

        {submitError && (
          <Notice tone="error" title="Sign in failed" className="mt-6">
            {submitError}
          </Notice>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          <FormField
            id="email"
            label="Email address"
            type="email"
            value={form.email}
            onChange={update("email")}
            error={errors.email}
            autoComplete="email"
            placeholder="you@example.com"
          />

          <FormField
            id="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={update("password")}
            error={errors.password}
            autoComplete="current-password"
          />

          {/* Sign in CTA. Full width ink bar, the same weight as checkout, since
              both are the single decisive action on their page. */}
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-ink py-4 text-[12px] font-semibold tracking-[0.14em] uppercase text-white transition-colors hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? "Signing in" : "Sign in"}
          </button>
        </form>

        <p className="mt-7 text-center text-[14px] text-ink-soft">
          No account yet?{" "}
          <Link
            to="/signup"
            className="font-medium text-ink underline decoration-line underline-offset-4 transition-colors hover:text-accent-deep"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
