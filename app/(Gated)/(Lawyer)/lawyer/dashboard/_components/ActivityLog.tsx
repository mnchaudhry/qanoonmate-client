"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight, Clock, FileText, MessageSquare, User, Calendar as CalendarIcon } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "consultation",
    title: "Consultation completed",
    description: "Property dispute consultation with Ahmad Khan",
    timestamp: "2 hours ago",
    icon: MessageSquare,
    status: "completed"
  },
  {
    id: 2,
    type: "document",
    title: "Document uploaded",
    description: "Contract review template added to library",
    timestamp: "4 hours ago",
    icon: FileText,
    status: "info"
  },
  {
    id: 3,
    type: "client",
    title: "New client registered",
    description: "Sarah Ahmed joined your client list",
    timestamp: "1 day ago",
    icon: User,
    status: "new"
  },
  {
    id: 4,
    type: "appointment",
    title: "Appointment scheduled",
    description: "Court hearing set for criminal case",
    timestamp: "2 days ago",
    icon: CalendarIcon,
    status: "scheduled"
  },
  {
    id: 5,
    type: "payment",
    title: "Payment received",
    description: "PKR 3,000 from consultation fee",
    timestamp: "3 days ago",
    icon: Clock,
    status: "payment"
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed": return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "info": return "bg-primary/10 text-primary border-primary/20"
    case "new": return "bg-purple-50 text-purple-700 border-purple-200"
    case "scheduled": return "bg-amber-50 text-amber-700 border-amber-200"
    case "payment": return "bg-green-50 text-green-700 border-green-200"
    default: return "bg-muted text-muted-foreground !border-border"
  }
}

const getIconColor = (status: string) => {
  switch (status) {
    case "completed": return "text-emerald-600"
    case "info": return "text-primary"
    case "new": return "text-purple-600"
    case "scheduled": return "text-amber-600"
    case "payment": return "text-green-600"
    default: return "text-muted-foreground"
  }
}

export default function ActivityLog() {
  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">Activity Log</CardTitle>
            <CardDescription className="text-muted-foreground">Recent activities in your practice</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5">
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="max-h-[29rem] overflow-y-auto " >
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 bg-surface rounded-lg hover:bg-surface/80 transition-colors">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <activity.icon className={`h-4 w-4 ${getIconColor(activity.status)}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-foreground text-sm">{activity.title}</h4>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{activity.timestamp}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                <Badge variant="outline" className={`mt-2 ${getStatusColor(activity.status)}`}>
                  {activity.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
