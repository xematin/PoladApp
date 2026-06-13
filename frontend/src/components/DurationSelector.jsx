function fmt(v) {
  return Number(v || 0).toLocaleString('en-US')
}

/**
 * DurationSelector — premium stacked plan cards.
 * Each card: radio, duration + per-month price, total price, "best value" tag.
 */
export default function DurationSelector({ options, selectedId, onSelect }) {
  if (!options || options.length === 0) return null

  // cheapest per-month → mark as best value
  const perMonth = (p) =>
    p.duration_months ? Number(p.price_toman) / p.duration_months : Infinity
  const bestId = options.reduce(
    (best, p) => (perMonth(p) < perMonth(best) ? p : best),
    options[0]
  ).id

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {options.map((opt) => {
        const active = opt.id === selectedId
        const pm = opt.duration_months
          ? Math.round(Number(opt.price_toman) / opt.duration_months)
          : null
        return (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              width: '100%',
              textAlign: 'right',
              padding: '15px 16px',
              borderRadius: 16,
              cursor: 'pointer',
              background: active
                ? 'linear-gradient(135deg, rgba(42,127,255,0.16), rgba(42,127,255,0.05))'
                : 'rgba(0,0,0,0.35)',
              border: active
                ? '1px solid rgba(120,170,255,0.55)'
                : '1px solid var(--border)',
              boxShadow: active ? '0 10px 30px -12px var(--blue-glow)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            {/* radio */}
            <span
              style={{
                flexShrink: 0,
                width: 22,
                height: 22,
                borderRadius: '50%',
                border: active
                  ? '6px solid var(--glow-blue)'
                  : '2px solid var(--inactive-el)',
                background: active ? '#fff' : 'transparent',
                transition: 'all 0.2s ease',
              }}
            />
            {/* info */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 15,
                }}
              >
                <span>
                  <span className="num">{opt.duration_months}</span> ماهه
                </span>
                {opt.id === bestId && (
                  <span
                    className="badge"
                    style={{ fontSize: 10, padding: '2px 8px' }}
                  >
                    بهترین قیمت
                  </span>
                )}
              </div>
              {pm != null && (
                <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 3 }}>
                  ماهی <span className="num">{fmt(pm)}</span> تومان
                </div>
              )}
            </div>
            {/* total */}
            <div style={{ textAlign: 'left' }}>
              <div
                className="num"
                style={{
                  color: active ? 'var(--light-blue)' : 'var(--text)',
                  fontWeight: 700,
                  fontSize: 16,
                }}
              >
                {fmt(opt.price_toman)}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: 10 }}>تومان</div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
