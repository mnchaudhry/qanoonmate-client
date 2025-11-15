"use client";

import { format } from "date-fns";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, XCircle, MessageSquare, FileText, Video, CreditCard, CheckCircle, Eye, Mail, Phone } from "lucide-react";
import { IClient } from "@/store/types/client.types";
import { ConsultationStatus } from "@/lib/enums";
import Link from "next/link";
import { IConsultation } from "@/store/types/consultation.types";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ConsultationCardGridProps {
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
  },
  [ConsultationStatus.CONFIRMED]: {
    color: "bg-teal-100 text-teal-800 border-teal-200",
    label: "Confirmed"
  }
};

const ConsultationGridCard = ({ consultation }: ConsultationCardGridProps) => {
  const getClientInfo = () => {
    if (typeof consultation?.client === 'object') {
      const client = consultation?.client as IClient;
      return {
        name: `${client.firstname || ''} ${client.lastname || ''}`.trim() || 'Unknown Client',
        email: client.email || '',
        phone: client.phone || '',
        avatar: client.profilePicture || '',
        initials: `${client.firstname?.[0] || ''}${client.lastname?.[0] || ''}`.toUpperCase() || 'UC',
      };
    }
    return {
      name: 'Unknown Client',
      email: '',
      phone: '',
      avatar: '',
      initials: 'UC',
    };
  };

  const client = getClientInfo();
  const statusInfo = statusConfig[consultation.status] || {
    color: "bg-muted text-muted-foreground border-border",
    label: consultation.status
  };

  return (
    <Card className="flex flex-col border border-border bg-background rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden h-full">
      {/* Header with Status Badge */}
      <div className="relative">
        <div className="absolute top-3 right-3 z-10">
          <Badge variant="outline" className={cn("font-medium border text-xs", statusInfo.color)}>
            {statusInfo.label}
          </Badge>
        </div>
      </div>

      <CardContent className="flex-1 p-5 space-y-4">
        {/* Client Info */}
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-20 w-20 mb-3 border-2 border-primary/10">
            <AvatarImage src={client.avatar} />
            <AvatarFallback className="uppercase text-xl bg-primary/5 text-primary">
              {client.initials}
            </AvatarFallback>
          </Avatar>
          <h3 className="text-base font-semibold text-foreground capitalize mb-1">
            {client.name}
          </h3>
          <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground mb-2">
            {client.email && (
              <div className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                <span className="truncate max-w-[180px]">{client.email}</span>
              </div>
            )}
            {client.phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" />
                <span>{client.phone}</span>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Consultation Details */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-xs">Date</span>
            </div>
            <span className="font-medium text-foreground">
              {consultation.scheduledDate ? format(new Date(consultation.scheduledDate), "dd MMM") : "N/A"}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-xs">Time</span>
            </div>
            <span className="font-medium text-foreground">{consultation.scheduledTime || "N/A"}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-xs">Duration</span>
            </div>
            <span className="font-medium text-foreground">{consultation.duration || 60} mins</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CreditCard className="h-4 w-4 text-primary" />
              <span className="text-xs">Fee</span>
            </div>
            <span className="font-medium text-foreground">PKR {consultation.fee?.toLocaleString() || "N/A"}</span>
          </div>

          {consultation.meetingLink && (
            <div className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-md bg-secondary/50 text-xs">
              <Video className="h-3.5 w-3.5" />
              <span>Online Meeting</span>
            </div>
          )}
        </div>

        {/* Description */}
        {consultation.description && (
          <div className="pt-2">
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {consultation.description}
            </p>
          </div>
        )}

        {/* Documents & Notes Count */}
        {(consultation.documents?.length > 0 || consultation.notes?.length > 0) && (
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
            {consultation.documents?.length > 0 && (
              <div className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                <span>{consultation.documents.length}</span>
              </div>
            )}
            {consultation.notes?.length > 0 && (
              <div className="flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>{consultation.notes.length}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-2 p-4 bg-muted/30 border-t border-border">
        {/* Always show View Details */}
        <Button size="sm" className="w-full" variant="default" asChild>
          <Link href={`/lawyer/consultations/${consultation._id}`}>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Link>
        </Button>

        {consultation.status === ConsultationStatus.PENDING && (
          <>
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button size="sm" variant="outline">
                <CheckCircle className="h-4 w-4 mr-1" />
                Accept
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <XCircle className="h-4 w-4 mr-1" />
                Decline
              </Button>
            </div>
            <Button size="sm" variant="outline" className="w-full" asChild>
              <Link href={`/lawyer/chat?userId=${typeof consultation?.client === 'object' ? (consultation?.client as IClient)?._id : ''}`}>
                <MessageSquare className="h-4 w-4 mr-1" />
                Chat with Client
              </Link>
            </Button>
          </>
        )}

        {(consultation.status === ConsultationStatus.SCHEDULED || consultation.status === ConsultationStatus.CONFIRMED) && (
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button size="sm" variant="outline" asChild>
              <Link href={`/lawyer/chat?userId=${typeof consultation?.client === 'object' ? (consultation?.client as IClient)?._id : ''}`}>
                <MessageSquare className="h-4 w-4 mr-1" />
                Chat
              </Link>
            </Button>
            <Button size="sm" variant="outline">
              Reschedule
            </Button>
          </div>
        )}

        {consultation.status === ConsultationStatus.IN_PROGRESS && (
          <>
            <Button size="sm" className="w-full" variant="default" asChild>
              <Link href={consultation.meetingLink || "#"}>
                <Video className="h-4 w-4 mr-2" />
                Join Meeting
              </Link>
            </Button>
            <Button size="sm" variant="outline" className="w-full" asChild>
              <Link href={`/lawyer/chat?userId=${typeof consultation?.client === 'object' ? (consultation?.client as IClient)?._id : ''}`}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat with Client
              </Link>
            </Button>
          </>
        )}

        {consultation.status === ConsultationStatus.COMPLETED && (
          <>
            <Button size="sm" className="w-full" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Add Notes
            </Button>
            <Button size="sm" variant="outline" className="w-full" asChild>
              <Link href={`/lawyer/chat?userId=${typeof consultation?.client === 'object' ? (consultation?.client as IClient)?._id : ''}`}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat with Client
              </Link>
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default ConsultationGridCard;
