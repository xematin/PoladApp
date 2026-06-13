import { useEffect, useState } from 'react'

import StatusBar from '../components/StatusBar'
import HeaderBar from '../components/HeaderBar'
import GlassPill from '../components/GlassPill'
import api from '../api/client'

const BOT_USERNAME = import.meta.env.VITE_BOT_USERNAME || 'PoladAppBot'

function initials(name) {
  if (!name) return '؟'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].slice(0, 2)
  return (parts[0][0] || '') + (parts[1][0] || '')
}
function fmt(v) {
  return Number(v || 0).toLocaleString('en-US')
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
      .then((d) => active && setProfile(d))
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [user])

  const referralLink = profile ? `t.me/${BOT_USERNAME}?start=${profile.referral_code}` : ''

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
        <p style={{ color: 'var(--muted)', textAlign: 'center', marginTop: 40 }}>در حال بارگذاری…</p>
      </div>
    )
  }
  if (error || !profile) {
    return (
      <div className="page">
        <StatusBar />
        <HeaderBar />
        <p style={{ color: 'var(--danger)', textAlign: 'center', marginTop: 40 }}>{error || 'پروفایل یافت نشد.'}</p>
      </div>
    )
  }

  return (
    <div className="page">
      <StatusBar />
      <HeaderBar />

      {/* Avatar */}
      <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 16, marginBottom: 22 }}>
        <div
          className="logo-badge"
          style={{ width: 88, height: 88, borderRadius: '50%' }}
        >
          <span
            className="num"
            style={{ position: 'relative', zIndex: 1, color: '#fff', fontSize: 30, fontWeight: 700, textTransform: 'uppercase' }}
          >
            {initials(profile.full_name)}
          </span>
        </div>
        <div style={{ color: '#fff', fontWeight: 800, fontSize: 19, marginTop: 14 }}>{profile.full_name}</div>
        {profile.username && (
          <div className="num" style={{ color: 'var(--muted)', fontSize: 14, marginTop: 2 }}>@{profile.username}</div>
        )}
      </div>

      {/* Stats */}
      <div className="fade-up" style={{ display: 'flex', gap: 12, animationDelay: '0.08s' }}>
        <div className="glass-card" style={{ flex: 1, padding: 18 }}>
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <div className="num" style={{ color: '#fff', fontSize: 28, fontWeight: 700 }}>
              {profile.stats?.total_orders ?? 0}
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 6 }}>سفارش‌ها</div>
          </div>
        </div>
        <div className="glass-card" style={{ flex: 1, padding: 18 }}>
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <div className="num" style={{ color: 'var(--light-blue)', fontSize: 28, fontWeight: 700 }}>
              {fmt(profile.balance)}
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 6 }}>کیف پول (تومان)</div>
          </div>
        </div>
      </div>

      {/* Referral */}
      <div className="glass-card fade-up" style={{ marginTop: 16, padding: 20, animationDelay: '0.14s' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 18 }}>🎁</span>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>دعوت از دوستان</span>
          </div>
          <div style={{ color: 'var(--muted)', fontSize: 12.5, marginBottom: 14, lineHeight: 1.7 }}>
            با کد معرف خود، دوستانت رو دعوت کن و پاداش بگیر.
          </div>

          <div
            className="glass-soft"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px' }}
          >
            <span className="num" style={{ color: 'var(--light-blue)', fontWeight: 700, fontSize: 20, letterSpacing: 2 }}>
              {profile.referral_code}
            </span>
            <GlassPill active={copied} onClick={handleCopy}>
              {copied ? '✓ کپی شد' : '📋 کپی لینک'}
            </GlassPill>
          </div>

          <div
            className="num"
            style={{ marginTop: 12, color: 'var(--muted)', fontSize: 11.5, wordBreak: 'break-all', textAlign: 'center' }}
          >
            {referralLink}
          </div>
        </div>
      </div>
    </div>
  )
}
