// Corner labels for a poster, pinned to the frame's real corners whatever its shape.
const SPOTS = {
  tl: "top-4 left-4 md:top-5 md:left-6",
  tr: "top-4 right-4 text-right md:top-5 md:right-6",
  bl: "bottom-4 left-4 md:bottom-5 md:left-6",
  br: "bottom-4 right-4 text-right md:bottom-5 md:right-6",
};

export default function PosterHud({ className = "text-bone/60", ...corners }) {
  return Object.entries(SPOTS).map(([spot, position]) =>
    corners[spot] ? (
      <div key={spot} className={`label pointer-events-none absolute ${position} ${className}`}>
        {corners[spot]}
      </div>
    ) : null
  );
}
