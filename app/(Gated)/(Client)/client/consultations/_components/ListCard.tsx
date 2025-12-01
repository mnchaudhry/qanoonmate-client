"use client";

import { format } from "date-fns";
import { Calendar, Clock, MapPin, Tag, CreditCard, Video, FileText, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { cancelConsultation } from "@/store/reducers/consultationSlice";
import { ILawyer } from "@/store/types/lawyer.types";
import { CancellationReason, ConsultationStatus } from "@/lib/enums";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { IConsultation } from "@/store/types/consultation.types";
import { Separator } from "@/components/ui/separator";

interface ConsultationCardProps {
  consultation: IConsultation;
}

export default function ConsultationCard({ consultation }: ConsultationCardProps) {

  /////////////////////////////////////////////// VARIABLES ///////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>();

  /////////////////////////////////////////////// FUNCTIONS ///////////////////////////////////////////////

  /////////////////////////////////////////////// FUNCTIONS ///////////////////////////////////////////////
  const getStatusBadge = () => {
    switch (consultation.status) {
      case ConsultationStatus.SCHEDULED:
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Confirmed</Badge>;
      case ConsultationStatus.COMPLETED:
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Completed</Badge>;
      case ConsultationStatus.CANCELLED:
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Cancelled</Badge>;
      case ConsultationStatus.RESCHEDULED:
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Rescheduled</Badge>;
      case ConsultationStatus.PENDING:
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">Pending</Badge>;
      case ConsultationStatus.IN_PROGRESS:
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">In Progress</Badge>;
      case ConsultationStatus.NO_SHOW:
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">No Show</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel this consultation?")) {
      dispatch(cancelConsultation({ id: consultation._id, request: { reason: CancellationReason.CLIENT_REQUEST } }));
    }
  };

  /////////////////////////////////////////////// RETURN ///////////////////////////////////////////////
  return (
    <Card className="border border-border bg-background rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        {/* Header Section - Lawyer Info & Status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 flex-1">
            <Link href={`/lawyers/${(consultation?.lawyer as ILawyer)?._id}`}>
              <Avatar className="h-12 w-12 border-2 border-primary/10">
                <AvatarImage src={(consultation?.lawyer as ILawyer)?.profilePicture} />
                <AvatarFallback className="uppercase text-base bg-primary/5 text-primary">
                  {(consultation?.lawyer as ILawyer)?.firstname?.[0] || "L"}
                  {(consultation?.lawyer as ILawyer)?.lastname?.[0] || ""}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex-1 min-w-0">
              <Link href={`/lawyers/${(consultation?.lawyer as ILawyer)?._id}`}>
                <h3 className="text-base font-semibold text-foreground capitalize hover:text-primary transition-colors truncate">
                  {(consultation?.lawyer as ILawyer)?.firstname} {(consultation?.lawyer as ILawyer)?.lastname}
                </h3>
              </Link>
              <div className="flex flex-wrap items-center gap-2 mt-0.5 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Tag className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="text-xs">{(consultation?.lawyer as ILawyer)?.specializations?.[0] || "General Law"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="text-xs">{(consultation?.lawyer as ILawyer)?.location?.city || "Not specified"}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="shrink-0">
            {getStatusBadge()}
          </div>
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

        {/* Meeting Type & Additional Info - Combined Row */}
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
        {consultation.status === ConsultationStatus.PENDING && (
          <>
            <Button size="sm" variant="default" asChild className="h-8">
              <Link href={`/client/messages?consultationId=${consultation._id}`}>
                <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                Chat with Lawyer
              </Link>
            </Button>
            <Button size="sm" variant="outline" className="h-8">
              View Details
            </Button>
          </>
        )}
        {consultation.status === ConsultationStatus.SCHEDULED && (
          <>
            <Button size="sm" variant="default" className="h-8">
              View Details
            </Button>
            <Button size="sm" variant="outline" asChild className="h-8">
              <Link href={`/client/messages?consultationId=${consultation._id}`}>
                <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                Chat with Lawyer
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              Reschedule
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive h-8"
              onClick={handleCancel}
            >
              Cancel
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
              <Link href={`/client/messages?consultationId=${consultation._id}`}>
                <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                Chat with Lawyer
              </Link>
            </Button>
          </>
        )}
        {consultation.status === ConsultationStatus.CANCELLED && (
          <>
            <Button size="sm" variant="default" className="h-8">
              Rebook
            </Button>
            <Button size="sm" variant="outline" className="h-8">
              View Details
            </Button>
            <Button size="sm" variant="outline" asChild className="h-8">
              <Link href={`/client/messages?consultationId=${consultation._id}`}>
                <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                Chat with Lawyer
              </Link>
            </Button>
          </>
        )}
        {consultation.status === ConsultationStatus.COMPLETED && (
          <>
            <Button size="sm" variant="default" className="h-8">
              View Summary
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              Leave Review
            </Button>
            <Button size="sm" variant="outline" asChild className="h-8">
              <Link href={`/client/messages?consultationId=${consultation._id}`}>
                <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                Chat with Lawyer
              </Link>
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
