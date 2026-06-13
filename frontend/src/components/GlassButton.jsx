/**
 * GlassButton — a 3D glass-bordered button.
 *
 * variant: 'active' | 'inactive' | 'cta'
 */
export default function GlassButton({
  children,
  variant = 'inactive',
  onClick,
  disabled = false,
  className = '',
  style = {},
  radius = 14,
  type = 'button',
}) {
  const variantClass =
    variant === 'cta'
      ? 'glass-cta'
      : variant === 'active'
      ? 'glass-active'
      : 'glass-inactive'

  const baseStyle = {
    borderRadius: variant === 'cta' ? 50 : radius,
    padding: variant === 'cta' ? '16px 24px' : '10px 16px',
    fontWeight: variant === 'cta' ? 800 : 600,
    fontSize: 15,
    width: variant === 'cta' ? '100%' : undefined,
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.15s ease',
    ...style,
  }

  return (
    <button
      type={type}
      className={`${variantClass} ${className}`}
      style={baseStyle}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
