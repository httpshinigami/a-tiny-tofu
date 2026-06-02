export function PeekingFooter() {
  return (
    <footer className="relative mt-auto w-full overflow-hidden px-4 pb-4 pt-8">
      <div className="pointer-events-none mx-auto flex max-w-5xl items-end justify-center gap-2 md:gap-4">
        <PeekCharacter color="#FFB8D0" expression="happy" />
        <PeekCharacter color="#A8D8FF" expression="wink" />
        <PeekCharacter color="#FFE9A8" expression="sleep" />
        <PeekTram />
        <PeekCharacter color="#C8B6FF" expression="grumpy" />
        <PeekCharacter color="#B8F0D8" expression="happy" />
        <PeekPalette />
      </div>
      <p className="mt-4 text-center text-xs text-ink-muted">
        a tiny tofu · Melbourne ·{" "}
        <a href="/submit/event" className="underline hover:text-coral">
          Submit an event
        </a>{" "}
        ·{" "}
        <a href="/submit/shop" className="underline hover:text-coral">
          Submit a shop
        </a>
      </p>
    </footer>
  );
}

function PeekCharacter({
  color,
  expression,
}: {
  color: string;
  expression: "happy" | "wink" | "sleep" | "grumpy";
}) {
  return (
    <svg
      viewBox="0 0 80 100"
      className="h-16 w-14 translate-y-6 md:h-24 md:w-20"
      aria-hidden
    >
      <ellipse cx="40" cy="70" rx="32" ry="28" fill={color} stroke="#3d3429" strokeWidth="2" />
      <circle cx="28" cy="58" r="4" fill="#3d3429" />
      {expression === "wink" ? (
        <path d="M52 58 Q58 54 64 58" stroke="#3d3429" strokeWidth="2" fill="none" />
      ) : expression === "sleep" ? (
        <>
          <line x1="50" y1="56" x2="62" y2="60" stroke="#3d3429" strokeWidth="2" />
          <text x="58" y="48" fontSize="12" fill="#3d3429">
            z
          </text>
        </>
      ) : (
        <circle cx="52" cy="58" r="4" fill="#3d3429" />
      )}
      {expression === "grumpy" ? (
        <path d="M30 72 Q40 68 50 72" stroke="#3d3429" strokeWidth="2" fill="none" />
      ) : (
        <path d="M32 72 Q40 78 48 72" stroke="#3d3429" strokeWidth="2" fill="none" />
      )}
      <ellipse cx="40" cy="38" rx="20" ry="18" fill={color} stroke="#3d3429" strokeWidth="2" />
      <circle cx="32" cy="36" r="3" fill="#3d3429" />
      <circle cx="48" cy="36" r="3" fill="#3d3429" />
    </svg>
  );
}

function PeekTram() {
  return (
    <svg
      viewBox="0 0 90 100"
      className="h-18 w-16 translate-y-4 md:h-28 md:w-24"
      aria-hidden
    >
      <rect x="15" y="45" width="60" height="35" rx="8" fill="#A8D8FF" stroke="#3d3429" strokeWidth="2" />
      <rect x="22" y="52" width="18" height="14" rx="2" fill="#fff9f0" stroke="#3d3429" strokeWidth="1.5" />
      <rect x="50" y="52" width="18" height="14" rx="2" fill="#fff9f0" stroke="#3d3429" strokeWidth="1.5" />
      <rect x="35" y="38" width="20" height="12" rx="4" fill="#FF8C5A" stroke="#3d3429" strokeWidth="2" />
      <circle cx="28" cy="82" r="6" fill="#3d3429" />
      <circle cx="62" cy="82" r="6" fill="#3d3429" />
    </svg>
  );
}

function PeekPalette() {
  return (
    <svg
      viewBox="0 0 80 100"
      className="h-16 w-14 translate-y-6 md:h-24 md:w-20"
      aria-hidden
    >
      <ellipse cx="40" cy="65" rx="30" ry="22" fill="#FFE9A8" stroke="#3d3429" strokeWidth="2" />
      <circle cx="28" cy="58" r="5" fill="#FFB8D0" stroke="#3d3429" strokeWidth="1" />
      <circle cx="40" cy="52" r="5" fill="#A8D8FF" stroke="#3d3429" strokeWidth="1" />
      <circle cx="52" cy="58" r="5" fill="#C8B6FF" stroke="#3d3429" strokeWidth="1" />
      <circle cx="40" cy="68" r="5" fill="#FF8C5A" stroke="#3d3429" strokeWidth="1" />
      <rect x="55" y="35" width="6" height="30" rx="3" fill="#B8F0D8" stroke="#3d3429" strokeWidth="2" transform="rotate(25 58 50)" />
    </svg>
  );
}
