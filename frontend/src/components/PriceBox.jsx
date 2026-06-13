function formatToman(value) {
  return Number(value || 0).toLocaleString('fa-IR')
}

/**
 * PriceBox — shows the monthly price and the total price highlighted in blue.
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
          <div style={{ color: 'var(--steel)', fontSize: 16, fontWeight: 700 }}>
            {formatToman(monthly)} تومان
          </div>
        </div>
      )}
      <div style={{ textAlign: 'left' }}>
        <div style={{ color: 'var(--muted)', fontSize: 13 }}>مبلغ کل</div>
        <div
          style={{
            color: 'var(--glow-blue)',
            fontSize: 24,
            fontWeight: 800,
          }}
        >
          {formatToman(totalPrice)} تومان
        </div>
      </div>
    </div>
  )
}
