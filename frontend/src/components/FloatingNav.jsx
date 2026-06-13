/**
 * FloatingNav — floating capsule fixed at the bottom (mono theme).
 * Active item = white solid pill with black text.
 */
const NAV_ITEMS = [
  { key: 'vpn', label: 'خرید VPN', icon: '🛡️' },
  { key: 'premium', label: 'تلگرام', icon: '✈️' },
  { key: 'orders', label: 'سفارشات', icon: '📋' },
  { key: 'profile', label: 'پروفایل', icon: '👤' },
]

export default function FloatingNav({ active, onNavigate }) {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 16,
        left: 16,
        right: 16,
        maxWidth: 448,
        margin: '0 auto',
        background: 'rgba(20,20,20,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: 50,
        border: '1px solid rgba(255,255,255,0.10)',
        padding: '10px 8px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        boxShadow:
          '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
        zIndex: 100,
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = active === item.key
        if (isActive) {
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              style={{
                background: '#ffffff',
                borderRadius: 50,
                padding: '8px 18px',
                color: '#000000',
                fontWeight: 700,
                fontSize: 13,
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          )
        }
        return (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--muted)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              fontSize: 11,
              padding: '4px 8px',
            }}
          >
            <span style={{ fontSize: 18, opacity: 0.65 }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
