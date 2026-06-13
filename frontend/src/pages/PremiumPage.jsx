import { useEffect, useMemo, useState } from 'react'

import HeroCard from '../components/HeroCard'
import SurfaceCard from '../components/SurfaceCard'
import OrderSummary from '../components/OrderSummary'
import GlassButton from '../components/GlassButton'
import StatusBar from '../components/StatusBar'
import HeaderBar from '../components/HeaderBar'
import api from '../api/client'

export default function PremiumPage({ products, user, onNavigate }) {
  const [selectedId, setSelectedId] = useState(null)
  const [username, setUsername] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState(null)

  // Default to the 3-month plan when products load
  useEffect(() => {
    if (products.length && selectedId == null) {
      const threeMonth = products.find((p) => p.duration_months === 3)
      setSelectedId(threeMonth ? threeMonth.id : products[0].id)
    }
  }, [products, selectedId])

  const selected = useMemo(
    () => products.find((p) => p.id === selectedId) || null,
    [products, selectedId]
  )

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

  const total = selected ? Number(selected.price_toman) : 0

  return (
    <div className="page">
      <StatusBar />
      <HeaderBar onNavigate={onNavigate} />

      <HeroCard
        activeTab="premium"
        onTabChange={(t) => t === 'stars' && onNavigate('stars')}
        totalPrice={total}
        months={selected?.duration_months}
        durationOptions={products}
        selectedId={selectedId}
        onSelectDuration={setSelectedId}
      />

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

      {/* Order summary */}
      <SurfaceCard style={{ marginTop: 14 }}>
        <OrderSummary
          label={{ key: 'مدت', value: selected ? `${selected.duration_months} ماه` : '—', mono: true }}
          amount={total}
          total={total}
        />
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

      {/* CTA */}
      <div style={{ marginTop: 16 }}>
        <GlassButton
          variant="cta"
          onClick={handlePay}
          disabled={submitting}
        >
          {submitting ? 'در حال پردازش...' : 'پرداخت و فعالسازی ←'}
        </GlassButton>
      </div>
    </div>
  )
}
