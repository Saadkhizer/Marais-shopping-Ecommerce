/**
 * One input, one contract: label above, error below, never a placeholder acting
 * as the label. Errors are wired to the input with aria-describedby so a screen
 * reader announces them, and aria-invalid marks the field itself.
 */
export default function FormField({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  hint,
  autoComplete,
  placeholder,
  required = true,
  className = "",
}) {
  const describedBy = [error ? `${id}-error` : null, hint ? `${id}-hint` : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-2 block font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-ink"
      >
        {label}
        {!required && <span className="ml-2 normal-case text-ink-soft">optional</span>}
      </label>

      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy || undefined}
        className={`w-full border bg-white px-4 py-3 text-[14.5px] text-ink transition-colors outline-none placeholder:text-ink-soft/85 focus:border-ink ${
          error ? "border-accent-deep" : "border-line"
        }`}
      />

      {hint && !error && (
        <p id={`${id}-hint`} className="mt-2 text-[12.5px] text-ink-soft">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-[12.5px] font-medium text-accent-deep">
          {error}
        </p>
      )}
    </div>
  );
}
