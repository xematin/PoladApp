export default function Logo({ size = 34 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100" height="100" rx="22" fill="#0a0a0a" />
      <path
        d="M26 14 L26 86 L38 86 L38 60 Q38 75 54 75 Q72 75 72 54 Q72 33 54 33 L38 33 L38 14 Z"
        fill="none"
        stroke="#ededed"
        strokeWidth="7.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M38 33 L54 33 Q64 33 64 54 Q64 67 54 67 L38 67"
        fill="none"
        stroke="#ededed"
        strokeWidth="7.5"
        strokeLinejoin="round"
      />
      {/* The "bridge soul" — kept monochrome (steel) */}
      <line
        x1="47"
        y1="45"
        x2="47"
        y2="84"
        stroke="#8a8a8a"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <line
        x1="40"
        y1="80"
        x2="54"
        y2="80"
        stroke="#8a8a8a"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <ellipse cx="47" cy="85" rx="10" ry="4" fill="#ffffff" opacity="0.12" />
    </svg>
  )
}
