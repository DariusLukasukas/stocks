import { unstable_noStore as noStore } from "next/cache"
import yahooFinance from "yahoo-finance2"
import type { SearchResult } from "@/node_modules/yahoo-finance2/dist/esm/src/modules/search"

export async function fetchStockSearch(ticker: string, newsCount: number = 5) {
  noStore()

  const queryOptions = {
    quotesCount: 1,
    newsCount: newsCount,
    enableFuzzyQuery: true,
  }

  try {
    const response: SearchResult = await yahooFinance.search(
      ticker,
      queryOptions
    )

    return response
  } catch (error) {
    console.log("Failed to fetch stock search", error)
    throw new Error("Failed to fetch stock search.")
  }
}
