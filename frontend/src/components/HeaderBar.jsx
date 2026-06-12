import useTelegram from '../hooks/useTelegram'

/**
 * HeaderBar — Telegram-style header: close button, title, menu.
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
        borderBottom: '0.5px solid var(--border-dark)',
      }}
    >
      <button
        onClick={close}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--glow-blue)',
          fontSize: 15,
          fontWeight: 600,
        }}
      >
        بستن
      </button>

      <div style={{ textAlign: 'center' }}>
        <div style={{ color: 'var(--steel)', fontWeight: 800, fontSize: 16 }}>
          PoladApp
        </div>
        <div style={{ color: 'var(--muted)', fontSize: 11 }}>mini app</div>
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
