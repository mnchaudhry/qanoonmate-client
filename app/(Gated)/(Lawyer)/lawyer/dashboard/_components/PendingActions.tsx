"use client"

import { useAppSelector } from "@/store/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, Calendar, FileText, CheckCircle, ChevronRight } from "lucide-react"
import Link from "next/link"

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
  const { dashboardStats } = useAppSelector(state => state.lawyer)

  // Create dynamic pending actions based on dashboard stats
  const actions = []

  // Add pending consultation requests action if there are any
  if (dashboardStats && dashboardStats.pendingRequests > 0) {
    actions.push({
      id: 1,
      title: "Review Consultation Requests",
      description: `${dashboardStats.pendingRequests} pending consultation${dashboardStats.pendingRequests !== 1 ? 's' : ''} need${dashboardStats.pendingRequests === 1 ? 's' : ''} your attention`,
      priority: dashboardStats.pendingRequests > 5 ? "high" : "medium",
      icon: AlertCircle,
      dueDate: dashboardStats.newRequestsToday > 0 ? "New Today" : "Pending",
      link: "/lawyer/consultations?status=pending"
    })
  }

  // Add calendar setup reminder if no pending actions
  if (actions.length === 0) {
    actions.push({
      id: 2,
      title: "Set Availability Hours",
      description: "Configure your consultation schedule for better client bookings",
      priority: "medium",
      icon: Calendar,
      dueDate: "Recommended",
      link: "/lawyer/settings/availability"
    })
  }

  // Add template upload reminder
  actions.push({
    id: 3,
    title: "Upload Legal Templates",
    description: "Add commonly used legal documents to streamline your workflow",
    priority: "low",
    icon: FileText,
    dueDate: "Optional",
    link: "/lawyer/uploads"
  })

  // Add profile completion reminder if needed
  if (dashboardStats && dashboardStats.totalClients === 0) {
    actions.push({
      id: 4,
      title: "Complete Your Profile",
      description: "A complete profile helps attract more clients",
      priority: "high",
      icon: CheckCircle,
      dueDate: "Important",
      link: "/lawyer/settings/profile"
    })
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">Pending Actions</CardTitle>
            <CardDescription className="text-muted-foreground">Tasks that need your attention</CardDescription>
          </div>
          <Link href="/lawyer/consultations?status=pending">
            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5">
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {actions.map((action) => (
            <Link key={action.id} href={action.link} className="block">
              <div className="flex items-start space-x-3 p-3 bg-surface rounded-lg hover:bg-surface/80 transition-colors cursor-pointer">
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
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

