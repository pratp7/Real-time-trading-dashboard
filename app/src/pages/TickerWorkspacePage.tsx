import { Link, useParams } from 'react-router-dom'

export const TickerWorkspacePage = () => {
  const { tickerId } = useParams()
  const normalizedTickerId = tickerId?.toUpperCase() ?? 'UNKNOWN'

  return (
    <section>
      <h1 style={{ marginBottom: 8 }}>Ticker Workspace: {normalizedTickerId}</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>
        Protected page shell for ticker-specific charts, historical candles, alerts, and future
        workspace modules.
      </p>

      <div
        style={{
          border: '1px dashed var(--color-border)',
          borderRadius: 12,
          padding: 20,
          background: 'var(--color-surface)',
          marginBottom: 16,
        }}
      >
        <p>
          This is where chart panels, history tables, alert widgets, and additional analytics
          features will be plugged in incrementally.
        </p>
      </div>

      <Link to="/dashboard">Back to dashboard</Link>
    </section>
  )
}
