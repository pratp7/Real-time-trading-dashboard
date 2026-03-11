import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import type { Ticker } from '../types'

export const DashboardPage = () => {
  const [items, setItems] = useState<Ticker[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      try {
        const response = await fetch('/api/tickers')
        if (!response.ok) {
          throw new Error(`Failed to load tickers (${response.status})`)
        }

        const payload = (await response.json()) as { data: { tickers: Ticker[] } }
        setItems(payload.data.tickers)
        setError(null)
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : 'Failed to load tickers')
      } finally {
        setIsLoading(false)
      }
    }

    void run()
  }, [])

  return (
    <section>
      <h1 style={{ marginBottom: 8 }}>Market Dashboard</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>
        Public ticker listing. Open a ticker to access protected charts and detailed market tools.
      </p>

      {isLoading ? <p>Loading tickers...</p> : null}
      {error ? <p style={{ color: 'var(--color-negative)' }}>{error}</p> : null}

      <ul style={{ display: 'grid', gap: 8, listStyle: 'none' }}>
        {items.map((item) => (
          <li key={item.id}>
            <Link
              to={`/market/${item.id}`}
              style={{
                display: 'block',
                padding: 12,
                border: '1px solid var(--color-border)',
                borderRadius: 8,
                background: 'var(--color-surface)',
                color: 'var(--color-text-primary)',
              }}
            >
              <strong>{item.name}</strong> ({item.id.toUpperCase()})
              <p style={{ marginTop: 6, fontSize: 13, color: 'var(--color-text-secondary)' }}>
                Click to open protected ticker workspace
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
