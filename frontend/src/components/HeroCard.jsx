import Logo from './Logo'
import TabSwitcher from './TabSwitcher'
import PriceBox from './PriceBox'
import DurationSelector from './DurationSelector'

/**
 * HeroCard — signature card at the top of Premium/Stars pages (mono theme).
 */
export default function HeroCard({
  activeTab,
  onTabChange,
  totalPrice,
  months,
  durationOptions,
  selectedId,
  onSelectDuration,
  children,
}) {
  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--bg-hero)',
        border: '1px solid var(--border-hero)',
        borderRadius: 20,
        padding: 18,
        marginTop: 12,
      }}
    >
      {/* Subtle white glow at the bottom */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: -40,
          height: 120,
          background:
            'radial-gradient(circle at 50% 100%, rgba(255,255,255,0.05), transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header: logo + brand + delivery badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Logo size={34} />
          <span style={{ color: 'var(--text)', fontWeight: 800, fontSize: 18 }}>
            PoladApp
          </span>
        </div>
        <span className="badge">⚡ تحویل آنی!</span>
      </div>

      <TabSwitcher active={activeTab} onChange={onTabChange} />

      <div style={{ marginTop: 16 }}>
        <PriceBox totalPrice={totalPrice} months={months} />
      </div>

      {durationOptions && durationOptions.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <DurationSelector
            options={durationOptions}
            selectedId={selectedId}
            onSelect={onSelectDuration}
          />
        </div>
      )}

      {children}
    </div>
  )
}
