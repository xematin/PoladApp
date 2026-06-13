/**
 * GlassPill — small rounded glass pill (copy buttons, toggles).
 */
export default function GlassPill({
  children,
  active = false,
  onClick,
  className = '',
  style = {},
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        borderRadius: 50,
        padding: '10px 16px',
        fontFamily: 'inherit',
        fontWeight: 700,
        fontSize: 13,
        cursor: 'pointer',
        color: active ? '#fff' : 'var(--text-dim)',
        background: active
          ? 'linear-gradient(135deg, rgba(42,127,255,0.9), rgba(22,87,199,0.9))'
          : 'rgba(255,255,255,0.05)',
        border: active
          ? '1px solid rgba(120,170,255,0.5)'
          : '1px solid var(--border)',
        boxShadow: active ? '0 6px 16px -6px var(--blue-glow)' : 'none',
        transition: 'all 0.18s ease',
        ...style,
      }}
    >
      {children}
    </button>
  )
}
