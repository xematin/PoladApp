import { IconShield, IconSend, IconOrders, IconUser } from './Icons'

/**
 * FloatingNav — two separate liquid-glass capsules:
 *   • main capsule: تلگرام / سفارشات / پروفایل
 *   • standalone capsule: خرید VPN
 * Active item gets a soft blue-tinted highlight pill (icon + label stacked).
 */
const MAIN_ITEMS = [
  { key: 'premium', label: 'تلگرام', Icon: IconSend },
  { key: 'orders', label: 'سفارشات', Icon: IconOrders },
  { key: 'profile', label: 'پروفایل', Icon: IconUser },
]
const VPN_ITEM = { key: 'vpn', label: 'خرید VPN', Icon: IconShield }

const capsuleStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  background: 'rgba(10,16,26,0.72)',
  backdropFilter: 'blur(22px)',
  WebkitBackdropFilter: 'blur(22px)',
  borderRadius: 50,
  border: '1px solid rgba(255,255,255,0.10)',
  padding: 7,
  boxShadow: '0 12px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)',
}

function NavItem({ item, active, onNavigate }) {
  const { key, label, Icon } = item
  return (
    <button
      onClick={() => onNavigate(key)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        padding: active ? '8px 16px' : '8px 12px',
        borderRadius: 50,
        cursor: 'pointer',
        fontSize: 10.5,
        fontWeight: active ? 700 : 500,
        color: active ? 'var(--light-blue)' : 'var(--muted)',
        background: active ? 'rgba(42,127,255,0.16)' : 'transparent',
        border: active ? '1px solid rgba(120,170,255,0.40)' : '1px solid transparent',
        boxShadow: active ? '0 6px 18px -8px var(--blue-glow), 0 1px 0 rgba(255,255,255,0.08) inset' : 'none',
        transition: 'all 0.2s ease',
      }}
    >
      <Icon size={19} style={{ opacity: active ? 1 : 0.85 }} />
      <span>{label}</span>
    </button>
  )
}

export default function FloatingNav({ active, onNavigate }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        left: 16,
        right: 16,
        maxWidth: 460,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        zIndex: 100,
      }}
    >
      {/* Main capsule */}
      <div style={capsuleStyle}>
        {MAIN_ITEMS.map((item) => (
          <NavItem key={item.key} item={item} active={active === item.key} onNavigate={onNavigate} />
        ))}
      </div>

      {/* Standalone VPN capsule */}
      <div style={capsuleStyle}>
        <NavItem item={VPN_ITEM} active={active === 'vpn'} onNavigate={onNavigate} />
      </div>
    </div>
  )
}
