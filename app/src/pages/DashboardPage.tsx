import { useEffect } from 'react'

import { TickerList } from '../components/TickerList/TickerList'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchTickersThunk, selectTickersStatus } from '../store/tickersSlice'

export const DashboardPage = () => {
  const dispatch = useAppDispatch()
  const tickersStatus = useAppSelector(selectTickersStatus)

  useEffect(() => {
    if (tickersStatus === 'idle') {
      void dispatch(fetchTickersThunk())
    }
  }, [dispatch, tickersStatus])

  return (
    <section>
      <h1 style={{ marginBottom: 8 }}>Market Dashboard</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>
        Public ticker listing. Open a ticker to access protected charts and detailed market tools.
      </p>

      <TickerList />
    </section>
  )
}
