import { useEffect, useState } from 'react'

import SurfaceCard from '../components/SurfaceCard'
import StatusBar from '../components/StatusBar'
import HeaderBar from '../components/HeaderBar'
import api from '../api/client'

const STATUS_CONFIG = {
  PENDING: { label: 'در انتظار', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.10)', color: '#8a8a8a' },
  PAID: { label: 'پرداخت‌شده', bg: 'rgba(255,255,255,0.10)', border: 'rgba(255,255,255,0.18)', color: '#ededed' },
  PROCESSING: { label: 'در حال پردازش', bg: 'rgba(255,255,255,0.07)', border: 'rgba(255,255,255,0.15)', color: '#ededed' },
  DELIVERED: { label: 'تحویل‌شده', bg: 'rgba(74,222,128,0.10)', border: 'rgba(74,222,128,0.30)', color: '#4ade80' },
  FAILED: { label: 'ناموفق', bg: 'rgba(239,68,68,0.10)', border: 'rgba(239,68,68,0.30)', color: '#ef4444' },
  REFUNDED: { label: 'بازگشت‌خورده', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.10)', color: '#8a8a8a' },
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING
  return (
    <span
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        color: cfg.color,
        borderRadius: 50,
        padding: '4px 12px',
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {cfg.label}
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
      .then((data) => active && setOrders(data || []))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [user])

  return (
    <div className="page">
      <StatusBar />
      <HeaderBar />

      <h2 style={{ color: 'var(--steel)', fontSize: 20, margin: '16px 4px' }}>
        📋 سفارشات من
      </h2>

      {loading && (
        <p style={{ color: 'var(--muted)', textAlign: 'center' }}>در حال بارگذاری...</p>
      )}
      {error && (
        <p style={{ color: '#ff6b6b', textAlign: 'center' }}>{error}</p>
      )}
      {!loading && !error && orders.length === 0 && (
        <p style={{ color: 'var(--muted)', textAlign: 'center', marginTop: 40 }}>
          هنوز سفارشی ثبت نکرده‌اید.
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {orders.map((o) => (
          <SurfaceCard key={o.id}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 8,
              }}
            >
              <span style={{ color: 'var(--steel)', fontWeight: 700, fontSize: 15 }}>
                {o.product?.name}
              </span>
              <StatusBadge status={o.status} />
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 4 }}>
              کد رهگیری:{' '}
              <span className="num" style={{ color: 'var(--text)' }}>
                {o.tracking_code}
              </span>
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>
              گیرنده:{' '}
              <span className="num" style={{ color: 'var(--text)' }}>
                @{o.recipient_username}
              </span>
            </div>
            <div className="num" style={{ color: 'var(--muted)', fontSize: 12, marginTop: 6 }}>
              {new Date(o.created_at).toLocaleDateString('en-CA')}
            </div>
          </SurfaceCard>
        ))}
      </div>
    </div>
  )
}
