"use client";

import { format } from "date-fns";
import { Calendar, Clock, MapPin, CreditCard, Video, FileText, MessageSquare, Phone, Mail, CheckCircle, XCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IClient } from "@/store/types/client.types";
import { ConsultationStatus } from "@/lib/enums";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { IConsultation } from "@/store/types/consultation.types";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ConsultationCardProps {
  consultation: IConsultation;
}

const statusConfig: Record<ConsultationStatus, { color: string; label: string }> = {
  [ConsultationStatus.PENDING]: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    label: "Pending Review"
  },
  [ConsultationStatus.SCHEDULED]: {
    color: "bg-blue-100 text-blue-800 border-blue-200",
    label: "Scheduled"
  },
  [ConsultationStatus.COMPLETED]: {
    color: "bg-green-100 text-green-800 border-green-200",
    label: "Completed"
  },
  [ConsultationStatus.CANCELLED]: {
    color: "bg-red-100 text-red-800 border-red-200",
    label: "Cancelled"
  },
  [ConsultationStatus.NO_SHOW]: {
    color: "bg-gray-100 text-gray-800 border-gray-200",
    label: "No Show"
  },
  [ConsultationStatus.RESCHEDULED]: {
    color: "bg-orange-100 text-orange-800 border-orange-200",
    label: "Rescheduled"
  },
  [ConsultationStatus.IN_PROGRESS]: {
    color: "bg-purple-100 text-purple-800 border-purple-200",
    label: "In Progress"
  }
};

export default function ConsultationListCard({ consultation }: ConsultationCardProps) {
  const getClientInfo = () => {
    if (typeof consultation?.client === 'object') {
      const client = consultation?.client as IClient;
      return {
        name: `${client.firstname || ''} ${client.lastname || ''}`.trim() || 'Unknown Client',
        email: client.email || '',
        phone: client.phone || '',
        avatar: client.profilePicture || '',
        initials: `${client.firstname?.[0] || ''}${client.lastname?.[0] || ''}`.toUpperCase() || 'UC',
        location: client.location?.city || ''
      };
    }
    return {
      name: 'Unknown Client',
      email: '',
      phone: '',
      avatar: '',
      initials: 'UC',
      location: ''
    };
  };

  const client = getClientInfo();
  const statusInfo = statusConfig[consultation.status] || {
    color: "bg-muted text-muted-foreground border-border",
    label: consultation.status
  };

  return (
    <Card className="border border-border bg-background rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        {/* Header Section - Client Info & Status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 flex-1">
            <Avatar className="h-12 w-12 border-2 border-primary/10">
              <AvatarImage src={client.avatar} />
              <AvatarFallback className="uppercase text-base bg-primary/5 text-primary">
                {client.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-foreground capitalize truncate">
                {client.name}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-0.5 text-sm text-muted-foreground">
                {client.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="text-xs truncate">{client.email}</span>
                  </div>
                )}
                {client.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="text-xs">{client.phone}</span>
                  </div>
                )}
                {client.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="text-xs">{client.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <Badge variant="outline" className={cn("font-medium border shrink-0 text-xs", statusInfo.color)}>
            {statusInfo.label}
          </Badge>
        </div>

        <Separator className="my-3" />

        {/* Consultation Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 shrink-0">
              <Calendar className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="text-xs font-medium truncate">
                {consultation.scheduledDate ? format(new Date(consultation.scheduledDate), "dd MMM yyyy") : "Not set"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 shrink-0">
              <Clock className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Time</p>
              <p className="text-xs font-medium">{consultation.scheduledTime || "Not set"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 shrink-0">
              <Clock className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="text-xs font-medium">{consultation.duration || 60} mins</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 shrink-0">
              <CreditCard className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Fee</p>
              <p className="text-xs font-medium truncate">PKR {consultation.fee?.toLocaleString() || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Meeting Type & Description - Combined Row */}
        <div className="flex items-center gap-3 mb-3">
          {consultation.type && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-xs shrink-0">
              {consultation.meetingLink ? (
                <>
                  <Video className="h-3.5 w-3.5" />
                  <span>Online</span>
                </>
              ) : (
                <>
                  <MapPin className="h-3.5 w-3.5" />
                  <span>In-Person</span>
                </>
              )}
            </div>
          )}

          {/* Additional Info */}
          {(consultation.documents?.length > 0 || consultation.notes?.length > 0) && (
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {consultation.documents?.length > 0 && (
                <div className="flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5" />
                  <span>{consultation.documents.length} doc{consultation.documents.length !== 1 ? 's' : ''}</span>
                </div>
              )}
              {consultation.notes?.length > 0 && (
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>{consultation.notes.length} note{consultation.notes.length !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Case Description */}
        {consultation.description && (
          <div>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {consultation.description}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2 px-4 py-3 bg-muted/30 border-t border-border">
        {/* Always show View Details */}
        <Button size="sm" variant="default" asChild className="h-8">
          <Link href={`/lawyer/consultations/${consultation._id}`}>
            <Eye className="h-3.5 w-3.5 mr-1.5" />
            View Details
          </Link>
        </Button>

        {consultation.status === ConsultationStatus.PENDING && (
          <>
            <Button size="sm" variant="outline" className="h-8">
              <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
              Accept
            </Button>
            <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive h-8">
              <XCircle className="h-3.5 w-3.5 mr-1.5" />
              Decline
            </Button>
            <Button size="sm" variant="outline" asChild className="h-8">
              <Link href={`/lawyer/messages?consultationId=${consultation._id}`}>
                <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                Chat with Client
              </Link>
            </Button>
          </>
        )}

        {(consultation.status === ConsultationStatus.SCHEDULED) && (
          <>
            <Button size="sm" variant="outline" asChild className="h-8">
              <Link href={`/lawyer/messages?consultationId=${consultation._id}`}>
                <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                Chat with Client
              </Link>
            </Button>
            <Button size="sm" variant="outline" className="h-8">
              Reschedule
            </Button>
          </>
        )}

        {consultation.status === ConsultationStatus.IN_PROGRESS && (
          <>
            <Button size="sm" variant="default" asChild className="h-8">
              <Link href={consultation.meetingLink || "#"}>
                <Video className="h-3.5 w-3.5 mr-1.5" />
                Join Meeting
              </Link>
            </Button>
            <Button size="sm" variant="outline" asChild className="h-8">
              <Link href={`/lawyer/messages?consultationId=${consultation._id}`}>
                <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                Chat with Client
              </Link>
            </Button>
          </>
        )}

        {consultation.status === ConsultationStatus.COMPLETED && (
          <>
            <Button size="sm" variant="outline" className="h-8">
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              Add Notes
            </Button>
            <Button size="sm" variant="outline" asChild className="h-8">
              <Link href={`/lawyer/messages?consultationId=${consultation._id}`}>
                <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                Chat with Client
              </Link>
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
