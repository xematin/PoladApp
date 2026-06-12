/**
 * SurfaceCard — a rounded surface container used for inputs and summaries.
 */
export default function SurfaceCard({ children, className = '', style = {} }) {
  return (
    <div
      className={className}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-dark)',
        borderRadius: 20,
        padding: 16,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
