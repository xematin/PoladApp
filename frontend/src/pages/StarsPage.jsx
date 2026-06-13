import { useEffect, useMemo, useState } from 'react'

import StatusBar from '../components/StatusBar'
import HeaderBar from '../components/HeaderBar'
import BrandHeader from '../components/BrandHeader'
import TabSwitcher from '../components/TabSwitcher'
import PriceBox from '../components/PriceBox'
import GlassButton from '../components/GlassButton'
import api from '../api/client'

function fmt(v) {
  return Number(v || 0).toLocaleString('en-US')
}

export default function StarsPage({ products, user, onNavigate }) {
  const [selectedId, setSelectedId] = useState(null)
  const [username, setUsername] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    if (products.length && selectedId == null) setSelectedId(products[1]?.id ?? products[0].id)
  }, [products, selectedId])

  const selected = useMemo(
    () => products.find((p) => p.id === selectedId) || null,
    [products, selectedId]
  )
  const total = selected ? Number(selected.price_toman) : 0

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
      if (invoice?.invoice_url) window.open(invoice.invoice_url, '_blank')
      setMessage({ type: 'success', text: `سفارش ثبت شد. کد رهگیری: ${order.tracking_code}` })
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
      <BrandHeader tagline="استارز تلگرام · ارسال فوری" />

      <div className="fade-up" style={{ animationDelay: '0.05s' }}>
        <TabSwitcher active="stars" onChange={(t) => t === 'premium' && onNavigate('premium')} />
      </div>

      {/* Star packages grid */}
      <div className="fade-up" style={{ marginTop: 22, animationDelay: '0.1s' }}>
        <div className="section-title">انتخاب بسته‌ی استارز</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {products.map((p) => {
            const active = p.id === selectedId
            return (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  padding: '20px 12px 16px',
                  borderRadius: 18,
                  cursor: 'pointer',
                  background: active
                    ? 'linear-gradient(160deg, rgba(42,127,255,0.18), rgba(42,127,255,0.04))'
                    : 'rgba(0,0,0,0.35)',
                  border: active
                    ? '1px solid rgba(120,170,255,0.55)'
                    : '1px solid var(--border)',
                  boxShadow: active ? '0 12px 30px -12px var(--blue-glow)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  style={{
                    fontSize: 26,
                    filter: active
                      ? 'drop-shadow(0 0 10px rgba(91,164,255,0.7))'
                      : 'grayscale(0.2) opacity(0.85)',
                  }}
                >
                  ⭐
                </div>
                <div className="num" style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>
                  {fmt(p.stars_amount)}
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>استارز</div>
                <div
                  style={{
                    marginTop: 6,
                    paddingTop: 8,
                    width: '100%',
                    borderTop: '1px solid var(--border)',
                    textAlign: 'center',
                  }}
                >
                  <span
                    className="num"
                    style={{ color: active ? 'var(--light-blue)' : 'var(--text-dim)', fontWeight: 700, fontSize: 14 }}
                  >
                    {fmt(p.price_toman)}
                  </span>
                  <span style={{ color: 'var(--muted)', fontSize: 10, marginInlineStart: 3 }}>تومان</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Recipient */}
      <div className="fade-up" style={{ marginTop: 22, animationDelay: '0.15s' }}>
        <div className="section-title">گیرنده‌ی استارز</div>
        <div className="glass-soft" style={{ padding: '4px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'var(--light-blue)', fontSize: 17 }}>@</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="telegram_username"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text)',
              fontSize: 15,
              padding: '13px 0',
              direction: 'ltr',
              textAlign: 'left',
            }}
          />
          <span style={{ color: 'var(--muted)', fontSize: 16 }}>🔍</span>
        </div>
      </div>

      {/* Checkout */}
      <div className="glass-card fade-up" style={{ marginTop: 22, padding: 22, animationDelay: '0.2s' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <PriceBox totalPrice={total} />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', margin: '16px 0' }}>
            <span className="chip">⚡ ارسال فوری</span>
            <span className="chip">🔒 پرداخت امن</span>
          </div>
          {message && (
            <div
              style={{
                marginBottom: 12,
                color: message.type === 'error' ? 'var(--danger)' : 'var(--ok)',
                fontSize: 13,
                textAlign: 'center',
              }}
            >
              {message.text}
            </div>
          )}
          <GlassButton variant="cta" onClick={handlePay} disabled={submitting}>
            {submitting ? 'در حال پردازش…' : 'پرداخت و ارسال استارز ←'}
          </GlassButton>
        </div>
      </div>
    </div>
  )
}
