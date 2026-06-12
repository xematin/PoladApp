import Logo from './Logo'
import TabSwitcher from './TabSwitcher'
import PriceBox from './PriceBox'
import DurationSelector from './DurationSelector'

/**
 * HeroCard — the signature card at the top of Premium/Stars pages.
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
        borderRadius: 24,
        padding: 18,
        marginTop: 12,
      }}
    >
      {/* Subtle radial glow at the bottom */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: -40,
          height: 120,
          background:
            'radial-gradient(circle at 50% 100%, rgba(42,127,255,0.12), transparent 70%)',
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
          <span style={{ color: 'var(--steel)', fontWeight: 800, fontSize: 18 }}>
            PoladApp
          </span>
        </div>
        <span
          style={{
            background: 'rgba(42,127,255,0.15)',
            color: 'var(--light-blue)',
            fontSize: 12,
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: 50,
            border: '1px solid rgba(42,127,255,0.25)',
          }}
        >
          ⚡ تحویل آنی!
        </span>
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
