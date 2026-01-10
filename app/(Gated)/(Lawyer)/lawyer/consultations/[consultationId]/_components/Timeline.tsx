"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IConsultation } from "@/store/types/consultation.types";
import { Calendar, CheckCircle, Clock, XCircle, AlertCircle, FileText } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

interface TimelineProps {
  consultation: IConsultation;
}

interface TimelineEvent {
  id: string;
  icon: any;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  timestamp: Date | any;
  type: string;
  status?: string;
}

export default function Timeline({ consultation }: TimelineProps) {
  const events: TimelineEvent[] = [];

  // Created event (always first)
  events.push({
    id: 'created',
    icon: Calendar,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-50',
    title: 'Consultation Requested',
    description: 'Client submitted consultation request',
    timestamp: consultation.scheduledDate,
    type: 'info'
  });

  // Confirmed event
  if (consultation.confirmedAt) {
    events.push({
      id: 'confirmed',
      icon: CheckCircle,
      iconColor: 'text-green-500',
      iconBg: 'bg-green-50',
      title: 'Consultation Confirmed',
      description: 'You confirmed this consultation',
      timestamp: consultation.confirmedAt,
      type: 'success'
    });
  }

  // Rescheduled events
  if (consultation.rescheduleRequests && consultation.rescheduleRequests.length > 0) {
    consultation.rescheduleRequests.forEach((request, index) => {
      events.push({
        id: `reschedule-${index}`,
        icon: Clock,
        iconColor: 'text-orange-500',
        iconBg: 'bg-orange-50',
        title: 'Reschedule Request',
        description: `${request.requestedBy === 'lawyer' ? 'You' : 'Client'} requested to reschedule: ${request.reason}`,
        timestamp: request.requestedDate,
        type: 'warning',
        status: request.status
      });
    });
  }

  // Completed event
  if (consultation.completedAt) {
    events.push({
      id: 'completed',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-50',
      title: 'Consultation Completed',
      description: 'Session was successfully completed',
      timestamp: consultation.completedAt,
      type: 'success'
    });
  }

  // Cancelled event
  if (consultation.cancelledAt) {
    events.push({
      id: 'cancelled',
      icon: XCircle,
      iconColor: 'text-red-500',
      iconBg: 'bg-red-50',
      title: 'Consultation Cancelled',
      description: `Cancelled by ${consultation.cancelledBy === 'lawyer' ? 'you' : 'client'}: ${consultation.cancellationNote || 'No reason provided'}`,
      timestamp: consultation.cancelledAt,
      type: 'error'
    });
  }

  // Documents uploaded
  if (consultation.documents && consultation.documents.length > 0) {
    consultation.documents.forEach((doc, index) => {
      events.push({
        id: `doc-${index}`,
        icon: FileText,
        iconColor: 'text-purple-500',
        iconBg: 'bg-purple-50',
        title: 'Document Uploaded',
        description: `${doc.uploadedBy === 'lawyer' ? 'You' : 'Client'} uploaded ${doc.name}`,
        timestamp: doc.uploadedAt,
        type: 'info'
      });
    });
  }

  // Sort events by timestamp (most recent first)
  events.sort((a, b) => {
    const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
    const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Activity Timeline</CardTitle>
        <CardDescription className="text-muted-foreground">
          Track all activities and updates for this consultation
        </CardDescription>
      </CardHeader>
      <CardContent>
        {events.length > 0 ? (
          <div className="relative space-y-4">
            {/* Timeline line */}
            <div className="absolute left-[18px] top-0 bottom-0 w-px bg-border" />

            {events.map((event) => (
              <div key={event.id} className="relative flex items-start gap-4 pb-4">
                {/* Icon */}
                <div className={cn(
                  "relative z-10 flex items-center justify-center w-9 h-9 rounded-full border-2 border-background",
                  event.iconBg
                )}>
                  <event.icon className={cn("h-4 w-4", event.iconColor)} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{event.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 break-words">
                        {event.description}
                      </p>
                      {event.status && (
                        <Badge
                          variant="outline"
                          className={cn(
                            "mt-2",
                            event.status === 'approved' && 'bg-green-50 text-green-700 border-green-200',
                            event.status === 'rejected' && 'bg-red-50 text-red-700 border-red-200',
                            event.status === 'pending' && 'bg-yellow-50 text-yellow-700 border-yellow-200'
                          )}
                        >
                          {event.status}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {event.timestamp
                        ? format(parseISO(event.timestamp.toString()), 'MMM d, h:mm a')
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No activity recorded yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
