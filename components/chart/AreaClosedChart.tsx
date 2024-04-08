// @ts-nocheck
"use client"
import { memo, useCallback, useMemo, useReducer } from "react"
import { scalePoint } from "d3-scale"
import { bisectRight } from "d3-array"

import { localPoint } from "@visx/event"
import { LinearGradient } from "@visx/gradient"
import { AreaClosed, LinePath } from "@visx/shape"
import { scaleLinear } from "@visx/scale"
import { ParentSize } from "@visx/responsive"
import { Button } from "../ui/button"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { DEFAULT_RANGE } from "@/lib/yahoo-finance/constants"
import { Range } from "@/lib/yahoo-finance/types"

// UTILS
const toDate = (d: any) => +new Date(d?.date || d)

const formatCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
}).format

const MemoAreaClosed = memo(AreaClosed)
const MemoLinePath = memo(LinePath)

function reducer(state: any, action: any) {
  const initialState = {
    close: state.close,
    date: state.date,
    translate: "0%",
    hovered: false,
  }

  switch (action.type) {
    case "UPDATE": {
      return {
        close: action.close,
        date: action.date,
        x: action.x,
        y: action.y,
        translate: `-${(1 - action.x / action.width) * 100}%`,
        hovered: true,
      }
    }
    case "CLEAR": {
      return {
        ...initialState,
        x: undefined,
        y: undefined,
      }
    }
    default:
      return state
  }
}

interface InteractionsProps {
  width: number
  height: number
  xScale: any
  data: any[]
  dispatch: any
}

function Interactions({
  width,
  height,
  xScale,
  data,
  dispatch,
}: InteractionsProps) {
  const handleMove = useCallback(
    (event: React.PointerEvent<SVGRectElement>) => {
      const point = localPoint(event)
      if (!point) return

      const pointer = {
        x: Math.max(0, Math.floor(point.x)),
        y: Math.max(0, Math.floor(point.y)),
      }

      const x0 = pointer.x
      const dates = data.map((d: any) => xScale(toDate(d)))
      const index = bisectRight(dates, x0)

      const d0 = data[index - 1]
      const d1 = data[index]

      let d = d0
      if (d1 && toDate(d1)) {
        const diff0 = x0.valueOf() - toDate(d0).valueOf()
        const diff1 = toDate(d1).valueOf() - x0.valueOf()
        d = diff0 > diff1 ? d1 : d0
      }
      dispatch({ type: "UPDATE", ...d, ...pointer, width })
    },
    [xScale, data, dispatch, width]
  )

  const handleLeave = useCallback(() => dispatch({ type: "CLEAR" }), [dispatch])

  return (
    <rect
      width={width}
      height={height}
      rx={12}
      ry={12}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      fill={"transparent"}
    />
  )
}

interface AreaProps {
  mask: string
  id: string
  data: any[]
  x: any
  y: any
  yScale: any
  color: string
}

function Area({ mask, id, data, x, y, yScale, color }: AreaProps) {
  return (
    <g strokeLinecap="round" className="stroke-1">
      <LinearGradient
        id={id}
        from={color}
        fromOpacity={0.6}
        to={color}
        toOpacity={0}
      />
      <MemoAreaClosed
        data={data}
        x={x}
        y={y}
        yScale={yScale}
        stroke="transparent"
        fill={`url(#${id})`}
        mask={mask}
      />
      <MemoLinePath data={data} x={x} y={y} stroke={color} mask={mask} />
    </g>
  )
}

