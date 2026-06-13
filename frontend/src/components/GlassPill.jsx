/**
 * GlassPill — rounded (50px) segmented pill (mono theme).
 * Active = white solid + black text, inactive = ghost + border.
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
      className={`${active ? 'seg seg-active' : 'seg'} ${className}`}
      style={{
        borderRadius: 50,
        padding: '10px 18px',
        fontSize: 14,
        ...style,
      }}
    >
      {children}
    </button>
  )
}
