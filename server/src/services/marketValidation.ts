const ALLOWED_INTERVALS = new Set(["1m", "5m", "15m", "1h", "4h", "1d"]);

export const DEFAULT_INTERVAL = "1m";
export const DEFAULT_LIMIT = 100;
export const MAX_LIMIT = 1000;

export const getAllowedIntervals = (): string[] => {
  return Array.from(ALLOWED_INTERVALS);
};

export const isAllowedInterval = (interval: string): boolean => {
  return ALLOWED_INTERVALS.has(interval);
};

export const toSafeLimit = (rawLimit: string | undefined): number | null => {
  if (!rawLimit) {
    return DEFAULT_LIMIT;
  }

  const parsed = Number.parseInt(rawLimit, 10);
  if (Number.isNaN(parsed) || parsed < 1 || parsed > MAX_LIMIT) {
    return null;
  }

  return parsed;
};
