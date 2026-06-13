// An original, generic official seal used as the portal's emblem.
// Concentric rings + monogram + radial ticks — reads as a government seal
// without reproducing any real police insignia.
export default function Seal({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      {/* outer gold ring */}
      <circle cx="50" cy="50" r="47" stroke="var(--gold)" strokeWidth="2" />
      <circle cx="50" cy="50" r="42" stroke="var(--gold)" strokeWidth="0.75" opacity="0.7" />
      {/* radial ticks around the seal */}
      {Array.from({ length: 36 }).map((_, i) => {
        const a = (i * 10 * Math.PI) / 180
        const r1 = 42, r2 = 45
        return (
          <line
            key={i}
            x1={50 + r1 * Math.cos(a)}
            y1={50 + r1 * Math.sin(a)}
            x2={50 + r2 * Math.cos(a)}
            y2={50 + r2 * Math.sin(a)}
            stroke="var(--gold)"
            strokeWidth="0.75"
            opacity="0.55"
          />
        )
      })}
      {/* inner field */}
      <circle cx="50" cy="50" r="34" fill="var(--navy-700)" />
      <circle cx="50" cy="50" r="34" stroke="var(--gold)" strokeWidth="1" opacity="0.5" />
      {/* monogram */}
      <text
        x="50" y="50"
        textAnchor="middle" dominantBaseline="central"
        fontFamily="'Plus Jakarta Sans', sans-serif"
        fontWeight="800" fontSize="26" fill="var(--gold)"
        letterSpacing="1"
      >
        SLP
      </text>
      {/* small star at top */}
      <path d="M50 9 l1.6 3.2 3.5 .5 -2.5 2.5 .6 3.5 -3.2 -1.7 -3.2 1.7 .6 -3.5 -2.5 -2.5 3.5 -.5 z"
        fill="var(--gold)" />
    </svg>
  )
}
