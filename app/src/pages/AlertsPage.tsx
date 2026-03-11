import { useEffect } from 'react'

import { AlertPanel } from '../components/Alert/AlertPanel'
import { fetchAlertsThunk } from '../store/alertsSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchTickersThunk, selectTickers, selectTickersStatus } from '../store/tickersSlice'

export const AlertsPage = () => {
  const dispatch = useAppDispatch()
  const tickers = useAppSelector(selectTickers)
  const tickersStatus = useAppSelector(selectTickersStatus)

  useEffect(() => {
    if (tickersStatus === 'idle') {
      void dispatch(fetchTickersThunk())
    }
  }, [dispatch, tickersStatus])

  useEffect(() => {
    void dispatch(fetchAlertsThunk())
  }, [dispatch])

  return (
    <section>
      <h1 style={{ marginBottom: 8 }}>Alerts</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>
        Manage price alerts for your account. Create target conditions, toggle active alerts, and
        remove entries you no longer need.
      </p>

      <AlertPanel tickers={tickers} />
    </section>
  )
}
