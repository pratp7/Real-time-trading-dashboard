import { useNavigate } from 'react-router-dom'

import { useQuotesSubscription } from '../../hooks/useQuotesSubscription'
import {
  selectTicker,
  selectTickerId,
  selectTickers,
  selectTickersError,
  selectTickersStatus,
} from '../../store/tickersSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { selectQuotesBySymbol } from '../../store/quotesSlice'
import { formatPercent } from '../../utils/formatPercent'
import { formatPrice } from '../../utils/formatPrice'

const rowBaseStyle: React.CSSProperties = {
  width: '100%',
  textAlign: 'left',
  padding: 12,
  border: '1px solid var(--color-border)',
  borderRadius: 8,
  background: 'var(--color-surface)',
  color: 'var(--color-text-primary)',
  transition: 'border-color var(--transition-fast), background var(--transition-fast)',
}

export const TickerList = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const items = useAppSelector(selectTickers)
  const quotesBySymbol = useAppSelector(selectQuotesBySymbol)
  const selectedTickerId = useAppSelector(selectTickerId)
  const status = useAppSelector(selectTickersStatus)
  const error = useAppSelector(selectTickersError)

  useQuotesSubscription(items.map((item) => item.id))

  const handleTickerClick = (tickerId: string) => {
    dispatch(selectTicker(tickerId))
    navigate(`/market/${tickerId}`)
  }

  if (status === 'loading') {
    return (
      <ul style={{ display: 'grid', gap: 8, listStyle: 'none' }}>
        {Array.from({ length: 5 }).map((_, index) => (
          <li
            key={`ticker-skeleton-${index}`}
            style={{
              padding: 12,
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              color: 'var(--color-text-muted)',
            }}
          >
            Loading ticker...
          </li>
        ))}
      </ul>
    )
  }

  if (status === 'error' && error) {
    return <p style={{ color: 'var(--color-negative)' }}>{error}</p>
  }

  return (
    <ul style={{ display: 'grid', gap: 8, listStyle: 'none' }}>
      {items.map((item) => {
        const isSelected = selectedTickerId === item.id

        return (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => handleTickerClick(item.id)}
              style={{
                ...rowBaseStyle,
                borderColor: isSelected ? 'var(--color-accent)' : 'var(--color-border)',
                background: isSelected ? 'var(--color-surface-alt)' : 'var(--color-surface)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 16,
                  alignItems: 'flex-start',
                }}
              >
                <div>
                  <strong>{item.name}</strong> ({item.id.toUpperCase()})
                  <p style={{ marginTop: 6, fontSize: 13, color: 'var(--color-text-secondary)' }}>
                    Click to open protected ticker workspace
                  </p>
                </div>

                <div style={{ minWidth: 120, textAlign: 'right' }}>
                  <QuoteSummary quote={quotesBySymbol[item.id.toUpperCase()]} />
                </div>
              </div>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

interface QuoteSummaryProps {
  quote?: {
    price: number
    change: number
    percent_change: number
  }
}

const QuoteSummary = ({ quote }: QuoteSummaryProps) => {
  if (!quote) {
    return (
      <>
        <div style={{ fontWeight: 700 }}>--</div>
        <div style={{ marginTop: 6, fontSize: 13, color: 'var(--color-text-muted)' }}>
          Waiting for price...
        </div>
      </>
    )
  }

  const changeColor = quote.change >= 0 ? 'var(--color-positive)' : 'var(--color-negative)'

  return (
    <>
      <div style={{ fontWeight: 700 }}>{formatPrice(quote.price)}</div>
      <div style={{ marginTop: 6, fontSize: 13, color: changeColor }}>
        {formatPrice(quote.change)} ({formatPercent(quote.percent_change)})
      </div>
    </>
  )
}
