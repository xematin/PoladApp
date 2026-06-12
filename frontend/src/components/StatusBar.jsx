import { useEffect, useState } from 'react'

/**
 * StatusBar — emulates the Telegram status bar: time, brand, battery.
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
        padding: '8px 4px',
        fontSize: 13,
      }}
    >
      <span style={{ color: 'var(--steel)', fontWeight: 700, direction: 'ltr' }}>
        {time}
      </span>
      <span style={{ color: 'var(--glow-blue)', fontWeight: 800, fontSize: 12 }}>
        ✈ TELEGRAM
      </span>
      <span style={{ color: 'var(--steel)', fontWeight: 700 }}>🔋 100%</span>
    </div>
  )
}

function formatTime() {
  const d = new Date()
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}
