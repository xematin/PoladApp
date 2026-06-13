import GlassButton from './GlassButton'

/**
 * TabSwitcher — premium / stars toggle (mono segmented control).
 */
export default function TabSwitcher({ active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <GlassButton
        variant={active === 'premium' ? 'active' : 'inactive'}
        onClick={() => onChange('premium')}
        style={{ flex: 1 }}
      >
        💎 پرمیوم
      </GlassButton>
      <GlassButton
        variant={active === 'stars' ? 'active' : 'inactive'}
        onClick={() => onChange('stars')}
        style={{ flex: 1 }}
      >
        ⭐ استارز
      </GlassButton>
    </div>
  )
}
