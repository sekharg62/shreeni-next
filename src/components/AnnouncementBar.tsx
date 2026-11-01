const messages = [
  "✦  Free shipping on all orders above ₹1999",
  "✦  Flat 10% off on your first purchase — code SHREENI10",
  "✦  Handpicked authentic weaves, delivered across India",
  "✦  Easy 7-day returns & exchange",
];

function MarqueeGroup({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul
      className="flex min-w-full shrink-0 items-center justify-around gap-x-12"
      aria-hidden={hidden || undefined}
    >
      {messages.map((msg, i) => (
        <li
          key={i}
          className="whitespace-nowrap text-sm font-medium tracking-wide"
        >
          {msg}
        </li>
      ))}
    </ul>
  );
}

export default function AnnouncementBar() {
  return (
    <div className="overflow-hidden bg-primary py-2 text-surface">
      {/* Two full-width copies so the scroll loops seamlessly on any screen. */}
      <div className="marquee-track flex">
        <MarqueeGroup />
        <MarqueeGroup hidden />
      </div>
    </div>
  );
}
