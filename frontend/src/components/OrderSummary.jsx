function formatToman(value) {
  return Number(value || 0).toLocaleString('en-US')
}

/**
 * OrderSummary — duration, amount, divider, and the gateway total.
 * Numbers use JetBrains Mono (English digits).
 */
export default function OrderSummary({ label, amount, total }) {
  return (
    <div>
      <Row k={label?.key || 'مدت'} v={label?.value || '—'} mono={label?.mono} />
      <Row k="مبلغ" v={`${formatToman(amount)} تومان`} mono />
      <div
        style={{
          height: 1,
          background: 'var(--border)',
          margin: '12px 0',
        }}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ color: 'var(--muted)', fontSize: 14 }}>
          مبلغ قابل پرداخت
        </span>
        <span
          className="num"
          style={{ color: '#fff', fontSize: 18, fontWeight: 600 }}
        >
          {formatToman(total)}
          <span style={{ color: 'var(--muted)', fontSize: 12, marginInlineStart: 4 }}>
            تومان
          </span>
        </span>
      </div>
    </div>
  )
}

function Row({ k, v, mono }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 8,
      }}
    >
      <span style={{ color: 'var(--muted)', fontSize: 14 }}>{k}</span>
      <span
        className={mono ? 'num' : undefined}
        style={{ color: 'var(--text)', fontSize: 14, fontWeight: 600 }}
      >
        {v}
      </span>
    </div>
  )
}
