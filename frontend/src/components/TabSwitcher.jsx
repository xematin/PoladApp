/**
 * TabSwitcher — premium / stars segmented control with a sliding glass thumb.
 */
export default function TabSwitcher({ active, onChange }) {
  return (
    <div className="seg-track">
      <div
        className="seg-thumb"
        style={{
          width: 'calc(50% - 6px)',
          right: active === 'premium' ? 5 : 'calc(50% + 1px)',
        }}
      />
      <button
        className={`seg-btn ${active === 'premium' ? 'active' : ''}`}
        onClick={() => onChange('premium')}
      >
        💎 پرمیوم
      </button>
      <button
        className={`seg-btn ${active === 'stars' ? 'active' : ''}`}
        onClick={() => onChange('stars')}
      >
        ⭐ استارز
      </button>
    </div>
  )
}
