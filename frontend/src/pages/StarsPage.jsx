import { useState } from 'react'

import SurfaceCard from '../components/SurfaceCard'
import GlassButton from '../components/GlassButton'
import TabSwitcher from '../components/TabSwitcher'
import StatusBar from '../components/StatusBar'
import HeaderBar from '../components/HeaderBar'
import Logo from '../components/Logo'
import api from '../api/client'

function formatToman(value) {
  return Number(value || 0).toLocaleString('en-US')
}

export default function StarsPage({ products, user, onNavigate }) {
  const [selectedId, setSelectedId] = useState(null)
  const [username, setUsername] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState(null)

  const selected = products.find((p) => p.id === selectedId) || null

  const handlePay = async () => {
    const recipient = username.trim().replace(/^@/, '')
    if (!recipient) {
      setMessage({ type: 'error', text: 'لطفاً یوزرنیم گیرنده را وارد کنید.' })
      return
    }
    if (!selected || !user) {
      setMessage({ type: 'error', text: 'لطفاً یک بسته انتخاب کنید.' })
      return
    }
    setSubmitting(true)
    setMessage(null)
    try {
      const order = await api.createOrder({
        telegram_id: user.telegram_id || user.id,
        product_id: selected.id,
        recipient_username: recipient,
        payment_method: 'NOWPAYMENTS',
      })
      const invoice = await api.createNowPaymentsInvoice(order.id)
      if (invoice?.invoice_url) {
        window.open(invoice.invoice_url, '_blank')
      }
      setMessage({
        type: 'success',
        text: `سفارش ثبت شد. کد رهگیری: ${order.tracking_code}`,
      })
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'خطا در ثبت سفارش' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page">
      <StatusBar />
      <HeaderBar />

      {/* Hero with tabs */}
      <div
        style={{
          background: 'var(--bg-hero)',
          border: '1px solid var(--border-hero)',
          borderRadius: 20,
          padding: 18,
          marginTop: 12,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 16,
          }}
        >
          <Logo size={34} />
          <span style={{ color: 'var(--text)', fontWeight: 800, fontSize: 18 }}>
            PoladApp
          </span>
        </div>
        <TabSwitcher
          active="stars"
          onChange={(t) => t === 'premium' && onNavigate('premium')}
        />
      </div>

      {/* Stars packages */}
      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {products.map((p) => {
          const isActive = p.id === selectedId
          return (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={isActive ? 'seg seg-active' : 'seg'}
              style={{
                borderRadius: 14,
                padding: '16px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 700 }}>
                ⭐ <span className="num">{p.stars_amount}</span> استارز
              </span>
              <span className="num" style={{ fontWeight: 700 }}>
                {formatToman(p.price_toman)}
                <span style={{ fontSize: 11, marginInlineStart: 4, opacity: 0.7 }}>
                  تومان
                </span>
              </span>
            </button>
          )
        })}
      </div>

      {/* Username input */}
      <SurfaceCard style={{ marginTop: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: 'var(--muted)', fontSize: 18 }}>🔍</span>
          <input
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="telegram_username"
            style={{ direction: 'ltr', textAlign: 'left' }}
          />
        </div>
      </SurfaceCard>

      {message && (
        <div
          style={{
            marginTop: 12,
            color: message.type === 'error' ? '#ef4444' : 'var(--text)',
            fontSize: 13,
            textAlign: 'center',
          }}
        >
          {message.text}
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <GlassButton variant="cta" onClick={handlePay} disabled={submitting}>
          {submitting ? 'در حال پردازش...' : 'پرداخت و ارسال استارز ←'}
        </GlassButton>
      </div>
    </div>
  )
}
