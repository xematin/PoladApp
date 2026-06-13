import { useState } from 'react'

// Public asset; respects Vite's relative base ('./') for Telegram Mini App.
const LOGO_SRC = `${import.meta.env.BASE_URL}Polad.png`

/**
 * Logo — renders the brand image (public/Polad.png). If the image is missing
 * or fails to load, it gracefully falls back to the built-in SVG logo.
 */
export default function Logo({ size = 34 }) {
  const [imgError, setImgError] = useState(false)

  if (!imgError) {
    return (
      <img
        src={LOGO_SRC}
        alt="PoladApp"
        width={size}
        height={size}
        onError={() => setImgError(true)}
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          display: 'block',
          filter: 'drop-shadow(0 0 8px rgba(42,127,255,0.35))',
        }}
      />
    )
  }

  // Fallback SVG (steel "P" bridge with blue glow)
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="22" fill="#06090f" />
      <path
        d="M26 14 L26 86 L38 86 L38 60 Q38 75 54 75 Q72 75 72 54 Q72 33 54 33 L38 33 L38 14 Z"
        fill="none"
        stroke="#C8CDD6"
        strokeWidth="7.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M38 33 L54 33 Q64 33 64 54 Q64 67 54 67 L38 67"
        fill="none"
        stroke="#C8CDD6"
        strokeWidth="7.5"
        strokeLinejoin="round"
      />
      <line x1="47" y1="45" x2="47" y2="84" stroke="#2A7FFF" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="40" y1="80" x2="54" y2="80" stroke="#2A7FFF" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="47" cy="85" rx="10" ry="4" fill="#2A7FFF" opacity="0.25" />
    </svg>
  )
}
