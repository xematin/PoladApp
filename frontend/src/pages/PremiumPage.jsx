import { useEffect, useMemo, useState } from 'react'

import StatusBar from '../components/StatusBar'
import HeaderBar from '../components/HeaderBar'
import BrandHeader from '../components/BrandHeader'
import TabSwitcher from '../components/TabSwitcher'
import DurationSelector from '../components/DurationSelector'
import PriceBox from '../components/PriceBox'
import GlassButton from '../components/GlassButton'
import api from '../api/client'

export default function PremiumPage({ products, user, onNavigate }) {
  const [selectedId, setSelectedId] = useState(null)
  const [username, setUsername] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    if (products.length && selectedId == null) {
      const six = products.find((p) => p.duration_months === 6)
      setSelectedId(six ? six.id : products[0].id)
    }
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
        <TabSwitcher activeTab="premium" active="premium" onChange={(t) => t === 'stars' && onNavigate('stars')} />
      </div>

      {/* Plan selection */}
      <div className="fade-up" style={{ marginTop: 22, animationDelay: '0.1s' }}>
        <div className="section-title">انتخاب پلن اشتراک</div>
        <DurationSelector options={products} selectedId={selectedId} onSelect={setSelectedId} />
      </div>

      {/* Recipient */}
      <div className="fade-up" style={{ marginTop: 22, animationDelay: '0.15s' }}>
        <div className="section-title">گیرنده‌ی پرمیوم</div>
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

      {/* Checkout card */}
      <div className="glass-card fade-up" style={{ marginTop: 22, padding: 22, animationDelay: '0.2s' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <PriceBox totalPrice={total} months={selected?.duration_months} />

          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', margin: '16px 0' }}>
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
    </div>
  )
}
