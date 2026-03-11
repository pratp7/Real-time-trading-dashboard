import { BinanceProvider } from "./binanceProvider";
import { MarketDataProvider } from "./marketDataProvider";

export const binanceProvider = new BinanceProvider();

export const marketDataProvider: MarketDataProvider = binanceProvider;
