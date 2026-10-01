// Monospace labels drawn inside the SVG posters.
export default function Hud({ x, y, children, anchor = "start", size = 11, opacity = 0.6, fill = "var(--color-bone)", ...rest }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fill={fill}
      fillOpacity={opacity}
      fontFamily="JetBrains Mono Variable, ui-monospace, monospace"
      fontSize={size}
      letterSpacing="0.06em"
      {...rest}
    >
      {children}
    </text>
  );
}
