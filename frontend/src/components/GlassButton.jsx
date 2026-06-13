/**
 * GlassButton.
 *   variant 'cta'      -> glowing blue gradient CTA (full width)
 *   variant 'active'   -> selected glass pill (blue tint)
 *   variant 'inactive' -> ghost glass pill
 */
export default function GlassButton({
  children,
  variant = 'inactive',
  onClick,
  disabled = false,
  className = '',
  style = {},
  type = 'button',
}) {
  if (variant === 'cta') {
    return (
      <button
        type={type}
        className={`btn-cta ${className}`}
        style={style}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    )
  }

  const isActive = variant === 'active'
  return (
    <button
      type={type}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: '11px 16px',
        borderRadius: 12,
        fontFamily: 'inherit',
        fontWeight: 700,
        fontSize: 14,
        cursor: 'pointer',
        color: isActive ? '#fff' : 'var(--muted)',
        background: isActive
          ? 'linear-gradient(135deg, rgba(42,127,255,0.9), rgba(22,87,199,0.9))'
          : 'rgba(255,255,255,0.04)',
        border: isActive
          ? '1px solid rgba(120,170,255,0.5)'
          : '1px solid var(--border)',
        boxShadow: isActive ? '0 6px 18px -6px var(--blue-glow)' : 'none',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.18s ease',
        ...style,
      }}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
