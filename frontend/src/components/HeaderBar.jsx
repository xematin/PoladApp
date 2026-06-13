import useTelegram from '../hooks/useTelegram'

/**
 * HeaderBar — Telegram-style header: close button, title, menu (mono).
 */
export default function HeaderBar() {
  const { close } = useTelegram()

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 4px',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <button
        onClick={close}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--muted)',
          fontSize: 15,
          fontWeight: 600,
        }}
      >
        بستن
      </button>

      <div style={{ textAlign: 'center' }}>
        <div style={{ color: 'var(--text)', fontWeight: 800, fontSize: 16 }}>
          PoladApp
        </div>
        <div
          style={{
            color: 'var(--muted)',
            fontSize: 11,
            letterSpacing: 1,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          mini app
        </div>
      </div>

      <button
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--muted)',
          fontSize: 20,
        }}
      >
        ⋯
      </button>
    </div>
  )
}
