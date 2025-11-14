"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store/store"
import { getMyConsultations } from "@/store/reducers/consultationSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronRight, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react"
import { ConsultationStatus } from "@/lib/enums"
import { format, isToday, isTomorrow, isYesterday, parseISO } from 'date-fns'
import Link from "next/link"
import { IUser } from "@/store/types/user.types"
import { IConsultation } from "@/store/types/consultation.types"

const getStatusColor = (status: ConsultationStatus) => {
  switch (status) {
    case ConsultationStatus.SCHEDULED: return "bg-primary/10 text-primary border-primary/20"
    case ConsultationStatus.COMPLETED: return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case ConsultationStatus.PENDING: return "bg-amber-50 text-amber-700 border-amber-200"
    case ConsultationStatus.IN_PROGRESS: return "bg-purple-50 text-purple-700 border-purple-200"
    case ConsultationStatus.CANCELLED: return "bg-red-50 text-red-700 border-red-200"
    default: return "bg-muted text-muted-foreground !border-border"
  }
}

const getStatusIcon = (status: ConsultationStatus) => {
  switch (status) {
    case ConsultationStatus.SCHEDULED: return <Clock className="h-4 w-4" />
    case ConsultationStatus.COMPLETED: return <CheckCircle className="h-4 w-4" />
    case ConsultationStatus.PENDING: return <AlertCircle className="h-4 w-4" />
    case ConsultationStatus.IN_PROGRESS: return <XCircle className="h-4 w-4" />
    case ConsultationStatus.CANCELLED: return <XCircle className="h-4 w-4" />
    default: return null
  }
}

const formatDate = (dateString: string) => {
  const date = parseISO(dateString)
  if (isToday(date)) {
    return `Today ${format(date, 'h:mm a')}`
  } else if (isTomorrow(date)) {
    return `Tomorrow ${format(date, 'h:mm a')}`
  } else if (isYesterday(date)) {
    return `Yesterday ${format(date, 'h:mm a')}`
  }
  return format(date, 'MMM dd, yyyy h:mm a')
}

const getClientName = (clientId: IUser | string): string => {
  if (typeof clientId === 'string') return 'Client'
  return `${clientId.firstname || ''} ${clientId.lastname || ''}`.trim() || 'Client'
}

const getClientAvatar = (clientId: IUser | string): string | undefined => {
  if (typeof clientId === 'string') return undefined
  return clientId.profilePicture
}

export default function ConsultationRequests() {
  const dispatch = useAppDispatch()
  const { consultations, loading: isLoading, error } = useAppSelector(state => state.consultation)

  useEffect(() => {
    dispatch(getMyConsultations({ filters: { limit: 4 } }))
  }, [dispatch])

  if (isLoading) {
    return (
      <Card className="border-border h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">Recent Consultations</CardTitle>
              <CardDescription className="text-muted-foreground">Your latest client interactions</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5" disabled>
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-surface rounded-lg">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-border h-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Recent Consultations</CardTitle>
          <CardDescription className="text-muted-foreground">Your latest client interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Failed to load consultations</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => dispatch(getMyConsultations({ filters: { limit: 4 } }))}
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!consultations || consultations.length === 0) {
    return (
      <Card className="border-border h-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Recent Consultations</CardTitle>
          <CardDescription className="text-muted-foreground">Your latest client interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">No consultations yet</p>
            <p className="text-xs text-muted-foreground mt-2">Your recent consultations will appear here</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">Recent Consultations</CardTitle>
            <CardDescription className="text-muted-foreground">Your latest client interactions</CardDescription>
          </div>
          <Link href="/lawyer/consultations">
            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5">
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {consultations.slice(0, 4).map((consultation: IConsultation) => {
            const clientName = getClientName(consultation?.client)
            const clientAvatar = getClientAvatar(consultation?.client)

            return (
              <Link
                key={consultation._id}
                href={`/lawyer/consultations/${consultation._id}`}
                className="block"
              >
                <div className="flex items-center justify-between p-4 bg-surface rounded-lg hover:bg-surface/80 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={clientAvatar} alt={clientName} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {clientName.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-foreground">{clientName}</h4>
                      <p className="text-sm text-muted-foreground capitalize">{consultation.type.replace('_', ' ')}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(consultation.scheduledDate?.toDateString())}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(consultation.status)}>
                      {getStatusIcon(consultation.status)}
                      <span className="ml-1 capitalize">{consultation.status.replace('_', ' ')}</span>
                    </Badge>
                    <span className="text-sm font-medium text-foreground">PKR {consultation.fee.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

