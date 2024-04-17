"use client"

import { useEffect, useState } from "react"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Button } from "./button"
import tickers from "@/data/tickers.json"
import { useRouter } from "next/navigation"

const SUGGESTIONS = [
  { ticker: "TSLA", title: "Tesla Inc." },
  { ticker: "NVDA", title: "NVIDIA Corporation" },
  { ticker: "AAPL", title: "Apple Inc." },
  { ticker: "MSFT", title: "Microsoft Corporation" },
  { ticker: "GOOGL", title: "Alphabet Inc." },
  { ticker: "AMZN", title: "Amazon.com Inc." },
]

export default function CommandMenu() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <div>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        size={"sm"}
        className="group"
      >
        <p className="flex gap-10 text-sm text-muted-foreground group-hover:text-foreground">
          Search...
          <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 group-hover:text-foreground sm:inline-flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </p>
      </Button>
      <Command>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput
            placeholder="Search by symbols or companies..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              {search.length === 0 &&
                SUGGESTIONS.map((suggestion) => (
                  <CommandItem
                    key={suggestion.ticker}
                    value={suggestion.ticker + "\n \n" + suggestion.title}
                    onSelect={() => {
                      setOpen(false)
                      setSearch("")
                      router.push(`/stocks/${suggestion.ticker}`)
                    }}
                  >
                    <p className="mr-2 font-semibold">{suggestion.ticker}</p>
                    <p className="text-sm text-muted-foreground">
                      {suggestion.title}
                    </p>
                  </CommandItem>
                ))}

              {search.length > 0 &&
                tickers
                  .filter(
                    (ticker) =>
                      ticker.ticker
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                      ticker.title.toLowerCase().includes(search.toLowerCase())
                  )
                  .slice(0, 10)
                  .map((ticker) => (
                    <CommandItem
                      key={ticker.id}
                      value={ticker.ticker + "\n \n" + ticker.title}
                      onSelect={() => {
                        setOpen(false)
                        setSearch("")
                        router.push(`/stocks/${ticker.ticker}`)
                      }}
                    >
                      <p className="mr-2 font-semibold">{ticker.ticker}</p>
                      <p className="text-sm text-muted-foreground">
                        {ticker.title}
                      </p>
                    </CommandItem>
                  ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </Command>
    </div>
  )
}
