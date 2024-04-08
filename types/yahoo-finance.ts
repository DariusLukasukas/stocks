export type PredefinedScreenerModules =
  | "aggressive_small_caps"
  | "conservative_foreign_funds"
  | "day_gainers"
  | "day_losers"
  | "growth_technology_stocks"
  | "high_yield_bond"
  | "most_actives"
  | "most_shorted_stocks"
  | "portfolio_anchors"
  | "small_cap_gainers"
  | "solid_large_growth_funds"
  | "solid_midcap_growth_funds"
  | "top_mutual_funds"
  | "undervalued_growth_stocks"
  | "undervalued_large_caps";

export type Range = "1d" | "1w" | "1m" | "3m" | "1y";

export type Interval =
  | "1m"
  | "2m"
  | "5m"
  | "15m"
  | "30m"
  | "60m"
  | "90m"
  | "1h"
  | "1d"
  | "5d"
  | "1wk"
  | "1mo"
  | "3mo";
