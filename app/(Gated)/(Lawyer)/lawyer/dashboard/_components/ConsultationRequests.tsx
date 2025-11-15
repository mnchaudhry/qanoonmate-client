"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/store/store"
import { getMyConsultations } from "@/store/reducers/consultationSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronRight, Clock, CheckCircle, AlertCircle, XCircle, Play, Check, Eye, Video } from "lucide-react"
import { ConsultationStatus } from "@/lib/enums"
import Link from "next/link"
import { IUser } from "@/store/types/user.types"
import { IConsultation } from "@/store/types/consultation.types"
import { formatConsultationDate } from "@/lib/utils"
import { useRouter } from "next/navigation"

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

const getClientName = (clientId: IUser | string): string => {
  if (typeof clientId === 'string') return 'Client'
  return `${clientId.firstname || ''} ${clientId.lastname || ''}`.trim() || 'Client'
}

const getClientAvatar = (clientId: IUser | string): string | undefined => {
  if (typeof clientId === 'string') return undefined
  return clientId.profilePicture
}

export default function ConsultationRequests() {

  ////////////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////////
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { consultations, loading: isLoading, error } = useAppSelector(state => state.consultation)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  ////////////////////////////////////////////////////// EFFECTS ////////////////////////////////////////////////////
  useEffect(() => {
    dispatch(getMyConsultations({ filters: { limit: 4 } }))
  }, [dispatch])

  ////////////////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////////
  const handleAction = async (e: React.MouseEvent, consultationId: string, action: string) => {
    e.preventDefault()
    e.stopPropagation()
    setActionLoading(consultationId)

    try {
      // Navigate to appropriate page based on action
      switch (action) {
        case 'start':
          router.push(`/lawyer/consultations/${consultationId}?action=start`)
          break
        case 'complete':
          router.push(`/lawyer/consultations/${consultationId}?action=complete`)
          break
        case 'confirm':
          router.push(`/lawyer/consultations/${consultationId}?action=confirm`)
          break
        case 'join':
          router.push(`/lawyer/consultations/${consultationId}/meeting`)
          break
        case 'view':
          router.push(`/lawyer/consultations/${consultationId}`)
          break
      }
    } catch (error) {
      console.error('Action error:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const getActionButtons = (consultation: IConsultation) => {
    const buttons = []

    switch (consultation.status) {
      case ConsultationStatus.PENDING:
        buttons.push(
          <Button
            key="confirm"
            size="sm"
            variant="default"
            className="h-8 px-3"
            onClick={(e) => handleAction(e, consultation._id, 'confirm')}
            disabled={actionLoading === consultation._id}
          >
            <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
            Confirm
          </Button>
        )
        break

      case ConsultationStatus.SCHEDULED:
        buttons.push(
          <Button
            key="start"
            size="sm"
            variant="default"
            className="h-8 px-3"
            onClick={(e) => handleAction(e, consultation._id, 'start')}
            disabled={actionLoading === consultation._id}
          >
            <Play className="h-3.5 w-3.5 mr-1.5" />
            Start
          </Button>
        )
        if (consultation.meetingLink) {
          buttons.push(
            <Button
              key="join"
              size="sm"
              variant="outline"
              className="h-8 px-3"
              onClick={(e) => handleAction(e, consultation._id, 'join')}
              disabled={actionLoading === consultation._id}
            >
              <Video className="h-3.5 w-3.5 mr-1.5" />
              Join
            </Button>
          )
        }
        break

      case ConsultationStatus.IN_PROGRESS:
        buttons.push(
          <Button
            key="complete"
            size="sm"
            variant="default"
            className="h-8 px-3 bg-emerald-600 hover:bg-emerald-700"
            onClick={(e) => handleAction(e, consultation._id, 'complete')}
            disabled={actionLoading === consultation._id}
          >
            <Check className="h-3.5 w-3.5 mr-1.5" />
            Complete
          </Button>
        )
        if (consultation.meetingLink) {
          buttons.push(
            <Button
              key="join"
              size="sm"
              variant="outline"
              className="h-8 px-3"
              onClick={(e) => handleAction(e, consultation._id, 'join')}
              disabled={actionLoading === consultation._id}
            >
              <Video className="h-3.5 w-3.5 mr-1.5" />
              Rejoin
            </Button>
          )
        }
        break

      case ConsultationStatus.COMPLETED:
      case ConsultationStatus.CANCELLED:
        buttons.push(
          <Button
            key="view"
            size="sm"
            variant="outline"
            className="h-8 px-3"
            onClick={(e) => handleAction(e, consultation._id, 'view')}
            disabled={actionLoading === consultation._id}
          >
            <Eye className="h-3.5 w-3.5 mr-1.5" />
            View
          </Button>
        )
        break
    }

    return buttons
  }

  ////////////////////////////////////////////////////// RENDER ////////////////////////////////////////////////////
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
            const actionButtons = getActionButtons(consultation)

            return (
              <div
                key={consultation._id}
                className="flex items-center justify-between p-4 bg-surface rounded-lg hover:bg-surface/80 transition-colors"
              >
                <Link
                  href={`/lawyer/consultations/${consultation._id}`}
                  className="flex items-center space-x-4 flex-1 min-w-0"
                >
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src={clientAvatar} alt={clientName} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {clientName.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">{clientName}</h4>
                    <p className="text-sm text-muted-foreground capitalize truncate">{consultation.type.replace('_', ' ')}</p>
                    <p className="text-xs text-muted-foreground">{formatConsultationDate(consultation.scheduledDate)}</p>
                  </div>
                </Link>

                <div className="flex items-center space-x-3 flex-shrink-0 ml-4">
                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge className={`${getStatusColor(consultation.status)} whitespace-nowrap`}>
                        {getStatusIcon(consultation.status)}
                        <span className="ml-1 capitalize">{consultation.status.replace('_', ' ')}</span>
                      </Badge>
                      <span className="text-sm font-medium text-foreground whitespace-nowrap">PKR {consultation.fee.toLocaleString()}</span>
                    </div>

                    {actionButtons.length > 0 && (
                      <div className="flex items-center gap-2">
                        {actionButtons}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

