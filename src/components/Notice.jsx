/**
 * Inline message block. Three tones, all of which pass contrast on white, and
 * none of which relies on color alone to carry meaning: each has its own icon
 * and its own text.
 */
const tones = {
  info: { border: "border-line", bg: "bg-paper-alt", text: "text-ink", icon: "M12 8h.01M11 12h1v4h1" },
  error: { border: "border-accent-deep", bg: "bg-white", text: "text-accent-deep", icon: "M12 8v5M12 16h.01" },
  success: { border: "border-ink", bg: "bg-white", text: "text-ink", icon: "M8 12.5l2.6 2.6L16 9.5" },
};

export default function Notice({ tone = "info", title, children, className = "" }) {
  const style = tones[tone] ?? tones.info;

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex gap-3 border ${style.border} ${style.bg} px-4 py-3.5 ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={`mt-0.5 h-4.5 w-4.5 shrink-0 ${style.text}`}
        fill="none"
        strokeWidth="1.7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d={style.icon} />
      </svg>
      <div className={`text-[13px] leading-relaxed ${style.text}`}>
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={title ? "mt-1" : ""}>{children}</div>}
      </div>
    </div>
  );
}
