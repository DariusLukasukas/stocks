import { cn } from "@/lib/utils"

async function fetchFearGreendIndex() {
  const url = "https://fear-and-greed-index.p.rapidapi.com/v1/fgi"
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "a6296db2bamshd608b485c322047p1b0b03jsn5e4c3b5d0c77",
      "X-RapidAPI-Host": "fear-and-greed-index.p.rapidapi.com",
    },
    next: {
      revalidate: 3600,
    },
  }
  const res = await fetch(url, options)

  if (!res.ok) {
    throw new Error("Failed to fetch fear and greed index")
  }
  return res.json()
}

export default async function FearGreedIndex() {
  const data = await fetchFearGreendIndex()

  return (
    <div>
      {/* FEAR AND GREED INDEX */}
      <div>
        The markets are{" "}
        <strong
          className={cn(
            data.fgi.now.value > 80
              ? "text-green-500"
              : data.fgi.now.value > 60
                ? "text-green-400"
                : data.fgi.now.value > 40
                  ? "text-gray-500"
                  : data.fgi.now.value > 20
                    ? "text-red-400"
                    : "text-red-500"
          )}
        >
          {data.fgi.now.value > 80
            ? "extremely bullish"
            : data.fgi.now.value > 60
              ? "bullish"
              : data.fgi.now.value > 40
                ? "neutral"
                : data.fgi.now.value > 20
                  ? "bearish"
                  : "extremely bearish"}
        </strong>
      </div>
    </div>
  )
}
