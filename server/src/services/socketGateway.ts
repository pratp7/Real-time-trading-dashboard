import { Server as HttpServer } from "http";

import { Server, Socket } from "socket.io";

import { MarketDataProvider } from "./marketDataProvider";
import { DEFAULT_INTERVAL, getAllowedIntervals, isAllowedInterval } from "./marketValidation";

interface QuoteSubscriptionPayload {
  symbols?: string[];
}

interface CandleSubscriptionPayload {
  symbol?: string;
  interval?: string;
}

interface SubscriptionMessage {
  action?: "subscribe" | "unsubscribe";
  channel?: "quotes" | "candles";
  symbols?: string[];
  symbol?: string;
  interval?: string;
}

interface SocketSubscriptionState {
  quotesSymbols: string[];
  candleSymbol?: string;
  candleInterval: string;
  quotesTimer?: NodeJS.Timeout;
  candleTimer?: NodeJS.Timeout;
}

const QUOTES_POLL_MS = 2_000;
const CANDLE_POLL_MS = 5_000;

const getState = (socket: Socket): SocketSubscriptionState => {
  const existingState = socket.data.subscriptionState as SocketSubscriptionState | undefined;

  if (existingState) {
    return existingState;
  }

  const nextState: SocketSubscriptionState = {
    quotesSymbols: [],
    candleInterval: DEFAULT_INTERVAL,
  };

  socket.data.subscriptionState = nextState;
  return nextState;
};

const clearTimer = (timer: NodeJS.Timeout | undefined): void => {
  if (timer) {
    clearInterval(timer);
  }
};

const normalizeSymbols = (symbols: string[] | undefined): string[] => {
  if (!symbols) {
    return [];
  }

  return Array.from(new Set(symbols.map((symbol) => symbol.trim().toLowerCase()).filter(Boolean)));
};

const emitQuotes = async (
  socket: Socket,
  marketDataProvider: MarketDataProvider,
  payload: QuoteSubscriptionPayload,
): Promise<void> => {
  const symbols = normalizeSymbols(payload.symbols);
  if (symbols.length === 0) {
    socket.emit("subscription:error", { error: "quotes subscription requires symbols" });
    return;
  }

  const data = await marketDataProvider.getQuotes({ tickerIds: symbols });
  socket.emit("quote", { type: "quote", data });
};

const emitCandle = async (
  socket: Socket,
  marketDataProvider: MarketDataProvider,
  payload: CandleSubscriptionPayload,
): Promise<void> => {
  const symbol = payload.symbol?.trim().toLowerCase();
  const interval = payload.interval ?? DEFAULT_INTERVAL;

  if (!symbol) {
    socket.emit("subscription:error", { error: "candles subscription requires symbol" });
    return;
  }

  if (!isAllowedInterval(interval)) {
    socket.emit("subscription:error", {
      error: `Invalid candle interval. Allowed values: ${getAllowedIntervals().join(", ")}`,
    });
    return;
  }

  const candle = await marketDataProvider.getLatestCandle({
    tickerId: symbol,
    interval,
  });

  socket.emit("candle", { type: "candle", ...candle });
};

const startQuotesSubscription = async (
  socket: Socket,
  marketDataProvider: MarketDataProvider,
  symbols: string[],
): Promise<void> => {
  const state = getState(socket);
  state.quotesSymbols = normalizeSymbols(symbols);
  clearTimer(state.quotesTimer);

  await emitQuotes(socket, marketDataProvider, { symbols: state.quotesSymbols });

  state.quotesTimer = setInterval(() => {
    void emitQuotes(socket, marketDataProvider, { symbols: state.quotesSymbols }).catch((error) => {
      socket.emit("subscription:error", { error: error instanceof Error ? error.message : "Quotes update failed" });
    });
  }, QUOTES_POLL_MS);
};

const startCandleSubscription = async (
  socket: Socket,
  marketDataProvider: MarketDataProvider,
  symbol: string,
  interval: string,
): Promise<void> => {
  const state = getState(socket);
  state.candleSymbol = symbol.trim().toLowerCase();
  state.candleInterval = interval;
  clearTimer(state.candleTimer);

  await emitCandle(socket, marketDataProvider, {
    symbol: state.candleSymbol,
    interval: state.candleInterval,
  });

  state.candleTimer = setInterval(() => {
    void emitCandle(socket, marketDataProvider, {
      symbol: state.candleSymbol,
      interval: state.candleInterval,
    }).catch((error) => {
      socket.emit("subscription:error", { error: error instanceof Error ? error.message : "Candle update failed" });
    });
  }, CANDLE_POLL_MS);
};

const stopQuotesSubscription = (socket: Socket): void => {
  const state = getState(socket);
  clearTimer(state.quotesTimer);
  state.quotesTimer = undefined;
  state.quotesSymbols = [];
};

const stopCandleSubscription = (socket: Socket): void => {
  const state = getState(socket);
  clearTimer(state.candleTimer);
  state.candleTimer = undefined;
  state.candleSymbol = undefined;
};

const handleSubscriptionMessage = async (
  socket: Socket,
  marketDataProvider: MarketDataProvider,
  message: SubscriptionMessage,
): Promise<void> => {
  const action = message.action;
  const channel = message.channel;

  if (!action || !channel) {
    socket.emit("subscription:error", { error: "action and channel are required" });
    return;
  }

  if (action === "subscribe" && channel === "quotes") {
    await startQuotesSubscription(socket, marketDataProvider, message.symbols ?? []);
    socket.emit("subscription:ack", { action, channel, symbols: normalizeSymbols(message.symbols) });
    return;
  }

  if (action === "unsubscribe" && channel === "quotes") {
    stopQuotesSubscription(socket);
    socket.emit("subscription:ack", { action, channel });
    return;
  }

  if (action === "subscribe" && channel === "candles") {
    await startCandleSubscription(
      socket,
      marketDataProvider,
      message.symbol ?? "",
      message.interval ?? DEFAULT_INTERVAL,
    );
    socket.emit("subscription:ack", {
      action,
      channel,
      symbol: message.symbol?.trim().toLowerCase(),
      interval: message.interval ?? DEFAULT_INTERVAL,
    });
    return;
  }

  if (action === "unsubscribe" && channel === "candles") {
    stopCandleSubscription(socket);
    socket.emit("subscription:ack", { action, channel });
    return;
  }

  socket.emit("subscription:error", { error: "Unsupported subscription message" });
};

const cleanupSocket = (socket: Socket): void => {
  stopQuotesSubscription(socket);
  stopCandleSubscription(socket);
};

export const registerSocketGateway = (
  httpServer: HttpServer,
  marketDataProvider: MarketDataProvider,
  allowedOrigins: string[],
): Server => {
  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("subscription", (message: SubscriptionMessage) => {
      void handleSubscriptionMessage(socket, marketDataProvider, message).catch((error) => {
        socket.emit("subscription:error", {
          error: error instanceof Error ? error.message : "Subscription request failed",
        });
      });
    });

    socket.on("disconnect", () => {
      cleanupSocket(socket);
    });
  });

  return io;
};
