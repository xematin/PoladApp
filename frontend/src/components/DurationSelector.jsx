import GlassPill from './GlassPill'

/**
 * DurationSelector — pick a premium duration. Month numbers use mono font.
 */
export default function DurationSelector({ options, selectedId, onSelect }) {
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
      {options.map((opt) => (
        <GlassPill
          key={opt.id}
          active={opt.id === selectedId}
          onClick={() => onSelect(opt.id)}
          style={{ flex: 1 }}
        >
          <span className="num">{opt.duration_months}</span>
          <span>ماه</span>
        </GlassPill>
      ))}
    </div>
  )
}
