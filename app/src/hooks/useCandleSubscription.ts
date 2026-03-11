import { useEffect } from 'react'

import { onCandle, subscribeCandles, unsubscribeCandles } from '../services/socket'
import { useAppDispatch } from '../store/hooks'
import { upsertLiveCandle } from '../store/candlesSlice'

export const useCandleSubscription = (tickerId: string, interval: string) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const normalizedTickerId = tickerId.trim().toLowerCase()
    if (!normalizedTickerId) {
      return undefined
    }

    const detach = onCandle((payload) => {
      if (payload.symbol.toLowerCase() !== normalizedTickerId) {
        return
      }

      if (payload.interval !== interval) {
        return
      }

      dispatch(
        upsertLiveCandle({
          tickerId: normalizedTickerId,
          interval,
          candle: payload,
        }),
      )
    })

    subscribeCandles(normalizedTickerId, interval)

    return () => {
      detach()
      unsubscribeCandles()
    }
  }, [dispatch, tickerId, interval])
}
