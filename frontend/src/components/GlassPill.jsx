/**
 * GlassPill — a rounded (50px) glass pill, used for duration selectors,
 * copy buttons and small toggles.
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
      className={`${active ? 'glass-active' : 'glass-inactive'} ${className}`}
      style={{
        borderRadius: 50,
        padding: '10px 18px',
        fontWeight: 700,
        fontSize: 14,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        ...style,
      }}
    >
      {children}
    </button>
  )
}
