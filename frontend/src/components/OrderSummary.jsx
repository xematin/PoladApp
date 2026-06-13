function fmt(v) {
  return Number(v || 0).toLocaleString('en-US')
}

/**
 * OrderSummary — duration, amount, divider, payable total (mono numbers).
 */
export default function OrderSummary({ label, amount, total }) {
  return (
    <div>
      <Row k={label?.key || 'مدت'} v={label?.value || '—'} mono={label?.mono} />
      <Row k="مبلغ" v={`${fmt(amount)} تومان`} mono />
      <div
        style={{
          height: 1,
          background: 'linear-gradient(90deg, transparent, var(--border-strong), transparent)',
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
        <span style={{ color: 'var(--text-dim)', fontSize: 14, fontWeight: 600 }}>
          مبلغ قابل پرداخت
        </span>
        <span className="num" style={{ color: 'var(--light-blue)', fontSize: 19, fontWeight: 700 }}>
          {fmt(total)}
          <span style={{ color: 'var(--muted)', fontSize: 11, marginInlineStart: 4 }}>تومان</span>
        </span>
      </div>
    </div>
  )
}

function Row({ k, v, mono }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 9 }}>
      <span style={{ color: 'var(--muted)', fontSize: 13.5 }}>{k}</span>
      <span
        className={mono ? 'num' : undefined}
        style={{ color: 'var(--text)', fontSize: 13.5, fontWeight: 600 }}
      >
        {v}
      </span>
    </div>
  )
}
