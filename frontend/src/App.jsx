import { useEffect, useState } from 'react'

import FloatingNav from './components/FloatingNav'
import PremiumPage from './pages/PremiumPage'
import StarsPage from './pages/StarsPage'
import OrdersPage from './pages/OrdersPage'
import ProfilePage from './pages/ProfilePage'
import useTelegram from './hooks/useTelegram'
import useProducts from './hooks/useProducts'
import api from './api/client'

export default function App() {
  const { user: tgUser, initData, isReady } = useTelegram()
  const { premiumProducts, starsProducts, loading } = useProducts()

  const [active, setActive] = useState('premium')
  const [appUser, setAppUser] = useState(null)

  // Authenticate against the backend using Telegram initData
  useEffect(() => {
    if (!isReady) return
    if (initData) {
      api
        .initUser(initData)
        .then((u) => setAppUser(u))
        .catch(() => {
          // Fallback to unverified Telegram user (browser/testing)
          if (tgUser) setAppUser({ ...tgUser, telegram_id: tgUser.id })
        })
    } else if (tgUser) {
      setAppUser({ ...tgUser, telegram_id: tgUser.id })
    }
  }, [isReady, initData, tgUser])

  const renderPage = () => {
    switch (active) {
      case 'premium':
        return (
          <PremiumPage
            products={premiumProducts}
            user={appUser}
            onNavigate={setActive}
          />
        )
      case 'stars':
        return (
          <StarsPage
            products={starsProducts}
            user={appUser}
            onNavigate={setActive}
          />
        )
      case 'orders':
        return <OrdersPage user={appUser} />
      case 'profile':
        return <ProfilePage user={appUser} />
      case 'vpn':
        return (
          <div className="page">
            <div
              style={{
                textAlign: 'center',
                color: 'var(--muted)',
                marginTop: 80,
              }}
            >
              🛡️ بخش خرید VPN به‌زودی...
            </div>
          </div>
        )
      default:
        return null
    }
  }

  // 'stars' tab maps to the 'premium' nav slot visually
  const navActive = active === 'stars' ? 'premium' : active

  if (loading && !appUser) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--muted)',
        }}
      >
        در حال بارگذاری PoladApp...
      </div>
    )
  }

  return (
    <>
      {renderPage()}
      <FloatingNav active={navActive} onNavigate={setActive} />
    </>
  )
}
