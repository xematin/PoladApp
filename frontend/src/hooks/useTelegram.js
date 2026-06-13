import { useEffect, useState } from 'react'

const BG_COLOR = '#0a0a0a'

/**
 * Safe access to the Telegram WebApp SDK with graceful browser fallback.
 */
export function useTelegram() {
  const [isReady, setIsReady] = useState(false)
  const tg = typeof window !== 'undefined' ? window.Telegram?.WebApp : null

  useEffect(() => {
    if (tg) {
      try {
        tg.ready()
        tg.expand()
        tg.setHeaderColor?.(BG_COLOR)
        tg.setBackgroundColor?.(BG_COLOR)
      } catch (_) {
        /* ignore SDK quirks */
      }
    }
    setIsReady(true)
  }, [tg])

  const user = tg?.initDataUnsafe?.user || null
  const initData = tg?.initData || ''

  const close = () => {
    if (tg?.close) tg.close()
  }

  const hapticImpact = (style = 'light') => {
    try {
      tg?.HapticFeedback?.impactOccurred(style)
    } catch (_) {
      /* ignore */
    }
  }

  return { tg, user, initData, isReady, close, hapticImpact }
}

export default useTelegram
