import { useMemo, useState } from 'react'

import StatusBar from '../components/StatusBar'
import HeaderBar from '../components/HeaderBar'
import BrandHeader from '../components/BrandHeader'
import TabSwitcher from '../components/TabSwitcher'
import PriceBox from '../components/PriceBox'
import GlassButton from '../components/GlassButton'
import {
  IconStar,
  IconSearch,
  IconBolt,
  IconLock,
  IconCheck,
  IconArrow,
} from '../components/Icons'
import api from '../api/client'

function fmt(v) {
  return Number(v || 0).toLocaleString('en-US')
}

export default function StarsPage({ products, user, onNavigate }) {
  // No auto-selection — reveal each step after the previous is completed.
  const [selectedId, setSelectedId] = useState(null)
  const [username, setUsername] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState(null)

  const selected = useMemo(
    () => products.find((p) => p.id === selectedId) || null,
    [products, selectedId]
  )
  const total = selected ? Number(selected.price_toman) : 0

  const recipient = username.trim().replace(/^@/, '')
  const packageChosen = !!selected
  const recipientReady = packageChosen && recipient.length >= 3

  const handlePay = async () => {
    if (!selected || !user) {
      setMessage({ type: 'error', text: 'اطلاعات سفارش ناقص است.' })
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

      {/* Step 1 — package selection */}
      <div className="fade-up" style={{ marginTop: 22, animationDelay: '0.1s' }}>
        <div className="section-title">
          <StepDot n={1} done={packageChosen} /> انتخاب بسته‌ی استارز
        </div>
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
                <span
                  style={{
                    color: active ? 'var(--light-blue)' : 'var(--muted)',
                    filter: active ? 'drop-shadow(0 0 8px rgba(91,164,255,0.7))' : 'none',
                  }}
                >
                  <IconStar size={26} filled={active} />
                </span>
                <span className="num" style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>
                  {fmt(p.stars_amount)}
                </span>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>استارز</span>
                <span
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
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Step 2 — recipient */}
      {packageChosen && (
        <div className="fade-up" style={{ marginTop: 22 }} key="recipient">
          <div className="section-title">
            <StepDot n={2} done={recipientReady} /> گیرنده‌ی استارز
          </div>
          <div className="glass-soft" style={{ padding: '4px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--light-blue)', fontSize: 17 }}>@</span>
            <input
              autoFocus
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
            <span style={{ color: 'var(--muted)', display: 'flex' }}>
              <IconSearch size={17} />
            </span>
          </div>
          <div style={{ color: 'var(--muted)', fontSize: 11.5, marginTop: 8, paddingInline: 4 }}>
            یوزرنیم گیرنده را بدون @ وارد کنید (حداقل ۳ کاراکتر)
          </div>
        </div>
      )}

      {/* Step 3 — payment */}
      {recipientReady && (
        <div className="glass-card fade-up" style={{ marginTop: 22, padding: 22 }} key="checkout">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <PriceBox totalPrice={total} />

            <div className="glass-soft" style={{ padding: '10px 14px', margin: '14px 0' }}>
              <Row k="بسته" v={`${fmt(selected.stars_amount)} استارز`} mono />
              <Row k="گیرنده" v={`@${recipient}`} mono last />
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
              <span className="chip"><IconBolt size={13} /> ارسال فوری</span>
              <span className="chip"><IconLock size={13} /> پرداخت امن</span>
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
              {submitting ? 'در حال پردازش…' : 'پرداخت و ارسال استارز'}
              {!submitting && <IconArrow size={17} />}
            </GlassButton>
          </div>
        </div>
      )}
    </div>
  )
}

function StepDot({ n, done }) {
  return (
    <span
      className="num"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 20,
        height: 20,
        borderRadius: '50%',
        fontSize: 11,
        fontWeight: 700,
        color: done ? '#fff' : 'var(--muted)',
        background: done ? 'linear-gradient(135deg, #2a7fff, #1657c7)' : 'rgba(255,255,255,0.05)',
        border: done ? '1px solid rgba(120,170,255,0.5)' : '1px solid var(--border)',
        boxShadow: done ? '0 4px 12px -4px var(--blue-glow)' : 'none',
      }}
    >
      {done ? <IconCheck size={12} stroke={3} /> : n}
    </span>
  )
}

function Row({ k, v, mono, last }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: last ? 0 : 8 }}>
      <span style={{ color: 'var(--muted)', fontSize: 13 }}>{k}</span>
      <span className={mono ? 'num' : undefined} style={{ color: 'var(--text)', fontSize: 13, fontWeight: 600 }}>
        {v}
      </span>
    </div>
  )
}
