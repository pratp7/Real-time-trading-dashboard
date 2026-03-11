import { useMemo, useState } from 'react'

import { formatDate } from '../../utils/formatDate'
import { formatPrice } from '../../utils/formatPrice'
import type { AlertCondition, Ticker } from '../../types'
import {
  createAlertThunk,
  deleteAlertThunk,
  selectAlerts,
  selectAlertsError,
  selectAlertsStatus,
  toggleAlertThunk,
} from '../../store/alertsSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'

interface AlertPanelProps {
  tickers: Ticker[]
}

export const AlertPanel = ({ tickers }: AlertPanelProps) => {
  const dispatch = useAppDispatch()
  const alerts = useAppSelector(selectAlerts)
  const status = useAppSelector(selectAlertsStatus)
  const error = useAppSelector(selectAlertsError)

  const defaultTickerId = tickers[0]?.id ?? ''
  const [symbol, setSymbol] = useState('')
  const [condition, setCondition] = useState<AlertCondition>('above')
  const [targetPrice, setTargetPrice] = useState('')

  const activeSymbol = symbol || defaultTickerId

  const selectedTicker = useMemo(() => {
    return tickers.find((ticker) => ticker.id === activeSymbol) ?? null
  }, [tickers, activeSymbol])

  const submitDisabled = !activeSymbol || !targetPrice || Number(targetPrice) <= 0

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!selectedTicker) {
      return
    }

    await dispatch(
      createAlertThunk({
        symbol: selectedTicker.id,
        name: selectedTicker.name,
        condition,
        targetPrice: Number(targetPrice),
      }),
    )

    setTargetPrice('')
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <form
        onSubmit={(event) => {
          void handleCreate(event)
        }}
        style={{
          border: '1px solid var(--color-border)',
          borderRadius: 12,
          background: 'var(--color-surface)',
          padding: 16,
          display: 'grid',
          gap: 12,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 18 }}>Create alert</h2>

        <div style={{ display: 'grid', gap: 6 }}>
          <label htmlFor="alert-symbol">Symbol</label>
          <select
            id="alert-symbol"
            value={activeSymbol}
            onChange={(event) => setSymbol(event.target.value)}
            disabled={tickers.length === 0}
          >
            {tickers.map((ticker) => (
              <option key={ticker.id} value={ticker.id}>
                {ticker.symbol} - {ticker.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gap: 6 }}>
          <label htmlFor="alert-condition">Condition</label>
          <select
            id="alert-condition"
            value={condition}
            onChange={(event) => setCondition(event.target.value as AlertCondition)}
          >
            <option value="above">Above</option>
            <option value="below">Below</option>
          </select>
        </div>

        <div style={{ display: 'grid', gap: 6 }}>
          <label htmlFor="alert-target">Target price (USD)</label>
          <input
            id="alert-target"
            type="number"
            min="0"
            step="0.01"
            value={targetPrice}
            onChange={(event) => setTargetPrice(event.target.value)}
            placeholder="e.g. 65000"
          />
        </div>

        <button
          type="submit"
          disabled={submitDisabled}
          style={{
            justifySelf: 'start',
            background: 'var(--color-accent)',
            color: '#fff',
            borderRadius: 8,
            padding: '8px 14px',
            opacity: submitDisabled ? 0.6 : 1,
          }}
        >
          Create alert
        </button>
      </form>

      <section
        style={{
          border: '1px solid var(--color-border)',
          borderRadius: 12,
          background: 'var(--color-surface)',
          padding: 16,
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: 18 }}>Your alerts</h2>

        {status === 'loading' ? <p>Loading alerts...</p> : null}
        {error ? <p style={{ color: 'var(--color-negative)' }}>{error}</p> : null}

        {status !== 'loading' && alerts.length === 0 ? (
          <p style={{ color: 'var(--color-text-secondary)' }}>No alerts created yet.</p>
        ) : null}

        <div style={{ display: 'grid', gap: 10 }}>
          {alerts.map((alert) => {
            return (
              <article
                key={alert.id}
                style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 10,
                  padding: 12,
                  display: 'grid',
                  gap: 10,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <strong>
                    {alert.symbol.toUpperCase()} ({alert.name})
                  </strong>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>
                    {formatDate(alert.createdAt)}
                  </span>
                </div>

                <p style={{ margin: 0 }}>
                  Trigger when price is <strong>{alert.condition}</strong>{' '}
                  <strong>{formatPrice(alert.targetPrice)}</strong>
                </p>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => {
                      void dispatch(
                        toggleAlertThunk({
                          id: alert.id,
                          isActive: !alert.isActive,
                        }),
                      )
                    }}
                    style={{
                      borderRadius: 8,
                      padding: '6px 10px',
                      background: alert.isActive ? '#1e7a4d' : '#555d77',
                      color: '#fff',
                    }}
                  >
                    {alert.isActive ? 'Deactivate' : 'Activate'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      void dispatch(deleteAlertThunk(alert.id))
                    }}
                    style={{
                      borderRadius: 8,
                      padding: '6px 10px',
                      background: '#8a2f38',
                      color: '#fff',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
