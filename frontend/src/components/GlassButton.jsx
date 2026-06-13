/**
 * Button component — mono theme.
 *
 * variant:
 *   'cta' / 'primary' -> white solid button, black text
 *   'active'          -> segmented active (white solid)
 *   'inactive'        -> segmented inactive (ghost + border)
 *   'ghost'           -> bordered ghost button
 */
export default function GlassButton({
  children,
  variant = 'inactive',
  onClick,
  disabled = false,
  className = '',
  style = {},
  radius,
  block = false,
  type = 'button',
}) {
  let cls = 'btn'
  let extraStyle = {}

  if (variant === 'cta' || variant === 'primary') {
    cls = 'btn btn-primary'
    extraStyle = { padding: '15px 22px', fontSize: 15 }
  } else if (variant === 'active') {
    cls = 'seg seg-active'
  } else if (variant === 'inactive') {
    cls = 'seg'
  } else if (variant === 'ghost') {
    cls = 'btn'
  }

  return (
    <button
      type={type}
      className={`${cls} ${className}`}
      style={{
        borderRadius: radius != null ? radius : 'var(--r-btn)',
        width: block || variant === 'cta' ? '100%' : undefined,
        ...extraStyle,
        ...style,
      }}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
