/**
 * FloatingNav — iOS 26 liquid-glass floating capsule fixed at the bottom.
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
        background: 'rgba(15,24,36,0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: 50,
        borderTop: '1px solid rgba(255,255,255,0.12)',
        borderLeft: '1px solid rgba(255,255,255,0.10)',
        borderBottom: '1px solid rgba(0,0,0,0.35)',
        borderRight: '1px solid rgba(0,0,0,0.30)',
        padding: '10px 8px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        boxShadow:
          '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
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
                background: '#2A7FFF',
                borderRadius: 50,
                padding: '8px 18px',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                borderTop: '1px solid rgba(160,210,255,0.55)',
                borderLeft: '1px solid rgba(160,210,255,0.45)',
                borderBottom: '1px solid rgba(10,40,120,0.50)',
                borderRight: '1px solid rgba(10,40,120,0.45)',
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
              color: '#6B7A8D',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              fontSize: 11,
              padding: '4px 8px',
            }}
          >
            <span style={{ fontSize: 18, opacity: 0.7 }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
