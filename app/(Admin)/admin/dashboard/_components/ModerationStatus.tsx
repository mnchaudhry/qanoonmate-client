"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Ban, Flag, ChevronRight } from "lucide-react"

const moderationStats = [
  {
    title: "Unverified Lawyers",
    count: "19",
    status: "pending",
    description: "pending",
    icon: AlertTriangle,
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
    badgeColor: "bg-amber-100 text-amber-700"
  },
  {
    title: "Flagged Consultations",
    count: "6",
    status: "flagged",
    description: "cases",
    icon: Ban,
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    badgeColor: "bg-red-100 text-red-700"
  },
  {
    title: "Flagged Case Laws",
    count: "4",
    status: "flagged",
    description: "reports",
    icon: Flag,
    bgColor: "bg-orange-50",
    textColor: "text-orange-700",
    badgeColor: "bg-orange-100 text-orange-700"
  }
]

export default function ModerationStatus() {
  return (
    <Card className="border-border mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            🚩 Moderation Status
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5">
            View Queue
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {moderationStats.map((stat, index) => (
            <div key={index} className={`p-4 rounded-lg border border-border ${stat.bgColor} hover:shadow-md transition-shadow cursor-pointer`}>
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                <Badge className={stat.badgeColor}>
                  {stat.status}
                </Badge>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${stat.textColor}`}>
                  {stat.count}
                </div>
                <h4 className="font-medium text-foreground mt-1">{stat.title}</h4>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
