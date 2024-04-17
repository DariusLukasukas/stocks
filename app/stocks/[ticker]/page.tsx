import StockChart from "@/components/chart/StockChart"
import CompanySummaryCard from "@/app/stocks/[ticker]/components/CompanySummaryCard"
import FinanceSummary from "@/app/stocks/[ticker]/components/FinanceSummary"
import News from "@/app/stocks/[ticker]/components/News"
import { Card, CardContent } from "@/components/ui/card"
import { DEFAULT_INTERVAL, DEFAULT_RANGE } from "@/lib/yahoo-finance/constants"
import {
  validateInterval,
  validateRange,
} from "@/lib/yahoo-finance/fetchChartData"
import { Interval } from "@/types/yahoo-finance"
import { Suspense } from "react"
import type { Metadata } from "next"
import { fetchQuote } from "@/lib/yahoo-finance/fetchQuote"

type Props = {
  params: {
    ticker: string
  }
  searchParams?: {
    ticker?: string
    range?: string
    interval?: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ticker = params.ticker

  const quoteData = await fetchQuote(ticker)
  const regularMarketPrice = quoteData.regularMarketPrice?.toLocaleString(
    "en-US",
    {
      style: "currency",
      currency: "USD",
    }
  )

  return {
    title: `${ticker} ${regularMarketPrice}`,
    description: `Stocks page for ${ticker}`,
    keywords: [ticker, "stocks"],
  }
}

export default async function StocksPage({ params, searchParams }: Props) {
  const ticker = params.ticker
  const range = validateRange(searchParams?.range || DEFAULT_RANGE)
  const interval = validateInterval(
    range,
    (searchParams?.interval as Interval) || DEFAULT_INTERVAL
  )

  return (
    <div>
      <Card>
        <CardContent className="space-y-10 pt-6 lg:px-40 lg:py-14">
          <Suspense
            fallback={
              <div className="flex h-[27.5rem] items-center justify-center text-muted-foreground ">
                Loading...
              </div>
            }
          >
            <StockChart ticker={ticker} range={range} interval={interval} />
          </Suspense>
          <Suspense
            fallback={
              <div className="flex h-[10rem] items-center justify-center text-muted-foreground ">
                Loading...
              </div>
            }
          >
            <FinanceSummary ticker={ticker} />
          </Suspense>
          <Suspense
            fallback={
              <div className="flex h-[10rem] items-center justify-center text-muted-foreground ">
                Loading...
              </div>
            }
          >
            <CompanySummaryCard ticker={ticker} />
          </Suspense>
          <Suspense
            fallback={
              <div className="flex h-[20rem] items-center justify-center text-muted-foreground ">
                Loading...
              </div>
            }
          >
            <News ticker={ticker} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
