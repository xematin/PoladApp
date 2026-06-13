/**
 * SurfaceCard — a glassmorphism card container.
 */
export default function SurfaceCard({ children, className = '', style = {} }) {
  return (
    <div className={`glass-card ${className}`} style={{ padding: 16, ...style }}>
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  )
}
