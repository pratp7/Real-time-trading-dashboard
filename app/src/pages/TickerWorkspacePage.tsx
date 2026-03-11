import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { CandlestickChart } from '../components/Chart/CandlestickChart'
import { IntervalSelector } from '../components/Chart/IntervalSelector'
import { useCandleSubscription } from '../hooks/useCandleSubscription'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  fetchHistoryThunk,
  selectCandleErrorForKey,
  selectCandlesForKey,
  selectCandleStatusForKey,
} from '../store/candlesSlice'
import { selectTickers } from '../store/tickersSlice'

export const TickerWorkspacePage = () => {
  const { tickerId } = useParams()
  const dispatch = useAppDispatch()
  const [interval, setInterval] = useState('1m')

  const normalizedTickerId = (tickerId ?? '').toLowerCase()
  const tickerDisplay = normalizedTickerId ? normalizedTickerId.toUpperCase() : 'UNKNOWN'
  const tickers = useAppSelector(selectTickers)

  const points = useAppSelector((state) =>
    selectCandlesForKey(state, normalizedTickerId, interval),
  )
  const status = useAppSelector((state) =>
    selectCandleStatusForKey(state, normalizedTickerId, interval),
  )
  const error = useAppSelector((state) =>
    selectCandleErrorForKey(state, normalizedTickerId, interval),
  )

  const tickerName = useMemo(() => {
    return tickers.find((ticker) => ticker.id === normalizedTickerId)?.name ?? tickerDisplay
  }, [normalizedTickerId, tickers, tickerDisplay])

  useEffect(() => {
    if (!normalizedTickerId) {
      return
    }

    void dispatch(
      fetchHistoryThunk({
        tickerId: normalizedTickerId,
        interval,
        limit: 100,
      }),
    )
  }, [dispatch, normalizedTickerId, interval])

  useCandleSubscription(normalizedTickerId, interval)

  return (
    <section>
      <h1 style={{ marginBottom: 8 }}>Ticker Workspace: {tickerName}</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>
        Protected workspace for historical data, live candle updates, and future ticker modules.
      </p>

      <div style={{ marginBottom: 12 }}>
        <IntervalSelector value={interval} onChange={setInterval} />
      </div>

      {status === 'error' && error ? (
        <p style={{ color: 'var(--color-negative)', marginBottom: 12 }}>{error}</p>
      ) : null}

      <CandlestickChart points={points} isLoading={status === 'loading'} />

      <div
        style={{
          border: '1px dashed var(--color-border)',
          borderRadius: 12,
          padding: 20,
          background: 'var(--color-surface)',
          marginBottom: 16,
          marginTop: 16,
        }}
      >
        <p>
          Next modules can be added here incrementally: alerts panel, technical indicators,
          instrument notes, and strategy widgets.
        </p>
      </div>

      <Link to="/dashboard">Back to dashboard</Link>
    </section>
  )
}
