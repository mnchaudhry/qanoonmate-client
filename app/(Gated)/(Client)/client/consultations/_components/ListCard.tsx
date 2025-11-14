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
import { CancellationReason, ConsultationStatus, UserRole } from "@/lib/enums";
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
      case ConsultationStatus.CONFIRMED:
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Confirmed</Badge>;
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
      dispatch(cancelConsultation({ id: consultation._id, request: { reason: CancellationReason.CLIENT_REQUEST }, userId: '', userRole: UserRole.CLIENT }));
    }
  };

  /////////////////////////////////////////////// RETURN ///////////////////////////////////////////////
  return (
    <Card className="border border-border bg-background rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        {/* Header Section - Lawyer Info & Status */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-4 flex-1">
            <Link href={`/lawyers/${(consultation?.lawyer as ILawyer)?._id}`}>
              <Avatar className="h-16 w-16 border-2 border-primary/10">
                <AvatarImage src={(consultation?.lawyer as ILawyer)?.profilePicture} />
                <AvatarFallback className="uppercase text-lg bg-primary/5 text-primary">
                  {(consultation?.lawyer as ILawyer)?.firstname?.[0] || "L"}
                  {(consultation?.lawyer as ILawyer)?.lastname?.[0] || ""}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex-1">
              <Link href={`/lawyers/${(consultation?.lawyer as ILawyer)?._id}`}>
                <h3 className="text-lg font-semibold text-foreground capitalize hover:text-primary transition-colors">
                  {(consultation?.lawyer as ILawyer)?.firstname} {(consultation?.lawyer as ILawyer)?.lastname}
                </h3>
              </Link>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Tag className="h-4 w-4 text-primary" />
                  <span>{(consultation?.lawyer as ILawyer)?.specializations?.[0] || "General Law"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{(consultation?.lawyer as ILawyer)?.location?.city || "Not specified"}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {getStatusBadge()}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Consultation Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="text-sm font-medium">
                {consultation.scheduledDate ? format(new Date(consultation.scheduledDate), "dd MMM yyyy") : "Not set"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Time</p>
              <p className="text-sm font-medium">{consultation.scheduledTime || "Not set"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="text-sm font-medium">{consultation.duration || 60} mins</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10">
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Fee</p>
              <p className="text-sm font-medium">PKR {consultation.fee?.toLocaleString() || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Meeting Type */}
        {consultation.type && (
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground text-sm">
              {consultation.meetingLink ? (
                <>
                  <Video className="h-4 w-4" />
                  <span>Online Consultation</span>
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4" />
                  <span>In-Person Consultation</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Case Description */}
        {consultation.description && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-foreground mb-2">Case Description</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {consultation.description.length > 200
                ? `${consultation.description.slice(0, 200)}...`
                : consultation.description}
            </p>
          </div>
        )}

        {/* Additional Info */}
        {(consultation.documents?.length > 0 || consultation.notes?.length > 0) && (
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            {consultation.documents?.length > 0 && (
              <div className="flex items-center gap-1.5">
                <FileText className="h-4 w-4" />
                <span>{consultation.documents.length} document{consultation.documents.length !== 1 ? 's' : ''}</span>
              </div>
            )}
            {consultation.notes?.length > 0 && (
              <div className="flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4" />
                <span>{consultation.notes.length} note{consultation.notes.length !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2 px-6 py-4 bg-muted/30 border-t border-border">
        {consultation.status === ConsultationStatus.PENDING && (
          <>
            <Button size="sm" variant="default" asChild>
              <Link href={"/client/messages"}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat with Lawyer
              </Link>
            </Button>
            <Button size="sm" variant="outline">
              View Details
            </Button>
          </>
        )}
        {consultation.status === ConsultationStatus.SCHEDULED && (
          <>
            <Button size="sm" variant="default">
              View Details
            </Button>
            <Button variant="outline" size="sm">
              Reschedule
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive" 
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </>
        )}
        {consultation.status === ConsultationStatus.IN_PROGRESS && (
          <Button size="sm" variant="default" asChild>
            <Link href={consultation.meetingLink || "#"}>
              <Video className="h-4 w-4 mr-2" />
              Join Meeting
            </Link>
          </Button>
        )}
        {consultation.status === ConsultationStatus.CANCELLED && (
          <>
            <Button size="sm" variant="default">
              Rebook
            </Button>
            <Button size="sm" variant="outline">
              View Details
            </Button>
          </>
        )}
        {consultation.status === ConsultationStatus.COMPLETED && (
          <>
            <Button size="sm" variant="default">
              View Summary
            </Button>
            <Button variant="outline" size="sm">
              Leave Review
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
