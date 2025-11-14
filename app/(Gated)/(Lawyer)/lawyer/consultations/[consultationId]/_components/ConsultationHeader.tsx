"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ConsultationStatus, ConsultationType } from "@/lib/enums";
import { IConsultation } from "@/store/types/consultation.types";
import { Calendar, Clock, MapPin, Video, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";

interface ConsultationHeaderProps {
  consultation: IConsultation;
  onConfirm?: () => void;
  onStart?: () => void;
  onComplete?: () => void;
  onCancel?: () => void;
  onReschedule?: () => void;
  loading?: boolean;
}

const statusConfig: Record<ConsultationStatus, { color: string; label: string }> = {
  [ConsultationStatus.PENDING]: {
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    label: "Pending Review"
  },
  [ConsultationStatus.SCHEDULED]: {
    color: "bg-blue-50 text-blue-700 border-blue-200",
    label: "Scheduled"
  },
  [ConsultationStatus.CONFIRMED]: {
    color: "bg-teal-50 text-teal-700 border-teal-200",
    label: "Confirmed"
  },
  [ConsultationStatus.IN_PROGRESS]: {
    color: "bg-purple-50 text-purple-700 border-purple-200",
    label: "In Progress"
  },
  [ConsultationStatus.COMPLETED]: {
    color: "bg-green-50 text-green-700 border-green-200",
    label: "Completed"
  },
  [ConsultationStatus.CANCELLED]: {
    color: "bg-red-50 text-red-700 border-red-200",
    label: "Cancelled"
  },
  [ConsultationStatus.NO_SHOW]: {
    color: "bg-gray-50 text-gray-700 border-gray-200",
    label: "No Show"
  },
  [ConsultationStatus.RESCHEDULED]: {
    color: "bg-orange-50 text-orange-700 border-orange-200",
    label: "Rescheduled"
  }
};

const typeConfig: Record<ConsultationType, { color: string; label: string }> = {
  [ConsultationType.GENERAL]: {
    color: "bg-gray-50 text-gray-700 border-gray-200",
    label: "General"
  },
  [ConsultationType.SPECIALIST]: {
    color: "bg-blue-50 text-blue-700 border-blue-200",
    label: "Specialist"
  },
  [ConsultationType.FOLLOW_UP]: {
    color: "bg-purple-50 text-purple-700 border-purple-200",
    label: "Follow-up"
  },
  [ConsultationType.EMERGENCY]: {
    color: "bg-red-50 text-red-700 border-red-200",
    label: "Emergency"
  },
  [ConsultationType.INITIAL]: {
    color: "bg-green-50 text-green-700 border-green-200",
    label: "Initial"
  }
};

export default function ConsultationHeader({
  consultation,
  onConfirm,
  onStart,
  onComplete,
  onCancel,
  onReschedule,
  loading = false
}: ConsultationHeaderProps) {
  const client = typeof consultation.client === 'object' ? consultation.client : null;
  const clientName = client ? `${client.firstname} ${client.lastname}` : 'Unknown Client';
  const clientInitials = client ? `${client.firstname?.[0]}${client.lastname?.[0]}`.toUpperCase() : 'UC';

  const scheduledDateTime = consultation.scheduledDate ? parseISO(consultation.scheduledDate.toString()) : new Date();
  const formattedDate = format(scheduledDateTime, "EEEE, MMMM d, yyyy");
  const formattedTime = consultation.scheduledTime || "Time not set";

  const showConfirmButton = consultation.status === ConsultationStatus.PENDING || consultation.status === ConsultationStatus.SCHEDULED;
  const showStartButton = consultation.status === ConsultationStatus.CONFIRMED;
  const showCompleteButton = consultation.status === ConsultationStatus.IN_PROGRESS;
  const showCancelButton = [ConsultationStatus.PENDING, ConsultationStatus.SCHEDULED, ConsultationStatus.CONFIRMED].includes(consultation.status);
  const showRescheduleButton = [ConsultationStatus.SCHEDULED, ConsultationStatus.CONFIRMED].includes(consultation.status);

  return (
    <Card className="border-border">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Client Info */}
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={client?.profilePicture} alt={clientName} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                {clientInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-foreground">{clientName}</h1>
                <Badge className={cn("border", statusConfig[consultation.status].color)}>
                  {statusConfig[consultation.status].label}
                </Badge>
                <Badge className={cn("border", typeConfig[consultation.type].color)}>
                  {typeConfig[consultation.type].label}
                </Badge>
              </div>
              {client?.email && (
                <p className="text-sm text-muted-foreground mb-2">{client.email}</p>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formattedTime} ({consultation.duration} min)</span>
                </div>
                {consultation.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{consultation.location}</span>
                  </div>
                )}
                {consultation.meetingLink && (
                  <div className="flex items-center gap-1">
                    <Video className="h-4 w-4" />
                    <a
                      href={consultation.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Join Meeting
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            {showConfirmButton && onConfirm && (
              <Button onClick={onConfirm} disabled={loading} size="sm">
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm
              </Button>
            )}
            {showStartButton && onStart && (
              <Button onClick={onStart} disabled={loading} size="sm">
                <Video className="h-4 w-4 mr-2" />
                Start Session
              </Button>
            )}
            {showCompleteButton && onComplete && (
              <Button onClick={onComplete} disabled={loading} size="sm" variant="default">
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark Complete
              </Button>
            )}
            {showRescheduleButton && onReschedule && (
              <Button onClick={onReschedule} disabled={loading} size="sm" variant="outline">
                <Clock className="h-4 w-4 mr-2" />
                Reschedule
              </Button>
            )}
            {showCancelButton && onCancel && (
              <Button onClick={onCancel} disabled={loading} size="sm" variant="destructive">
                <XCircle className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            )}
          </div>
        </div>

        {/* Fee Information */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Consultation Fee</p>
                <p className="text-lg font-semibold text-foreground">PKR {consultation.fee.toLocaleString()}</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="text-sm text-muted-foreground">Payment Status</p>
                <Badge className={cn("border",
                  consultation.paymentStatus === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                    consultation.paymentStatus === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      'bg-red-50 text-red-700 border-red-200'
                )}>
                  {consultation.paymentStatus.charAt(0).toUpperCase() + consultation.paymentStatus.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