function GraphSlider({ data, width, height, top, state, dispatch }: any) {
  const xScale = useMemo(
    () => scalePoint().domain(data.map(toDate)).range([0, width]),
    [width, data]
  )

  const yScale = useMemo(
    () =>
      scaleLinear({
        range: [height, 0],
        domain: [
          Math.min(...data.map((d: any) => d.close)),
          Math.max(...data.map((d: any) => d.close)),
        ],
      }),
    [height, data]
  )

  const x = useCallback((d: any) => xScale(toDate(d)), [xScale])
  const y = useCallback((d: any) => yScale(d.close), [yScale])

  const pixelTranslate = (parseFloat(state.translate) / 100) * width
  const style = {
    transform: `translateX(${pixelTranslate}px)`,
  }

  const isIncreasing = data[data.length - 1].close > data[0].close

  return (
    <svg height={height} width="100%" viewBox={`0 0 ${width} ${height}`}>
      <mask id="mask" className="w-full">
        <rect x={0} y={0} width={width} height="100%" fill="#000" />
        <rect
          id="boundary"
          x={0}
          y={0}
          width={width}
          height="100%"
          fill="#fff"
          style={style}
        />
      </mask>
      <Area
        id="background"
        data={data}
        x={x}
        y={y}
        top={top}
        yScale={yScale}
        color={state.hovered ? "dodgerblue" : isIncreasing ? "green" : "red"}
      />
      <Area
        id="top"
        data={data}
        x={x}
        y={y}
        yScale={yScale}
        top={top}
        color={state.hovered ? "dodgerblue" : isIncreasing ? "green" : "red"}
        mask="url(#mask)"
      />
      {state.x && (
        <g className="marker">
          <line
            x1={state.x}
            x2={state.x}
            y1={0}
            y2={680}
            stroke={
              state.hovered ? "dodgerblue" : isIncreasing ? "green" : "red"
            }
            strokeWidth={2}
          />
          <circle
            cx={state.x}
            cy={yScale(state.close)}
            r={8}
            fill={state.hovered ? "dodgerblue" : isIncreasing ? "green" : "red"}
            stroke="#FFF"
            strokeWidth={3}
          />
          <text
            textAnchor={state.x + 8 > width / 2 ? "end" : "start"}
            x={state.x + 8 > width / 2 ? state.x - 8 : state.x + 6}
            y={0}
            dy={"0.75em"}
            fill={state.hovered ? "dodgerblue" : isIncreasing ? "green" : "red"}
            className="text-base font-medium"
          >
            {formatCurrency(state.close)}
          </text>
        </g>
      )}
      <Interactions
        width={width}
        height={height}
        data={data}
        xScale={xScale}
        dispatch={dispatch}
      />
    </svg>
  )
}

export default function AreaClosedChart({ chartQuotes, range }: any) {
  const searchParams = useSearchParams()
  const { replace } = useRouter()
  const pathname = usePathname()

  const last = chartQuotes[chartQuotes.length - 1]

  const initialState = {
    close: last.close,
    date: last.date,
    translate: "0%",
    hovered: false,
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  // TIME
  const myDate = new Date(state.date)
  const formattedDate = myDate.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  const formattedTime = myDate
    .toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(":", ".")

  // RANGE
  const createPageURL = useCallback(
    (range: string) => {
      const params = new URLSearchParams(searchParams)

      if (range) {
        params.set("range", range)
      } else {
        params.delete("range")
      }
      return `${pathname}?${params.toString().toLowerCase()}`
    },
    [searchParams, pathname]
  )

  const rangeOptions: Range[] = ["1d", "1w", "1m", "3m", "1y"]

  const isValidRange = (r: string): r is Range =>
    rangeOptions.includes(r as Range)

  if (!isValidRange(range)) {
    replace(createPageURL(DEFAULT_RANGE))
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const range = e.currentTarget.textContent
    if (range) {
      replace(createPageURL(range))
    }
  }

  return (
    <div className="w-full min-w-fit">
      <div
        suppressHydrationWarning
        className={
          state.hovered
            ? "flex items-center justify-center font-medium"
            : "invisible"
        }
      >
        {formattedDate}{" "}
        {range !== "3m" && range !== "1y" && "at " + formattedTime}
      </div>
      <div className="h-80">
        {chartQuotes.length > 0 ? (
          <ParentSize>
            {({ width, height }) => (
              <GraphSlider
                data={chartQuotes}
                width={width}
                height={height}
                top={0}
                state={state}
                dispatch={dispatch}
              />
            )}
          </ParentSize>
        ) : (
          <div className="flex h-80 w-full items-center justify-center">
            <p>No data available</p>
          </div>
        )}
      </div>
      <div className="mt-1 flex flex-row">
        {rangeOptions.map((r) => (
          <Button
            key={r}
            variant={"ghost"}
            onClick={handleClick}
            className={
              range === r
                ? "bg-accent font-bold text-accent-foreground"
                : "text-muted-foreground"
            }
          >
            {r.toUpperCase()}
          </Button>
        ))}
      </div>
    </div>
  )
}
