import { useEffect, useState } from 'react'

import SurfaceCard from '../components/SurfaceCard'
import GlassPill from '../components/GlassPill'
import StatusBar from '../components/StatusBar'
import HeaderBar from '../components/HeaderBar'
import api from '../api/client'

const BOT_USERNAME = import.meta.env.VITE_BOT_USERNAME || 'PoladAppBot'

function initials(name) {
  if (!name) return '؟'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].slice(0, 2)
  return (parts[0][0] || '') + (parts[1][0] || '')
}

function formatToman(value) {
  return Number(value || 0).toLocaleString('en-US')
}

export default function ProfilePage({ user }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const tgId = user?.telegram_id || user?.id
    if (!tgId) {
      setLoading(false)
      return
    }
    let active = true
    api
      .getUserProfile(tgId)
      .then((data) => active && setProfile(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [user])

  const referralLink = profile
    ? `t.me/${BOT_USERNAME}?start=${profile.referral_code}`
    : ''

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`https://${referralLink}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (_) {
      /* ignore */
    }
  }

  if (loading) {
    return (
      <div className="page">
        <StatusBar />
        <HeaderBar />
        <p style={{ color: 'var(--muted)', textAlign: 'center', marginTop: 40 }}>
          در حال بارگذاری...
        </p>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="page">
        <StatusBar />
        <HeaderBar />
        <p style={{ color: '#ff6b6b', textAlign: 'center', marginTop: 40 }}>
          {error || 'پروفایل یافت نشد.'}
        </p>
      </div>
    )
  }

  return (
    <div className="page">
      <StatusBar />
      <HeaderBar />

      {/* Avatar + name */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid var(--border-hero)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text)',
            fontSize: 28,
            fontWeight: 800,
            direction: 'ltr',
            textTransform: 'uppercase',
          }}
        >
          {initials(profile.full_name)}
        </div>
        <div style={{ color: 'var(--text)', fontWeight: 800, fontSize: 18, marginTop: 12 }}>
          {profile.full_name}
        </div>
        {profile.username && (
          <div className="num" style={{ color: 'var(--muted)', fontSize: 14 }}>
            @{profile.username}
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12 }}>
        <div className="stat-card" style={{ flex: 1, textAlign: 'center' }}>
          <div className="stat-value" style={{ fontSize: 24 }}>
            {profile.stats?.total_orders ?? 0}
          </div>
          <div className="stat-hint">تعداد سفارشات</div>
        </div>
        <div className="stat-card" style={{ flex: 1, textAlign: 'center' }}>
          <div className="stat-value" style={{ fontSize: 24 }}>
            {formatToman(profile.balance)}
          </div>
          <div className="stat-hint">موجودی کیف پول (تومان)</div>
        </div>
      </div>

      {/* Referral */}
      <SurfaceCard style={{ marginTop: 14 }}>
        <div style={{ color: 'var(--steel)', fontWeight: 700, marginBottom: 10 }}>
          🎁 دعوت از دوستان
        </div>
        <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 8 }}>
          کد معرف شما:
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <span
            className="num"
            style={{
              color: 'var(--text)',
              fontWeight: 600,
              fontSize: 18,
              letterSpacing: 1,
            }}
          >
            {profile.referral_code}
          </span>
          <GlassPill active={copied} onClick={handleCopy}>
            📋 {copied ? 'کپی شد!' : 'کپی لینک'}
          </GlassPill>
        </div>
        <div
          className="num"
          style={{
            marginTop: 10,
            color: 'var(--muted)',
            fontSize: 12,
            wordBreak: 'break-all',
          }}
        >
          {referralLink}
        </div>
      </SurfaceCard>
    </div>
  )
}
