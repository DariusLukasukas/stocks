import { unstable_noStore as noStore } from "next/cache"
import type {
  ChartOptions,
  ChartResultArray,
} from "@/node_modules/yahoo-finance2/dist/esm/src/modules/chart"
import type { Interval, Range } from "@/types/yahoo-finance"
import { DEFAULT_RANGE, INTERVALS_FOR_RANGE, VALID_RANGES } from "./constants"
import { CalculateRange } from "@/lib/utils"
import yahooFinance from "yahoo-finance2"

export const validateRange = (range: string): Range =>
  VALID_RANGES.includes(range as Range) ? (range as Range) : DEFAULT_RANGE

export const validateInterval = (range: Range, interval: Interval): Interval =>
  INTERVALS_FOR_RANGE[range].includes(interval)
    ? interval
    : INTERVALS_FOR_RANGE[range][0]

export async function fetchChartData(
  ticker: string,
  range: Range,
  interval: Interval
) {
  noStore()

  const queryOptions: ChartOptions = {
    period1: CalculateRange(range),
    interval: interval,
  }

  try {
    const chartData: ChartResultArray = await yahooFinance.chart(
      ticker,
      queryOptions
    )

    return chartData
  } catch (error) {
    console.log("Failed to fetch chart data", error)
    throw new Error("Failed to fetch chart data.")
  }
}
