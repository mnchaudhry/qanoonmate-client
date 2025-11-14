"use client"

import React, { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Video, Clock, X } from 'lucide-react'
import { format } from 'date-fns'
import { getConsultations } from '@/store/reducers/consultationSlice'
import { ConsultationStatus } from '@/lib/enums'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { RootState } from '@/store/store'

const UpcomingConsultations = () => {

  /////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>();
  const { consultations, loading: isLoading, error } = useSelector((state: RootState) => state.consultation)

  /////////////////////////////////////////////// USE EFFECTS ////////////////////////////////////////////
  useEffect(() => {
    const today = new Date()
    dispatch(getConsultations({
      status: ConsultationStatus.SCHEDULED,
      dateFrom: today.toISOString(),
      limit: 5,
      page: 1
    }))
  }, [dispatch])

  /////////////////////////////////////////////// RETURN ///////////////////////////////////////////////
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Upcoming Consultations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[30rem] overflow-y-auto">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">{error}</div>
        ) : consultations.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No upcoming consultations</p>
          </div>
        ) : (
          consultations.map((consultation) => (
            <div
              key={consultation._id}
              className="p-4 border !border-border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">
                    {format(new Date(consultation.scheduledDate), 'MMM dd, h:mm a')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {/* Show lawyer or client name depending on user role */}
                    {typeof consultation?.lawyer === 'object' && 'firstname' in consultation?.lawyer
                      ? `${consultation?.lawyer.firstname} ${consultation?.lawyer.lastname}`
                      : ''}
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {consultation.status}
                </Badge>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" className="text-xs bg-primary hover:bg-primary/90">
                  <Video className="h-3 w-3 mr-1" />
                  Join
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  Reschedule
                </Button>
                <Button size="sm" variant="outline" className="text-xs text-destructive hover:text-destructive">
                  <X className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

export default UpcomingConsultations
