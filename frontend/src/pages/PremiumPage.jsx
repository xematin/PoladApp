import { useMemo, useState } from 'react'

import StatusBar from '../components/StatusBar'
import HeaderBar from '../components/HeaderBar'
import BrandHeader from '../components/BrandHeader'
import TabSwitcher from '../components/TabSwitcher'
import DurationSelector from '../components/DurationSelector'
import PriceBox from '../components/PriceBox'
import GlassButton from '../components/GlassButton'
import api from '../api/client'

export default function PremiumPage({ products, user, onNavigate }) {
  // No auto-selection: each step is revealed only after the previous is done.
  const [selectedId, setSelectedId] = useState(null)
  const [username, setUsername] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState(null)

  const selected = useMemo(
    () => products.find((p) => p.id === selectedId) || null,
    [products, selectedId]
  )
  const total = selected ? Number(selected.price_toman) : 0

  // Step gates
  const recipient = username.trim().replace(/^@/, '')
  const planChosen = !!selected
  const recipientReady = planChosen && recipient.length >= 3

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
      <BrandHeader />

      <div className="fade-up" style={{ animationDelay: '0.05s' }}>
        <TabSwitcher active="premium" onChange={(t) => t === 'stars' && onNavigate('stars')} />
      </div>

      {/* Step 1 — plan selection (always visible) */}
      <div className="fade-up" style={{ marginTop: 22, animationDelay: '0.1s' }}>
        <div className="section-title">
          <StepDot n={1} done={planChosen} /> انتخاب پلن اشتراک
        </div>
        <DurationSelector options={products} selectedId={selectedId} onSelect={setSelectedId} />
      </div>

      {/* Step 2 — recipient (revealed after a plan is chosen) */}
      {planChosen && (
        <div className="fade-up" style={{ marginTop: 22 }} key="recipient">
          <div className="section-title">
            <StepDot n={2} done={recipientReady} /> گیرنده‌ی پرمیوم
          </div>
          <div
            className="glass-soft"
            style={{ padding: '4px 14px', display: 'flex', alignItems: 'center', gap: 8 }}
          >
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
            <span style={{ color: 'var(--muted)', fontSize: 16 }}>🔍</span>
          </div>
          <div style={{ color: 'var(--muted)', fontSize: 11.5, marginTop: 8, paddingInline: 4 }}>
            یوزرنیم گیرنده را بدون @ وارد کنید (حداقل ۳ کاراکتر)
          </div>
        </div>
      )}

      {/* Step 3 — payment (revealed after recipient is entered) */}
      {recipientReady && (
        <div className="glass-card fade-up" style={{ marginTop: 22, padding: 22 }} key="checkout">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <PriceBox totalPrice={total} months={selected?.duration_months} />

            <div className="glass-soft" style={{ padding: '10px 14px', margin: '14px 0' }}>
              <Row k="پلن" v={`${selected.duration_months} ماهه`} mono />
              <Row k="گیرنده" v={`@${recipient}`} mono last />
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
              <span className="chip">⚡ تحویل آنی</span>
              <span className="chip">🔒 پرداخت امن</span>
              <span className="chip">🎯 ضمانت اصالت</span>
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
              {submitting ? 'در حال پردازش…' : 'پرداخت و فعال‌سازی ←'}
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
        background: done
          ? 'linear-gradient(135deg, #2a7fff, #1657c7)'
          : 'rgba(255,255,255,0.05)',
        border: done ? '1px solid rgba(120,170,255,0.5)' : '1px solid var(--border)',
        boxShadow: done ? '0 4px 12px -4px var(--blue-glow)' : 'none',
      }}
    >
      {done ? '✓' : n}
    </span>
  )
}

function Row({ k, v, mono, last }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: last ? 0 : 8,
      }}
    >
      <span style={{ color: 'var(--muted)', fontSize: 13 }}>{k}</span>
      <span className={mono ? 'num' : undefined} style={{ color: 'var(--text)', fontSize: 13, fontWeight: 600 }}>
        {v}
      </span>
    </div>
  )
}
