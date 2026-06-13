/**
 * SurfaceCard — a card container (mono theme).
 */
export default function SurfaceCard({ children, className = '', style = {} }) {
  return (
    <div
      className={`card ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}
