import { unstable_noStore as noStore } from "next/cache"
import yahooFinance from "yahoo-finance2"

export async function fetchQuote(ticker: string) {
  noStore()

  try {
    const response = await yahooFinance.quote(ticker)

    return response
  } catch (error) {
    console.log("Failed to fetch stock quote", error)
    throw new Error("Failed to fetch stock quote.")
  }
}
