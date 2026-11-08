/**
 * "🇮🇳 +91" country-code prefix for mobile number fields.
 * The flag is an inline SVG: flag emoji don't render on Windows (they show as "IN").
 */
export default function IndiaPhonePrefix() {
  return (
    <span className="flex items-center gap-2">
      <svg viewBox="0 0 30 20" className="h-3.5 w-5 shrink-0 rounded-[2px] shadow-[0_0_0_0.5px_rgba(0,0,0,0.2)]" aria-hidden="true">
        <rect width="30" height="20" fill="#fff" />
        <rect width="30" height="6.67" fill="#FF9933" />
        <rect y="13.33" width="30" height="6.67" fill="#138808" />
        <circle cx="15" cy="10" r="2.6" fill="none" stroke="#000080" strokeWidth="0.6" />
        <circle cx="15" cy="10" r="0.5" fill="#000080" />
        <g stroke="#000080" strokeWidth="0.25">
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i * Math.PI) / 12;
            const dx = 2.6 * Math.cos(a);
            const dy = 2.6 * Math.sin(a);
            return <line key={i} x1={15 - dx} y1={10 - dy} x2={15 + dx} y2={10 + dy} />;
          })}
        </g>
      </svg>
      <span className="font-medium text-dark">+91</span>
      <span className="sr-only">India country code</span>
    </span>
  );
}
