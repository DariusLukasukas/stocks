import { fetchQuoteSummary } from "@/lib/yahoo-finance/fetchQuoteSummary"

function formatNumber(num: number) {
  if (num >= 1e12) {
    return `${(num / 1e12).toFixed(2)}T`
  } else if (num >= 1e9) {
    return `${(num / 1e9).toFixed(2)}B`
  } else if (num >= 1e6) {
    return `${(num / 1e6).toFixed(2)}M`
  } else {
    return num.toString()
  }
}
const keysToDisplay = [
  {
    key: "open",
    title: "Open",
  },
  { key: "dayHigh", title: "High" },
  { key: "dayLow", title: "Low" },
  { key: "volume", title: "Vol", format: formatNumber },
  { key: "trailingPE", title: "P/E" },
  { key: "marketCap", title: "Mkt cap", format: formatNumber },
  { key: "fiftyTwoWeekHigh", title: "52W H" },
  { key: "fiftyTwoWeekLow", title: "52W L" },
  { key: "averageVolume", title: "Avg Vol", format: formatNumber },
  {
    key: "dividendYield",
    title: "Div yield",
    format: (data: number) => `${(data * 100).toFixed(2)}%`,
  },
  { key: "beta", title: "Beta" },
  { key: "trailingEps", title: "EPS", section: "defaultKeyStatistics" },
]

export default async function FinanceSummary({ ticker }: { ticker: string }) {
  const financeSummaryData = await fetchQuoteSummary(ticker)

  return (
    <div className="grid grid-flow-col grid-rows-6 gap-4 md:grid-rows-3">
      {keysToDisplay.map((item) => {
        const section = item.section || "summaryDetail"
        const data = financeSummaryData?.[section]?.[item.key] ?? undefined
        let formattedData = "N/A"

        if (data !== undefined && !isNaN(data)) {
          formattedData = item.format ? item.format(data) : data
        }
        return (
          <div
            key={item.key}
            className="flex flex-row items-center justify-between font-medium"
          >
            <span className="text-muted-foreground">{item.title}</span>
            <span>{formattedData}</span>
          </div>
        )
      })}
    </div>
  )
}
