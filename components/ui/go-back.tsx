"use client"

import { useRouter } from "next/navigation"
import { Button } from "./button"

export default function GoBack() {
  const router = useRouter()

  return (
    <Button
      aria-label="Go Back"
      variant={"custom"}
      onClick={() => router.back()}
      className="group flex w-fit flex-row items-center gap-2 px-0 font-medium text-blue-500"
    >
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
          className="h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="10 18 4 12 10 6" />
        </svg>
      </i>
      Back
    </Button>
  )
}
