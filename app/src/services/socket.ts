import { io, type Socket } from 'socket.io-client'

import type {
  CandlePayload,
  QuotePayload,
  SubscriptionAck,
  SubscriptionError,
  SubscriptionMessage,
} from '../types'

type SocketEventHandler<T> = (payload: T) => void

let socketInstance: Socket | null = null

const ensureSocket = (): Socket => {
  if (socketInstance) {
    return socketInstance
  }

  socketInstance = io('/', {
    path: '/socket.io',
    autoConnect: false,
    transports: ['websocket', 'polling'],
  })

  return socketInstance
}

export const connectSocket = (): Socket => {
  const socket = ensureSocket()
  if (!socket.connected) {
    socket.connect()
  }

  return socket
}

export const disconnectSocket = (): void => {
  if (socketInstance?.connected) {
    socketInstance.disconnect()
  }
}

export const getSocket = (): Socket => connectSocket()

const emitSubscription = (message: SubscriptionMessage): void => {
  const socket = connectSocket()
  socket.emit('subscription', message)
}

export const subscribeQuotes = (symbols: string[]): void => {
  emitSubscription({
    action: 'subscribe',
    channel: 'quotes',
    symbols,
  })
}

export const unsubscribeQuotes = (): void => {
  emitSubscription({
    action: 'unsubscribe',
    channel: 'quotes',
  })
}

export const subscribeCandles = (symbol: string, interval: string): void => {
  emitSubscription({
    action: 'subscribe',
    channel: 'candles',
    symbol,
    interval,
  })
}

export const unsubscribeCandles = (): void => {
  emitSubscription({
    action: 'unsubscribe',
    channel: 'candles',
  })
}

export const onQuote = (handler: SocketEventHandler<QuotePayload>): (() => void) => {
  const socket = connectSocket()
  socket.on('quote', handler)

  return () => {
    socket.off('quote', handler)
  }
}

export const onCandle = (handler: SocketEventHandler<CandlePayload>): (() => void) => {
  const socket = connectSocket()
  socket.on('candle', handler)

  return () => {
    socket.off('candle', handler)
  }
}

export const onSubscriptionAck = (
  handler: SocketEventHandler<SubscriptionAck>,
): (() => void) => {
  const socket = connectSocket()
  socket.on('subscription:ack', handler)

  return () => {
    socket.off('subscription:ack', handler)
  }
}

export const onSubscriptionError = (
  handler: SocketEventHandler<SubscriptionError>,
): (() => void) => {
  const socket = connectSocket()
  socket.on('subscription:error', handler)

  return () => {
    socket.off('subscription:error', handler)
  }
}
