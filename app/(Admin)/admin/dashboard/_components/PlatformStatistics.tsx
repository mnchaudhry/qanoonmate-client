"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

const statsData = [
  {
    title: "Total Users",
    value: "13,292",
    icon: "👥",
    trend: "+12% from last month"
  },
  {
    title: "Verified Users",
    value: "11,480",
    icon: "⚖️",
    trend: "+8% from last month"
  },
  {
    title: "Lawyers",
    value: "742",
    icon: "🕵️",
    trend: "+15% from last month"
  },
  {
    title: "Consultations",
    value: "3,023",
    icon: "📝",
    trend: "+23% from last month"
  },
  {
    title: "Legal Acts",
    value: "627",
    icon: "📚",
    trend: "+5% from last month"
  },
  {
    title: "Case Laws",
    value: "1,031",
    icon: "⚖️",
    trend: "+18% from last month"
  }
]

export default function PlatformStatistics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {statsData.map((stat, index) => (
        <Card key={index} className="border-border hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <span className="text-2xl">{stat.icon}</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-primary mr-1" />
              <span className="text-xs text-primary">{stat.trend}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
