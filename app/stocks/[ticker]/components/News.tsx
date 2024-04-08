import { fetchStockSearch } from "@/lib/yahoo-finance/fetchStockSearch"
import Link from "next/link"
import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
} from "date-fns"

function timeAgo(publishTime: string) {
  const publishDate = new Date(publishTime)
  const now = new Date()

  const diffInMinutes = differenceInMinutes(now, publishDate)
  const diffInHours = differenceInHours(now, publishDate)
  const diffInDays = differenceInDays(now, publishDate)

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`
  } else {
    return `${diffInDays} days ago`
  }
}

export default async function News({ ticker }: { ticker: string }) {
  const newsData = await fetchStockSearch(ticker)
  const url = `https://uk.finance.yahoo.com/quote/${ticker}`

  return (
    <div className="w-4/5">
      {newsData.news.length === 0 && (
        <div className="py-4 text-center text-sm font-medium text-muted-foreground">
          No Recent Stories
        </div>
      )}
      {newsData.news.length > 0 && (
        <>
          <Link
            href={url}
            prefetch={false}
            className="group flex w-fit flex-row items-center gap-2 pb-4 text-sm font-medium text-blue-500"
          >
            See More Data from Yahoo Finance
            <i>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 rotate-180 transition-transform group-hover:translate-x-1"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </i>
          </Link>
          <div className="flex flex-col gap-2">
            {newsData.news.map((article) => (
              <Link
                key={article.uuid}
                href={article.link}
                prefetch={false}
                className="flex flex-col gap-1"
              >
                <span className="text-sm font-medium text-muted-foreground">
                  {article.publisher} -{" "}
                  {timeAgo(article.providerPublishTime.toISOString())}
                </span>
                <span className="font-semibold">{article.title}</span>
                <span className="text-sm font-medium text-muted-foreground">
                  {article.published_at}
                </span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
