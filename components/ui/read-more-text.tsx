"use client"
import { useState } from "react"

export default function ReadMoreText({
  text,
  truncateLength,
}: {
  text: string
  truncateLength: number
}) {
  const [isReadMore, setIsReadMore] = useState(false)
  const truncateText = text.slice(0, truncateLength) + "..."

  return (
    <>
      <p>{isReadMore ? text : truncateText}</p>
      {text.length > truncateLength && (
        <button
          onClick={() => setIsReadMore(!isReadMore)}
          className="text-blue-600 dark:text-blue-500"
        >
          {isReadMore ? "Show less" : "Read more"}
        </button>
      )}
    </>
  )
}
