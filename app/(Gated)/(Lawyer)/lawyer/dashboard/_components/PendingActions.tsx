"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, Calendar, FileText, CheckCircle, ChevronRight } from "lucide-react"

const actions = [
  {
    id: 1,
    title: "Update Profile Verification",
    description: "Complete your bar council verification",
    priority: "high",
    icon: AlertCircle,
    dueDate: "Overdue"
  },
  {
    id: 2,
    title: "Set Availability Hours",
    description: "Configure your consultation schedule",
    priority: "medium",
    icon: Calendar,
    dueDate: "Due Today"
  },
  {
    id: 3,
    title: "Upload Legal Templates",
    description: "Add commonly used legal documents",
    priority: "low",
    icon: FileText,
    dueDate: "Due in 3 days"
  },
  {
    id: 4,
    title: "Complete Client Onboarding",
    description: "Finish setup for new client Ahmad Khan",
    priority: "medium",
    icon: CheckCircle,
    dueDate: "Due Tomorrow"
  }
]

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high": return "bg-red-50 text-red-700 border-red-200"
    case "medium": return "bg-amber-50 text-amber-700 border-amber-200"
    case "low": return "bg-emerald-50 text-emerald-700 border-emerald-200"
    default: return "bg-muted text-muted-foreground !border-border"
  }
}

const getIconColor = (priority: string) => {
  switch (priority) {
    case "high": return "text-red-600"
    case "medium": return "text-amber-600"
    case "low": return "text-emerald-600"
    default: return "text-muted-foreground"
  }
}

export default function PendingActions() {
  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">Pending Actions</CardTitle>
            <CardDescription className="text-muted-foreground">Tasks that need your attention</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5">
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {actions.map((action) => (
            <div key={action.id} className="flex items-start space-x-3 p-3 bg-surface rounded-lg hover:bg-surface/80 transition-colors cursor-pointer">
              <action.icon className={`h-5 w-5 mt-0.5 ${getIconColor(action.priority)}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-foreground text-sm truncate">{action.title}</h4>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{action.dueDate}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                <Badge variant="outline" className={`mt-2 ${getPriorityColor(action.priority)}`}>
                  {action.priority} priority
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
