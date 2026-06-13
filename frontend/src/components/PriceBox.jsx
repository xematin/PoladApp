function formatToman(value) {
  return Number(value || 0).toLocaleString('en-US')
}

/**
 * PriceBox — monthly price + total price. All numbers in JetBrains Mono.
 */
export default function PriceBox({ totalPrice, months }) {
  const monthly = months ? Math.round(totalPrice / months) : null

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        padding: '4px 2px',
      }}
    >
      {monthly != null && (
        <div style={{ color: 'var(--muted)', fontSize: 13 }}>
          ماهانه
          <div
            className="num"
            style={{ color: 'var(--text)', fontSize: 16, fontWeight: 600, marginTop: 2 }}
          >
            {formatToman(monthly)}
            <span style={{ color: 'var(--muted)', fontSize: 11, marginInlineStart: 4 }}>
              تومان
            </span>
          </div>
        </div>
      )}
      <div style={{ textAlign: 'left' }}>
        <div style={{ color: 'var(--muted)', fontSize: 13 }}>مبلغ کل</div>
        <div
          className="num"
          style={{ color: '#fff', fontSize: 26, fontWeight: 600, marginTop: 2 }}
        >
          {formatToman(totalPrice)}
          <span style={{ color: 'var(--muted)', fontSize: 12, marginInlineStart: 5 }}>
            تومان
          </span>
        </div>
      </div>
    </div>
  )
}
