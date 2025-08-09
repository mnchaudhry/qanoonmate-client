"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, TrendingUp, Search, Eye, FileText } from "lucide-react"

const metrics = [
  {
    title: "Top Searched Terms",
    value: "2,200",
    icon: Search,
    color: "text-primary"
  },
  {
    title: "FAQ Views",
    value: "1,500",
    icon: Eye,
    color: "text-emerald-600"
  },
  {
    title: "Dictionary Lookups",
    value: "1,100",
    icon: FileText,
    color: "text-blue-600"
  },
  {
    title: "Draft Usage",
    value: "900",
    icon: TrendingUp,
    color: "text-purple-600"
  }
]

export default function UsageAnalytics() {
  return (
    <Card className="border-border mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            📈 Search & Usage Analytics
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5">
            View Details
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Mock Chart Area */}
        <div className="h-64 bg-surface rounded-lg border !border-border p-4 mb-4">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-2" />
              <p className="text-muted-foreground">Analytics Chart</p>
              <p className="text-sm text-muted-foreground">Line/Bar Graph showing usage trends</p>
            </div>
          </div>
        </div>
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-surface rounded-lg">
              <div className={`w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center`}>
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
              </div>
              <div>
                <h4 className="font-medium text-foreground text-sm">{metric.title}</h4>
                <p className="text-lg font-bold text-foreground">{metric.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
