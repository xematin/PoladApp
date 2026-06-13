/**
 * FloatingNav — liquid-glass floating capsule with a glowing blue active pill.
 */
const NAV_ITEMS = [
  { key: 'vpn', label: 'VPN', icon: '🛡️' },
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
        background: 'rgba(10,16,26,0.72)',
        backdropFilter: 'blur(22px)',
        WebkitBackdropFilter: 'blur(22px)',
        borderRadius: 50,
        border: '1px solid rgba(255,255,255,0.10)',
        padding: '9px 8px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        boxShadow:
          '0 12px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)',
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
                background: 'linear-gradient(135deg, #2a7fff, #1657c7)',
                borderRadius: 50,
                padding: '9px 18px',
                color: '#fff',
                fontWeight: 700,
                fontSize: 13,
                border: '1px solid rgba(120,170,255,0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 8px 20px -6px var(--blue-glow)',
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
              gap: 3,
              fontSize: 10.5,
              padding: '4px 10px',
            }}
          >
            <span style={{ fontSize: 18, opacity: 0.75 }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
