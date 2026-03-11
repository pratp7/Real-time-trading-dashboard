type MarketProvider = "binance" | "kraken";

export interface AppConfig {
  port: number;
  productionAppUrl?: string;
  jwtSecret: string;
  marketProvider: MarketProvider;
}

const parsePort = (rawPort: string | undefined): number => {
  const parsed = Number.parseInt(rawPort ?? "5000", 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return 5000;
  }

  return parsed;
};

const parseMarketProvider = (rawProvider: string | undefined): MarketProvider => {
  if (rawProvider === "kraken") {
    return "kraken";
  }

  return "binance";
};

export const config: AppConfig = {
  port: parsePort(process.env.PORT),
  productionAppUrl: process.env.PRODUCTION_APP_URL?.trim() || undefined,
  jwtSecret: process.env.JWT_SECRET?.trim() || "dev-jwt-secret",
  marketProvider: parseMarketProvider(process.env.MARKET_PROVIDER?.trim()),
};
