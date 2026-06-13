import useTelegram from '../hooks/useTelegram'

/**
 * HeaderBar — minimal Telegram header: close, title, menu.
 */
export default function HeaderBar() {
  const { close } = useTelegram()

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 4px 12px',
      }}
    >
      <button
        onClick={close}
        className="chip"
        style={{ cursor: 'pointer', color: 'var(--light-blue)' }}
      >
        بستن
      </button>

      <div style={{ textAlign: 'center' }}>
        <div style={{ color: 'var(--text)', fontWeight: 700, fontSize: 14 }}>
          PoladApp
        </div>
        <div
          className="num"
          style={{ color: 'var(--muted)', fontSize: 10, letterSpacing: 1 }}
        >
          mini app
        </div>
      </div>

      <button className="chip" style={{ cursor: 'pointer', padding: '6px 10px' }}>
        ⋯
      </button>
    </div>
  )
}
