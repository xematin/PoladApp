import { useEffect, useState } from 'react'

import StatusBar from '../components/StatusBar'
import HeaderBar from '../components/HeaderBar'
import api from '../api/client'

const STATUS = {
  PENDING: { label: 'در انتظار', color: '#aab4c2', bg: 'rgba(255,255,255,0.05)', bd: 'var(--border)' },
  PAID: { label: 'پرداخت‌شده', color: '#5ba4ff', bg: 'rgba(42,127,255,0.14)', bd: 'rgba(42,127,255,0.3)' },
  PROCESSING: { label: 'در حال پردازش', color: '#5ba4ff', bg: 'rgba(42,127,255,0.10)', bd: 'rgba(42,127,255,0.25)' },
  DELIVERED: { label: 'تحویل‌شده', color: '#4ade80', bg: 'rgba(74,222,128,0.12)', bd: 'rgba(74,222,128,0.3)' },
  FAILED: { label: 'ناموفق', color: '#f87171', bg: 'rgba(248,113,113,0.12)', bd: 'rgba(248,113,113,0.3)' },
  REFUNDED: { label: 'بازگشت‌خورده', color: '#aab4c2', bg: 'rgba(255,255,255,0.05)', bd: 'var(--border)' },
}

function Badge({ status }) {
  const s = STATUS[status] || STATUS.PENDING
  return (
    <span
      style={{
        background: s.bg,
        border: `1px solid ${s.bd}`,
        color: s.color,
        borderRadius: 50,
        padding: '5px 13px',
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {s.label}
    </span>
  )
}

export default function OrdersPage({ user }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const tgId = user?.telegram_id || user?.id
    if (!tgId) {
      setLoading(false)
      return
    }
    let active = true
    api
      .getUserOrders(tgId)
      .then((d) => active && setOrders(d || []))
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [user])

  return (
    <div className="page">
      <StatusBar />
      <HeaderBar />

      <div className="fade-up" style={{ margin: '12px 2px 18px' }}>
        <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: 0 }}>سفارش‌های من</h2>
        <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>
          تاریخچه‌ی خریدها و وضعیت تحویل
        </div>
      </div>

      {loading && <p style={{ color: 'var(--muted)', textAlign: 'center', marginTop: 30 }}>در حال بارگذاری…</p>}
      {error && <p style={{ color: 'var(--danger)', textAlign: 'center' }}>{error}</p>}
      {!loading && !error && orders.length === 0 && (
        <div className="glass-card" style={{ padding: 0 }}>
          <div className="empty-state" style={{ position: 'relative', zIndex: 1 }}>
            <div className="empty-state-icon">🧾</div>
            <div className="empty-state-title">هنوز سفارشی ثبت نکرده‌اید</div>
            <div className="empty-state-msg">از تب تلگرام اولین خریدت رو انجام بده.</div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {orders.map((o, i) => (
          <div
            key={o.id}
            className="glass-card fade-up"
            style={{ padding: 16, animationDelay: `${i * 0.05}s` }}
          >
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{o.product?.name}</div>
                  <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 3 }}>
                    گیرنده:{' '}
                    <span className="num" style={{ color: 'var(--text-dim)' }}>@{o.recipient_username}</span>
                  </div>
                </div>
                <Badge status={o.status} />
              </div>
              <div
                className="glass-soft"
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px' }}
              >
                <span style={{ color: 'var(--muted)', fontSize: 11 }}>کد رهگیری</span>
                <span className="num" style={{ color: 'var(--light-blue)', fontSize: 13, fontWeight: 600 }}>
                  {o.tracking_code}
                </span>
              </div>
              <div className="num" style={{ color: 'var(--muted)', fontSize: 11, marginTop: 10, textAlign: 'left' }}>
                {new Date(o.created_at).toLocaleDateString('en-CA')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
