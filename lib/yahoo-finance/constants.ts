import type { Interval, Range } from "@/types/yahoo-finance"

export const DEFAULT_TICKER = "AAPL"
export const DEFAULT_RANGE = "1d"
export const DEFAULT_INTERVAL = "1m"
export const DEFAULT_SCREENER = "most_actives"

export const VALID_RANGES: Range[] = ["1d", "1w", "1m", "3m", "1y"]
export const INTERVALS_FOR_RANGE: { [key in Range]: Interval[] } = {
  "1d": ["1m", "2m", "5m", "15m", "30m", "60m", "90m"],
  "1w": ["1h", "1d", "5d"],
  "1m": ["1h", "1d", "5d", "1wk"],
  "3m": ["1d", "5d", "1wk", "1mo"],
  "1y": ["1d", "5d", "1wk", "1mo", "3mo"],
}
