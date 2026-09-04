import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormField from "../components/FormField.jsx";
import Notice from "../components/Notice.jsx";
import SmartImage from "../components/SmartImage.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../lib/api.js";
import {
  collectErrors,
  validateEmail,
  validatePostcode,
  validateRequired,
} from "../lib/validate.js";

const STEPS = ["Contact", "Shipping", "Review"];

const SHIPPING_METHODS = [
  {
    id: "standard",
    label: "Standard",
    detail: "Two to four working days",
    cost: 0,
    threshold: 75,
    paidCost: 6,
  },
  {
    id: "express",
    label: "Express",
    detail: "Next working day if ordered before 2pm",
    cost: 14,
  },
];

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({
    email: user?.email ?? "",
    fullName: user?.user_metadata?.full_name ?? "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    postcode: "",
    country: "United Kingdom",
    shippingMethod: "standard",
    notes: "",
  });

  const shipping = useMemo(() => {
    const method = SHIPPING_METHODS.find((m) => m.id === form.shippingMethod);
    if (!method) return 0;
    if (method.threshold !== undefined) {
      return subtotal >= method.threshold ? 0 : method.paidCost;
    }
    return method.cost;
  }, [form.shippingMethod, subtotal]);

  const total = subtotal + shipping;

  function update(field) {
    return (value) => {
      setForm((current) => ({ ...current, [field]: value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
      setSubmitError("");
    };
  }

  function validateStep(index) {
    if (index === 0) {
      return collectErrors({
        email: validateEmail(form.email),
        fullName: validateRequired(form.fullName, "full name"),
      });
    }
    if (index === 1) {
      return collectErrors({
        address1: validateRequired(form.address1, "street address"),
        city: validateRequired(form.city, "city"),
        postcode: validatePostcode(form.postcode),
        country: validateRequired(form.country, "country"),
      });
    }
    return {};
  }

  function goNext() {
    const found = validateStep(step);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  }

  async function placeOrder() {
    // Re-validate every earlier step. Someone can reach Review, go back, clear a
    // field, and return, so trusting the step index alone is not enough.
    const allErrors = { ...validateStep(0), ...validateStep(1) };
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      setStep(Object.keys(validateStep(0)).length > 0 ? 0 : 1);
      return;
    }

    setBusy(true);
    setSubmitError("");
    try {
      const order = await api.createOrder({
        items: items.map(({ id, size, qty }) => ({ id, size, qty })),
        customer: {
          email: form.email.trim(),
          fullName: form.fullName.trim(),
          phone: form.phone.trim() || null,
          userId: user?.id && user.id !== "demo" ? user.id : null,
        },
        shippingAddress: {
          line1: form.address1.trim(),
          line2: form.address2.trim() || null,
          city: form.city.trim(),
          postcode: form.postcode.trim(),
          country: form.country.trim(),
        },
        shippingMethod: form.shippingMethod,
        notes: form.notes.trim() || null,
      });

      clear();
      navigate(`/order/${order.reference}`, {
        replace: true,
        state: { order, justPlaced: true },
      });
    } catch (error) {
      setSubmitError(
        error.message ||
          "Could not place the order. Start the API with npm run server and try again."
      );
    } finally {
      setBusy(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-[1280px] px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-[440px] text-center">
          <h1 className="font-display text-3xl font-bold tracking-[-0.03em] text-ink">
            Your bag is empty
          </h1>
          <p className="mt-4 text-[14.5px] leading-relaxed text-ink-soft">
            Add a piece to the bag and the checkout opens here.
          </p>
          <Link
            to="/"
            className="mt-8 inline-block bg-ink px-8 py-4 text-[12px] font-semibold tracking-[0.14em] uppercase text-white transition-colors hover:bg-accent-deep"
          >
            Back to the collection
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1280px] px-6 py-12 lg:py-16">
      <h1 className="font-display text-3xl font-bold tracking-[-0.03em] text-ink lg:text-4xl">
        Checkout
      </h1>

      {/* Step indicator. Numbers and labels both, never color alone. */}
      <ol className="mt-8 flex flex-wrap gap-x-8 gap-y-2 border-b border-line pb-5">
        {STEPS.map((label, index) => {
          const state =
            index === step ? "current" : index < step ? "done" : "upcoming";
          return (
            <li key={label} className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className={`flex h-6 w-6 items-center justify-center rounded-full font-mono text-[11px] ${
                  state === "current"
                    ? "bg-ink text-white"
                    : state === "done"
                    ? "bg-accent-deep text-white"
                    : "border border-line text-ink-soft"
                }`}
              >
                {state === "done" ? "✓" : index + 1}
              </span>
              <span
                aria-current={state === "current" ? "step" : undefined}
                className={`font-mono text-[11.5px] tracking-[0.12em] uppercase ${
                  state === "upcoming" ? "text-ink-soft" : "text-ink"
                }`}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
        <div>
          {submitError && (
            <Notice tone="error" title="Order not placed" className="mb-7">
              {submitError}
            </Notice>
          )}

          {step === 0 && (
            <section aria-label="Contact details" className="space-y-5">
              {!user && (
                <Notice tone="info" className="mb-2">
                  Checking out as a guest.{" "}
                  <Link
                    to="/login"
                    state={{ from: "/checkout" }}
                    className="font-medium underline decoration-line underline-offset-4"
                  >
                    Sign in
                  </Link>{" "}
                  to save this order to an account.
                </Notice>
              )}

              <FormField
                id="email"
                label="Email address"
                type="email"
                value={form.email}
                onChange={update("email")}
                error={errors.email}
                autoComplete="email"
                placeholder="you@example.com"
                hint="Your order confirmation goes here."
              />
              <FormField
                id="fullName"
                label="Full name"
                value={form.fullName}
                onChange={update("fullName")}
                error={errors.fullName}
                autoComplete="name"
              />
              <FormField
                id="phone"
                label="Phone"
                type="tel"
                value={form.phone}
                onChange={update("phone")}
                error={errors.phone}
                autoComplete="tel"
                required={false}
                hint="Only used if there is a delivery problem."
              />
            </section>
          )}

          {step === 1 && (
            <section aria-label="Shipping details" className="space-y-5">
              <FormField
                id="address1"
                label="Street address"
                value={form.address1}
                onChange={update("address1")}
                error={errors.address1}
                autoComplete="address-line1"
              />
              <FormField
                id="address2"
                label="Apartment or unit"
                value={form.address2}
                onChange={update("address2")}
                error={errors.address2}
                autoComplete="address-line2"
                required={false}
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  id="city"
                  label="City"
                  value={form.city}
                  onChange={update("city")}
                  error={errors.city}
                  autoComplete="address-level2"
                />
                <FormField
                  id="postcode"
                  label="Postal code"
                  value={form.postcode}
                  onChange={update("postcode")}
                  error={errors.postcode}
                  autoComplete="postal-code"
                />
              </div>

              <FormField
                id="country"
                label="Country"
                value={form.country}
                onChange={update("country")}
                error={errors.country}
                autoComplete="country-name"
              />

              <fieldset className="pt-2">
                <legend className="mb-3 font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-ink">
                  Shipping method
                </legend>
                <div className="divide-y divide-line border border-line">
                  {SHIPPING_METHODS.map((method) => {
                    const cost =
                      method.threshold !== undefined
                        ? subtotal >= method.threshold
                          ? 0
                          : method.paidCost
                        : method.cost;
                    const selected = form.shippingMethod === method.id;

                    return (
                      <label
                        key={method.id}
                        className={`flex cursor-pointer items-start gap-3.5 px-4 py-4 transition-colors ${
                          selected ? "bg-paper-alt" : "hover:bg-paper-alt/60"
                        }`}
                      >
                        <input
                          type="radio"
                          name="shippingMethod"
                          value={method.id}
                          checked={selected}
                          onChange={() => update("shippingMethod")(method.id)}
                          className="mt-1 h-4 w-4 accent-black"
                        />
                        <span className="flex-1">
                          <span className="flex items-baseline justify-between gap-3">
                            <span className="text-[14px] font-semibold text-ink">
                              {method.label}
                            </span>
                            <span className="text-[14px] font-semibold text-ink">
                              {cost === 0 ? "Free" : `$${cost}`}
                            </span>
                          </span>
                          <span className="mt-0.5 block text-[12.5px] text-ink-soft">
                            {method.detail}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </section>
          )}

          {step === 2 && (
            <section aria-label="Review your order" className="space-y-8">
              <div className="border border-line">
                <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
                  <h2 className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-ink">
                    Contact
                  </h2>
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="text-[12.5px] text-ink underline decoration-line underline-offset-4 transition-colors hover:text-accent-deep"
                  >
                    Edit
                  </button>
                </div>
                <dl className="px-5 py-4 text-[14px] leading-relaxed text-ink-soft">
                  <div className="flex gap-2">
                    <dt className="sr-only">Name</dt>
                    <dd className="text-ink">{form.fullName}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="sr-only">Email</dt>
                    <dd>{form.email}</dd>
                  </div>
                  {form.phone && (
                    <div className="flex gap-2">
                      <dt className="sr-only">Phone</dt>
                      <dd>{form.phone}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="border border-line">
                <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
                  <h2 className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-ink">
                    Ships to
                  </h2>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[12.5px] text-ink underline decoration-line underline-offset-4 transition-colors hover:text-accent-deep"
                  >
                    Edit
                  </button>
                </div>
                <address className="px-5 py-4 text-[14px] leading-relaxed text-ink-soft not-italic">
                  <span className="block text-ink">{form.address1}</span>
                  {form.address2 && <span className="block">{form.address2}</span>}
                  <span className="block">
                    {form.city}, {form.postcode}
                  </span>
                  <span className="block">{form.country}</span>
                  <span className="mt-2 block font-mono text-[11.5px] tracking-[0.1em] uppercase">
                    {SHIPPING_METHODS.find((m) => m.id === form.shippingMethod)?.label}{" "}
                    shipping
                  </span>
                </address>
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="mb-2 block font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-ink"
                >
                  Delivery notes
                  <span className="ml-2 normal-case text-ink-soft">optional</span>
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={form.notes}
                  onChange={(event) => update("notes")(event.target.value)}
                  placeholder="Leave with a neighbour, ring the top bell, and so on."
                  className="w-full resize-y border border-line bg-white px-4 py-3 text-[14.5px] text-ink transition-colors outline-none placeholder:text-ink-soft/85 focus:border-ink"
                />
              </div>

              <Notice tone="info" title="No payment is taken">
                This build has no payment provider connected, so placing the order
                records it and returns a reference. Wiring Stripe Checkout is the
                usual next step and its test mode is free.
              </Notice>
            </section>
          )}

          {/* Step navigation. Back is a quiet underline, forward is the solid
              bar, so the primary path is never ambiguous. */}
          <div className="mt-10 flex flex-wrap items-center gap-6">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep((current) => current - 1)}
                className="text-[12px] font-semibold tracking-[0.14em] uppercase text-ink underline decoration-line underline-offset-[6px] transition-colors hover:text-accent-deep"
              >
                Back
              </button>
            ) : (
              <Link
                to="/"
                className="text-[12px] font-semibold tracking-[0.14em] uppercase text-ink underline decoration-line underline-offset-[6px] transition-colors hover:text-accent-deep"
              >
                Keep shopping
              </Link>
            )}

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                className="ml-auto bg-ink px-8 py-4 text-[12px] font-semibold tracking-[0.14em] uppercase text-white transition-colors hover:bg-accent-deep active:translate-y-px"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={placeOrder}
                disabled={busy}
                className="ml-auto bg-accent-deep px-8 py-4 text-[12px] font-semibold tracking-[0.14em] uppercase text-white transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? "Placing order" : `Place order  $${total}`}
              </button>
            )}
          </div>
        </div>

        {/* Order summary. Sticky on desktop so the total stays in view while the
            form is being filled in. */}
        <aside aria-label="Order summary" className="lg:sticky lg:top-24 lg:self-start">
          <div className="border border-line">
            <h2 className="border-b border-line px-5 py-3.5 font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-ink">
              Order summary
            </h2>

            <ul className="divide-y divide-line px-5">
              {items.map((item) => (
                <li key={`${item.id}-${item.size}`} className="flex gap-4 py-4">
                  <SmartImage
                    src={item.image}
                    alt={item.name}
                    label={item.name}
                    className="h-[76px] w-[62px] shrink-0 object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-[13.5px] font-medium text-ink">{item.name}</p>
                    <p className="mt-0.5 font-mono text-[11px] tracking-[0.1em] uppercase text-ink-soft">
                      Size {item.size} / Qty {item.qty}
                    </p>
                  </div>
                  <span className="text-[13.5px] font-semibold text-ink">
                    ${item.price * item.qty}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="space-y-2.5 border-t border-line px-5 py-4 text-[14px]">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Subtotal</dt>
                <dd className="text-ink">${subtotal}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Shipping</dt>
                <dd className="text-ink">{shipping === 0 ? "Free" : `$${shipping}`}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-2.5 text-[15px] font-semibold">
                <dt>Total</dt>
                <dd>${total}</dd>
              </div>
            </dl>
          </div>

          <p className="mt-4 text-[12px] leading-relaxed text-ink-soft">
            Totals are recalculated on the server from the catalog price when the
            order is placed, so nothing sent from this page can change what you
            are charged.
          </p>
        </aside>
      </div>
    </main>
  );
}
