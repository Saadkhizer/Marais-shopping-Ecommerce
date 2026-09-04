import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormField from "../components/FormField.jsx";
import Notice from "../components/Notice.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  collectErrors,
  validateEmail,
  validatePassword,
  validateRequired,
} from "../lib/validate.js";

export default function SignupPage() {
  const { signUp, isDemoMode } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [confirmationSent, setConfirmationSent] = useState(false);
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
      fullName: validateRequired(form.fullName, "full name"),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirm:
        form.confirm === form.password ? null : "The two passwords do not match.",
    });
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setBusy(true);
    setSubmitError("");
    try {
      const { needsConfirmation } = await signUp({
        email: form.email.trim(),
        password: form.password,
        fullName: form.fullName.trim(),
      });

      if (needsConfirmation) {
        setConfirmationSent(true);
        return;
      }
      navigate("/account", { replace: true });
    } catch (error) {
      setSubmitError(error.message || "Could not create your account.");
    } finally {
      setBusy(false);
    }
  }

  if (confirmationSent) {
    return (
      <main className="mx-auto max-w-[1280px] px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-[460px] text-center">
          <h1 className="font-display text-3xl font-bold tracking-[-0.03em] text-ink">
            Check your inbox
          </h1>
          <p className="mt-4 text-[14.5px] leading-relaxed text-ink-soft">
            We sent a confirmation link to {form.email.trim()}. Open it to finish
            creating your account, then come back and sign in.
          </p>
          <Link
            to="/login"
            className="mt-8 inline-block bg-ink px-8 py-4 text-[12px] font-semibold tracking-[0.14em] uppercase text-white transition-colors hover:bg-accent-deep"
          >
            Go to sign in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1280px] px-6 py-16 lg:py-24">
      <div className="mx-auto w-full max-w-[420px]">
        <h1 className="font-display text-3xl font-bold tracking-[-0.03em] text-ink">
          Create an account
        </h1>
        <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">
          One account for orders, returns and saved addresses.
        </p>

        {isDemoMode && (
          <Notice tone="info" title="Demo mode" className="mt-6">
            Supabase is not connected, so this form validates fully but the
            account is only held in memory for this tab.
          </Notice>
        )}

        {submitError && (
          <Notice tone="error" title="Could not create account" className="mt-6">
            {submitError}
          </Notice>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          <FormField
            id="fullName"
            label="Full name"
            value={form.fullName}
            onChange={update("fullName")}
            error={errors.fullName}
            autoComplete="name"
            placeholder="Saad Khizer"
          />

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
            autoComplete="new-password"
            hint="At least 8 characters, with a letter and a number."
          />

          <FormField
            id="confirm"
            label="Confirm password"
            type="password"
            value={form.confirm}
            onChange={update("confirm")}
            error={errors.confirm}
            autoComplete="new-password"
          />

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-ink py-4 text-[12px] font-semibold tracking-[0.14em] uppercase text-white transition-colors hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? "Creating account" : "Create account"}
          </button>
        </form>

        <p className="mt-7 text-center text-[14px] text-ink-soft">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-ink underline decoration-line underline-offset-4 transition-colors hover:text-accent-deep"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
