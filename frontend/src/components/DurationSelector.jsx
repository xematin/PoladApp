import GlassPill from './GlassPill'

/**
 * DurationSelector — pick a premium duration. `options` is a list of products
 * with `duration_months`; the selected one is highlighted.
 */
export default function DurationSelector({ options, selectedId, onSelect }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        justifyContent: 'space-between',
      }}
    >
      {options.map((opt) => (
        <GlassPill
          key={opt.id}
          active={opt.id === selectedId}
          onClick={() => onSelect(opt.id)}
          style={{ flex: 1 }}
        >
          {opt.duration_months} ماه
        </GlassPill>
      ))}
    </div>
  )
}
