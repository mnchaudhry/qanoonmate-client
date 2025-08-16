"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, Clock, User, FileText, AlertTriangle, Database } from "lucide-react"

const activities = [
  {
    id: 1,
    text: "Lawyer Ahmed J. submitted legal guide on tenancy laws.",
    time: "2 minutes ago",
    type: "submission",
    icon: User
  },
  {
    id: 2,
    text: "New consultation scheduled by user #54211 with lawyer #290.",
    time: "15 minutes ago",
    type: "consultation",
    icon: Clock
  },
  {
    id: 3,
    text: "Draft law \"Public Interest Litigation\" updated.",
    time: "1 hour ago",
    type: "update",
    icon: FileText
  },
  {
    id: 4,
    text: "FAQ flagged for potential misinformation.",
    time: "2 hours ago",
    type: "flag",
    icon: AlertTriangle
  },
  {
    id: 5,
    text: "System Update: Dictionary index rebuilt.",
    time: "3 hours ago",
    type: "system",
    icon: Database
  }
]

const getActivityColor = (type: string) => {
  switch (type) {
    case "submission": return "bg-primary/10 text-primary"
    case "consultation": return "bg-emerald-50 text-emerald-700"
    case "update": return "bg-blue-50 text-blue-700"
    case "flag": return "bg-amber-50 text-amber-700"
    case "system": return "bg-purple-50 text-purple-700"
    default: return "bg-muted text-muted-foreground"
  }
}

export default function RecentActivityFeed() {
  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">
            Recent Activity
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5">
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 bg-surface rounded-lg hover:bg-surface/80 transition-colors">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getActivityColor(activity.type)}`}>
                <activity.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{activity.text}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
