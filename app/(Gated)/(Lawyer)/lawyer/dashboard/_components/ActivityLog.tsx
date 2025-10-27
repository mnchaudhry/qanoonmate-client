"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store/store"
import { getActivityLog } from "@/store/reducers/lawyerSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronRight, Clock, FileText, MessageSquare, User, Calendar as CalendarIcon, AlertCircle } from "lucide-react"
import { formatDistanceToNow, parseISO } from 'date-fns'
import Link from "next/link"
import { Activity } from "@/store/types/lawyer.types"

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

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "MessageSquare": return MessageSquare
    case "FileText": return FileText
    case "User": return User
    case "CalendarIcon": return CalendarIcon
    case "Clock": return Clock
    default: return Clock
  }
}

export default function ActivityLog() {
  const dispatch = useAppDispatch()
  const { activities, activitiesLoading, activitiesError } = useAppSelector(state => state.lawyer)

  useEffect(() => {
    dispatch(getActivityLog(10))
  }, [dispatch])

  if (activitiesLoading) {
    return (
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">Activity Log</CardTitle>
              <CardDescription className="text-muted-foreground">Recent activities in your practice</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5" disabled>
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="max-h-[29rem] overflow-y-auto">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start space-x-3 p-3 bg-surface rounded-lg">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (activitiesError) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Activity Log</CardTitle>
          <CardDescription className="text-muted-foreground">Recent activities in your practice</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Failed to load activity log</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => dispatch(getActivityLog(10))}
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!activities || activities.length === 0) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Activity Log</CardTitle>
          <CardDescription className="text-muted-foreground">Recent activities in your practice</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">No recent activities</p>
            <p className="text-xs text-muted-foreground mt-2">Your practice activities will appear here</p>
          </div>
        </CardContent>
      </Card>
    )
  }

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
      <CardContent className="max-h-[29rem] overflow-y-auto">
        <div className="space-y-4">
          {activities.map((activity: Activity, index: number) => {
            const IconComponent = getIcon(activity.icon)
            const activityContent = (
              <div className="flex items-start space-x-3 p-3 bg-surface rounded-lg hover:bg-surface/80 transition-colors">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <IconComponent className={`h-4 w-4 ${getIconColor(activity.status)}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-medium text-foreground text-sm">{activity.title}</h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(parseISO(activity.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                  <Badge variant="outline" className={`mt-2 ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </Badge>
                </div>
              </div>
            )

            if (activity.consultationId) {
              return (
                <Link key={index} href={`/lawyer/consultations/${activity.consultationId}`}>
                  {activityContent}
                </Link>
              )
            }

            return <div key={index}>{activityContent}</div>
          })}
        </div>
      </CardContent>
    </Card>
  )
}
