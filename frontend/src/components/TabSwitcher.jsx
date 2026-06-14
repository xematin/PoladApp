import { IconGem, IconStar } from './Icons'

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
        <IconGem size={16} /> پرمیوم
      </button>
      <button
        className={`seg-btn ${active === 'stars' ? 'active' : ''}`}
        onClick={() => onChange('stars')}
      >
        <IconStar size={16} filled={active === 'stars'} /> استارز
      </button>
    </div>
  )
}
