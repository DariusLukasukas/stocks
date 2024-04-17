"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { Quote } from "@/node_modules/yahoo-finance2/dist/esm/src/modules/quote"
import { cn } from "@/lib/utils"
import Link from "next/link"

export const columns: ColumnDef<Quote>[] = [
  {
    accessorKey: "shortName",
    header: "Title",
    cell: (props) => {
      const { row } = props
      const title = row.getValue("shortName") as string
      const symbol = row.original.symbol

      return (
        <Link
          prefetch={false}
          href={{
            pathname: "/",
            query: { ticker: symbol },
          }}
          className="font-medium"
        >
          {title}
        </Link>
      )
    },
  },
  {
    accessorKey: "regularMarketPrice",
    header: () => <div className="text-right">Price</div>,
    cell: (props) => {
      const { row } = props
      const price = row.getValue("regularMarketPrice") as number
      return <div className="text-right">{price.toFixed(2)}</div>
    },
  },
  {
    accessorKey: "regularMarketChange",
    header: () => <div className="text-right">$ Change</div>,
    cell: (props) => {
      const { row } = props
      const change = row.getValue("regularMarketChange") as number
      return (
        <div
          className={cn(
            "text-right",
            change < 0 ? "text-red-500" : "text-green-500"
          )}
        >
          {change > 0 ? "+" : ""}
          {change.toFixed(2)}
        </div>
      )
    },
  },
  {
    accessorKey: "regularMarketChangePercent",
    header: () => <div className="text-right">% Change</div>,
    cell: (props) => {
      const { row } = props
      const changePercent = row.getValue("regularMarketChangePercent") as number
      return (
        <div className="flex justify-end">
          <div
            className={cn(
              "w-[4rem] min-w-fit rounded-md px-2 py-0.5 text-right",
              changePercent < 0
                ? "bg-red-300 text-red-800 dark:bg-red-950 dark:text-red-500"
                : "bg-green-300 text-green-800 dark:bg-green-950 dark:text-green-400"
            )}
          >
            {changePercent.toFixed(2)}%
          </div>
        </div>
      )
    },
  },
]
