import { cn } from "@/lib/utils"
import { fetchChartData } from "@/lib/yahoo-finance/fetchChartData"
import type { Interval, Range } from "@/types/yahoo-finance"
import AreaClosedChart from "./AreaClosedChart"
import yahooFinance from "yahoo-finance2"
import { fetchQuote } from "@/lib/yahoo-finance/fetchQuote"

interface StockGraphProps {
  ticker: string
  range: Range
  interval: Interval
}

const rangeTextMapping = {
  "1d": "",
  "1w": "Past Week",
  "1m": "Past Month",
  "3m": "Past 3 Months",
  "1y": "Past Year",
}

function calculatePriceChange(qouteClose: number, currentPrice: number) {
  const firstItemPrice = qouteClose || 0
  return ((currentPrice - firstItemPrice) / firstItemPrice) * 100
}

export default async function StockChart({
  ticker,
  range,
  interval,
}: StockGraphProps) {
  const chartData = await fetchChartData(ticker, range, interval)
  const quoteData = await fetchQuote(ticker)

  const [chart, quote] = await Promise.all([chartData, quoteData])

  const priceChange =
    chart.quotes.length &&
    calculatePriceChange(
      Number(chart.quotes[0].close),
      Number(chart.meta.regularMarketPrice)
    )

  const ChartQuotes = chart.quotes
    .map((quote) => ({
      date: quote.date,
      close: quote.close?.toFixed(2),
    }))
    .filter((quote) => quote.close !== undefined && quote.date !== null)

  return (
    <div className="h-[27.5rem] w-full">
      <div>
        <div className="space-x-1 text-muted-foreground">
          <span className="font-bold text-primary">{quoteData.symbol}</span>
          <span>·</span>
          <span>
            {quoteData.fullExchangeName === "NasdaqGS"
              ? "NASDAQ"
              : quoteData.fullExchangeName}
          </span>
          <span>{quoteData.shortName}</span>
        </div>

        <div className="flex flex-row items-end justify-between">
          <div className="space-x-1">
            <span className="text-nowrap">
              <span className="text-xl font-bold">
                {quote.currency === "USD" ? "$" : ""}
                {quote.regularMarketPrice?.toFixed(2)}
              </span>
              <span className="font-semibold">
                {quote.regularMarketChange &&
                quote.regularMarketChangePercent !== undefined ? (
                  quote.regularMarketChange > 0 ? (
                    <span className="text-green-800 dark:text-green-400">
                      +{quote.regularMarketChange.toFixed(2)} (+
                      {quote.regularMarketChangePercent.toFixed(2)}%)
                    </span>
                  ) : (
                    <span className="text-red-800 dark:text-red-500">
                      {quote.regularMarketChange.toFixed(2)} (
                      {quote.regularMarketChangePercent.toFixed(2)}%)
                    </span>
                  )
                ) : null}
              </span>
            </span>
            <span className="inline space-x-1 font-semibold text-muted-foreground">
              {quote.hasPrePostMarketData && quote.postMarketPrice && (
                <>
                  <span>·</span>
                  <span>
                    Post-Market: {quote.currency === "USD" ? "$" : ""}
                    {quote.postMarketPrice.toFixed(2)}
                  </span>
                  <span>
                    {quote.postMarketChange &&
                    quote.postMarketChangePercent !== undefined ? (
                      quote.postMarketChange > 0 ? (
                        <span className="text-green-800 dark:text-green-400">
                          +{quote.postMarketChange.toFixed(2)} (+
                          {quote.postMarketChangePercent.toFixed(2)}%)
                        </span>
                      ) : (
                        <span className="text-red-800 dark:text-red-500">
                          {quote.postMarketChange.toFixed(2)} (
                          {quote.postMarketChangePercent.toFixed(2)}%)
                        </span>
                      )
                    ) : null}
                  </span>
                </>
              )}
              {quote.hasPrePostMarketData && quote.preMarketPrice && (
                <>
                  <span>·</span>
                  <span>
                    Pre-Market: {quote.currency === "USD" ? "$" : ""}
                    {quote.preMarketPrice.toFixed(2)}
                  </span>
                  <span>
                    {quote.preMarketChange &&
                    quote.preMarketChangePercent !== undefined ? (
                      quote.preMarketChange > 0 ? (
                        <span className="text-green-800 dark:text-green-400">
                          +{quote.preMarketChange.toFixed(2)} (+
                          {quote.preMarketChangePercent.toFixed(2)}%)
                        </span>
                      ) : (
                        <span className="text-red-800 dark:text-red-500">
                          {quote.preMarketChange.toFixed(2)} (
                          {quote.preMarketChangePercent.toFixed(2)}%)
                        </span>
                      )
                    ) : null}
                  </span>
                </>
              )}
            </span>
          </div>
          <span className="space-x-1 whitespace-nowrap font-semibold">
            {priceChange !== 0 && rangeTextMapping[range] !== "" && (
              <span
                className={cn(
                  priceChange > 0
                    ? "text-green-800 dark:text-green-400"
                    : "text-red-800 dark:text-red-500"
                )}
              >
                {priceChange > 0
                  ? `+${priceChange.toFixed(2)}%`
                  : `${priceChange.toFixed(2)}%`}
              </span>
            )}
            <span className="text-muted-foreground">
              {rangeTextMapping[range]}
            </span>
          </span>
        </div>
      </div>
      {chart.quotes.length === 0 && (
        <div className="flex h-full items-center justify-center text-center text-neutral-500">
          No data available
        </div>
      )}
      {chart.quotes.length > 0 && (
        <AreaClosedChart chartQuotes={ChartQuotes} range={range} />
      )}
    </div>
  )
}
