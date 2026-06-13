import { useEffect, useState } from 'react'

/**
 * StatusBar — Telegram-style status bar: time, brand, battery.
 */
export default function StatusBar() {
  const [time, setTime] = useState(() => formatTime())

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime()), 30000)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 6px 6px',
        fontSize: 12.5,
      }}
    >
      <span className="num" style={{ color: 'var(--text)', fontWeight: 600 }}>
        {time}
      </span>
      <span
        style={{
          color: 'var(--light-blue)',
          fontWeight: 800,
          fontSize: 11,
          letterSpacing: 1.5,
        }}
      >
        ✈ TELEGRAM
      </span>
      <span className="num" style={{ color: 'var(--text)', fontWeight: 600 }}>
        🔋 100%
      </span>
    </div>
  )
}

function formatTime() {
  const d = new Date()
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}
