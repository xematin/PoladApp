import Logo from './Logo'

/**
 * BrandHeader — centered glowing logo badge + wordmark + tagline.
 */
export default function BrandHeader({ tagline = 'پل پولادین · خرید آنی تلگرام' }) {
  return (
    <div
      className="fade-up"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        marginTop: 8,
        marginBottom: 18,
      }}
    >
      <div className="logo-badge" style={{ width: 72, height: 72 }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Logo size={44} />
        </div>
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: '0.01em',
          color: '#fff',
        }}
      >
        Polad<span style={{ color: 'var(--light-blue)' }}>App</span>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 11.5,
          color: 'var(--muted)',
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'var(--light-blue)',
            boxShadow: '0 0 10px var(--light-blue)',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
        <span>{tagline}</span>
      </div>
    </div>
  )
}
