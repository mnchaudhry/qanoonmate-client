"use client"

import { useEffect, useMemo } from "react"
import { useAppDispatch, useAppSelector } from "@/store/store"
import { getMyConsultations } from "@/store/reducers/consultationSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Clock, ChevronRight, AlertCircle } from "lucide-react"
import { format, isAfter, parseISO, startOfDay } from 'date-fns'
import Link from "next/link"
import { IUser } from "@/store/types/user.types"
import { ConsultationStatus } from "@/lib/enums"
import { IConsultation } from "@/store/types/consultation.types"


const getStatusColor = (status: ConsultationStatus) => {
  switch (status) {
    case ConsultationStatus.SCHEDULED: return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case ConsultationStatus.CONFIRMED: return "bg-primary/10 text-primary border-primary/20"
    case ConsultationStatus.PENDING: return "bg-amber-50 text-amber-700 border-amber-200"
    default: return "bg-muted text-muted-foreground !border-border"
  }
}

const getClientName = (clientId: IUser | string): string => {
  if (typeof clientId === 'string') return 'Client'
  return `${clientId.firstname || ''} ${clientId.lastname || ''}`.trim() || 'Client'
}

export default function CalendarSchedule() {
  const dispatch = useAppDispatch()
  const { consultations, loading: isLoading, error } = useAppSelector(state => state.consultation)

  useEffect(() => {
    dispatch(getMyConsultations({ filters: { limit: 10 } }))
  }, [dispatch])

  // Filter and sort upcoming events
  const upcomingEvents = useMemo(() => {
    if (!consultations) return []
    const now = startOfDay(new Date())

    return consultations
      .filter((c: IConsultation) => {
        const consultationDate = parseISO(c.scheduledDate.toDateString())
        return isAfter(consultationDate, now) &&
          [ConsultationStatus.SCHEDULED, ConsultationStatus.PENDING, ConsultationStatus.CONFIRMED].includes(c.status)
      })
      .sort((a: IConsultation, b: IConsultation) =>
        new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
      )
      .slice(0, 5)
  }, [consultations])

  if (isLoading) {
    return (
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">Calendar & Schedule</CardTitle>
              <CardDescription className="text-muted-foreground">Your upcoming appointments</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5" disabled>
              View Calendar
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="max-h-[29rem] overflow-y-auto">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-surface rounded-lg">
                <div className="flex items-center space-x-4">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Calendar & Schedule</CardTitle>
          <CardDescription className="text-muted-foreground">Your upcoming appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Failed to load schedule</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => dispatch(getMyConsultations({ filters: { limit: 10 } }))}
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card >
    )
  }

  if (upcomingEvents.length === 0) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Calendar & Schedule</CardTitle>
          <CardDescription className="text-muted-foreground">Your upcoming appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">No upcoming appointments</p>
            <p className="text-xs text-muted-foreground mt-2">Your scheduled consultations will appear here</p>
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
            <CardTitle className="text-lg font-semibold text-foreground">Calendar & Schedule</CardTitle>
            <CardDescription className="text-muted-foreground">Your upcoming appointments</CardDescription>
          </div>
          <Link href="/lawyer/calendar">
            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5">
              View Calendar
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="max-h-[29rem] overflow-y-auto">
        <div className="space-y-4">
          {upcomingEvents.map((event: IConsultation) => {
            const clientName = getClientName(event.client)
            const consultationDate = parseISO(event.scheduledDate.toDateString())

            return (
              <Link
                key={event._id}
                href={`/lawyer/consultations/${event._id}`}
                className="block"
              >
                <div className="flex items-center justify-between p-4 bg-surface rounded-lg hover:bg-surface/80 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <h4 className="font-medium text-foreground capitalize">
                      {event.type.replace('_', ' ')} - {clientName}
                    </h4>
                    <p className="text-sm text-muted-foreground">{clientName}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {format(consultationDate, 'h:mm a')} ({event.duration} min)
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {format(consultationDate, 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                  <Badge className={getStatusColor(event.status)}>
                    {event.status.replace('_', ' ')}
                  </Badge>
                </div>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

