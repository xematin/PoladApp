function formatToman(value) {
  return Number(value || 0).toLocaleString('fa-IR')
}

/**
 * OrderSummary — duration, amount, divider, and the gateway total in blue.
 */
export default function OrderSummary({ label, amount, total }) {
  return (
    <div>
      <Row k={label?.key || 'مدت'} v={label?.value || '—'} />
      <Row k="مبلغ" v={`${formatToman(amount)} تومان`} />
      <div
        style={{
          height: 1,
          background: 'var(--border-dark)',
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
          style={{
            color: 'var(--glow-blue)',
            fontSize: 18,
            fontWeight: 800,
          }}
        >
          {formatToman(total)} تومان
        </span>
      </div>
    </div>
  )
}

function Row({ k, v }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 8,
      }}
    >
      <span style={{ color: 'var(--muted)', fontSize: 14 }}>{k}</span>
      <span style={{ color: 'var(--steel)', fontSize: 14, fontWeight: 600 }}>
        {v}
      </span>
    </div>
  )
}
