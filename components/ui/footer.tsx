"use client"

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="container py-6 md:px-8 md:py-0">
      <div className="flex flex-col items-end justify-between md:h-24 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by{" "}
          <Link
            prefetch={false}
            href="https://twitter.com/DariusLukasukas"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Darius Lukasukas
          </Link>
          . The source code is available on{" "}
          <Link
            prefetch={false}
            href="https://github.com/DariusLukasukas/stocks"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </Link>
          .
        </p>
      </div>
    </footer>
  )
}
