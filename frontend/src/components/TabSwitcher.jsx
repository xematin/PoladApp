import GlassButton from './GlassButton'

/**
 * TabSwitcher — premium / stars toggle (border-radius 14px).
 */
export default function TabSwitcher({ active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <GlassButton
        variant={active === 'premium' ? 'active' : 'inactive'}
        radius={14}
        onClick={() => onChange('premium')}
        style={{ flex: 1 }}
      >
        💎 پرمیوم
      </GlassButton>
      <GlassButton
        variant={active === 'stars' ? 'active' : 'inactive'}
        radius={14}
        onClick={() => onChange('stars')}
        style={{ flex: 1 }}
      >
        ⭐ استارز
      </GlassButton>
    </div>
  )
}
