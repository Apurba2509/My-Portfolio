// Drawn glyphs: the display font has no arrows or stars, so these stand in at text size.

export function Arrow({ className = "", direction = "right", title }) {
  const rotate = { right: 0, "up-right": -45, up: -90, down: 90, "down-right": 45 }[direction];
  return (
    <svg
      viewBox="0 0 100 100"
      className={`inline-block h-[0.72em] w-[0.72em] shrink-0 ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <path d="M4 40 H56 V12 L96 50 L56 88 V60 H4 Z" fill="currentColor" />
    </svg>
  );
}

export function Star({ className = "" }) {
  return (
    <svg viewBox="0 0 100 100" className={`inline-block h-[0.6em] w-[0.6em] shrink-0 ${className}`} aria-hidden="true">
      {[0, 45, 90, 135].map((r) => (
        <rect key={r} x="42" y="0" width="16" height="100" fill="currentColor" transform={`rotate(${r} 50 50)`} />
      ))}
    </svg>
  );
}
