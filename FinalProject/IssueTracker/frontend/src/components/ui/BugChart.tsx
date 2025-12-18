"use client"

import { useEffect, useState } from "react"
import { RadialBarChart, RadialBar, LabelList } from "recharts"
import api from "@/lib/api" // adjust path to your axios instance
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Spinner } from "./spinner"

type Bug = {
  _id: string
  title: string
  lastUpdated: string
}

const chartConfig = {
  activity: {
    label: "Last Updated",
  },
} satisfies ChartConfig

function buildChartData(bugs: Bug[]) {
  if (!bugs.length) return []

  const newest = Math.max(
    ...bugs.map((b) => new Date(b.lastUpdated).getTime())
  )

  return bugs
    .map((bug, index) => {
      const updatedTime = new Date(bug.lastUpdated).getTime()

      return {
        bug: bug.title,
        activity: Math.round((updatedTime / newest) * 100),
        fill: `var(--chart-${(index % 5) + 1})`,
      }
    })
    .sort((a, b) => b.activity - a.activity)
}

export function ChartRadialLabel() {
  const [bugs, setBugs] = useState<Bug[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBugs() {
      try {
        const { data } = await api.get("/bugs")
        setBugs(data)
      } catch (err) {
        console.error("Failed to fetch bugs", err)
      } finally {
        setLoading(false)
      }
    }

    fetchBugs()
  }, [])

  const chartData = buildChartData(bugs)

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Recently Worked-On Bugs</CardTitle>
        <CardDescription>Based on lastUpdated</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        {loading ? (
          <div className="text-center text-muted-foreground">
            <Spinner/>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <RadialBarChart
              data={chartData}
              innerRadius={30}
              outerRadius={110}
              startAngle={-90}
              endAngle={380}
            >
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    nameKey="bug"
                    labelFormatter={(label) => `Bug: ${label}`}
                  />
                }
              />

              <RadialBar dataKey="activity" background>
                <LabelList
                  dataKey="bug"
                  position="insideStart"
                  className="fill-white text-xs mix-blend-luminosity"
                />
              </RadialBar>
            </RadialBarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
