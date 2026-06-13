function fmt(v) {
  return Number(v || 0).toLocaleString('en-US')
}

/**
 * PriceBox — large hero total price with monthly breakdown (mono numbers).
 */
export default function PriceBox({ totalPrice, months }) {
  const monthly = months ? Math.round(totalPrice / months) : null

  return (
    <div style={{ textAlign: 'center', padding: '6px 0 2px' }}>
      <div style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 4 }}>
        مبلغ قابل پرداخت
      </div>
      <div
        className="num"
        style={{
          fontSize: 40,
          fontWeight: 700,
          color: '#fff',
          lineHeight: 1.05,
          textShadow: '0 0 30px rgba(42,127,255,0.35)',
        }}
      >
        {fmt(totalPrice)}
      </div>
      <div style={{ color: 'var(--light-blue)', fontSize: 13, fontWeight: 600, marginTop: 2 }}>
        تومان
      </div>
      {monthly != null && (
        <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 8 }}>
          معادل ماهی <span className="num">{fmt(monthly)}</span> تومان
        </div>
      )}
    </div>
  )
}
