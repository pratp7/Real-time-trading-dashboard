import { config } from "../config/env";
import { MarketDataProvider } from "./marketDataProvider";
import { MockMarketProvider } from "./mockMarketProvider";

export const mockMarketProvider = new MockMarketProvider();

export const marketDataProvider: MarketDataProvider = mockMarketProvider;

if (config.marketProvider !== "mock") {
	console.warn(
		`MARKET_PROVIDER=${config.marketProvider} requested, but the server is currently using the local mock market provider.`,
	);
}
