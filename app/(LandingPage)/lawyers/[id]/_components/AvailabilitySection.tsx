"use client"

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, X } from 'lucide-react'
import { Availability } from '@/store/types/lawyerSettings.types'

export default function AvailabilitySection({ availability }: { availability: Availability[] | null }) {
  return (
    <Card className="border border-border p-4">
      <div className="text-xl font-semibold text-foreground flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5" />
        Weekly Availability
      </div>
      <div className="space-y-4">
        {(!availability || availability.length === 0) && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <X className="w-4 h-4" />
            <span className="text-sm">No availability published</span>
          </div>
        )}
        {availability?.map((day) => (
          <div key={day.day} className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
            <div className="w-24 text-sm font-medium text-foreground capitalize">{day.day.toLowerCase()}</div>
            <div className="flex-1 flex flex-wrap gap-2">
              {day.timeSlots?.length ? (
                day.timeSlots.map((slot, idx) => (
                  <Badge key={idx} className="bg-primary/10 text-primary border-primary/20">
                    <Clock className="w-3 h-3 mr-1" />
                    {String(slot)}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">Not available</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}


