import { useEffect } from 'react'

import { onQuote, subscribeQuotes, unsubscribeQuotes } from '../services/socket'
import { updateQuote } from '../store/quotesSlice'
import { useAppDispatch } from '../store/hooks'

export const useQuotesSubscription = (tickerIds: string[]) => {
  const dispatch = useAppDispatch()
  const subscriptionKey = tickerIds.join('|')

  useEffect(() => {
    const normalizedTickerIds = Array.from(
      new Set(tickerIds.map((tickerId) => tickerId.trim().toLowerCase()).filter(Boolean)),
    )

    if (normalizedTickerIds.length === 0) {
      return undefined
    }

    const detachQuoteListener = onQuote((payload) => {
      payload.data.forEach((quote) => {
        dispatch(updateQuote(quote))
      })
    })

    subscribeQuotes(normalizedTickerIds)

    return () => {
      detachQuoteListener()
      unsubscribeQuotes()
    }
  }, [dispatch, subscriptionKey])
}
