"use client";

import { format } from "date-fns";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Tag, XCircle, MessageSquare, RotateCcw, CalendarClock, FileText, Video, CreditCard } from "lucide-react";
import { ILawyer } from "@/store/types/lawyer.types";
import { ConsultationStatus, CancellationReason } from "@/lib/enums";
import Link from "next/link";
import { IConsultation } from "@/store/types/consultation.types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { cancelConsultation } from "@/store/reducers/consultationSlice";
import { Separator } from "@/components/ui/separator";

interface ConsultationCardGridProps {
  consultation: IConsultation;
}

function getStatusBadge(status: ConsultationStatus) {
  switch (status) {
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
}

const ConsultationCardGrid = ({ consultation }: ConsultationCardGridProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel this consultation?")) {
      dispatch(cancelConsultation({
        id: consultation._id,
        request: { reason: CancellationReason.CLIENT_REQUEST },
      }));
    }
  };

  return (
    <Card className="flex flex-col border border-border bg-background rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden h-full">
      {/* Header with Status Badge */}
      <div className="relative">
        <div className="absolute top-3 right-3 z-10">
          {getStatusBadge(consultation.status)}
        </div>
      </div>

      <CardContent className="flex-1 p-5 space-y-4">
        {/* Lawyer Info */}
        <div className="flex flex-col items-center text-center">
          <Link href={`/lawyers/${(consultation?.lawyer as ILawyer)?._id}`}>
            <Avatar className="h-20 w-20 mb-3 border-2 border-primary/10">
              <AvatarImage src={(consultation?.lawyer as ILawyer)?.profilePicture} />
              <AvatarFallback className="uppercase text-xl bg-primary/5 text-primary">
                {(consultation?.lawyer as ILawyer)?.firstname?.[0] || "L"}
                {(consultation?.lawyer as ILawyer)?.lastname?.[0] || ""}
              </AvatarFallback>
            </Avatar>
          </Link>
          <Link href={`/lawyers/${(consultation?.lawyer as ILawyer)?._id}`}>
            <h3 className="text-base font-semibold text-foreground capitalize hover:text-primary transition-colors mb-1">
              {(consultation?.lawyer as ILawyer)?.firstname} {(consultation?.lawyer as ILawyer)?.lastname}
            </h3>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
            <Tag className="h-3.5 w-3.5" />
            <span>{(consultation?.lawyer as ILawyer)?.specializations?.[0] || "General Law"}</span>
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
        {consultation.status === ConsultationStatus.PENDING && (
          <>
            <Button size="sm" className="w-full" variant="default" asChild>
              <Link href={"/client/messages"}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat with Lawyer
              </Link>
            </Button>
            <Button size="sm" className="w-full" variant="outline">
              View Details
            </Button>
          </>
        )}
        {consultation.status === ConsultationStatus.SCHEDULED && (
          <>
            <Button size="sm" className="w-full" variant="default">
              View Details
            </Button>
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button size="sm" variant="outline">
                <CalendarClock className="h-4 w-4 mr-1" />
                Reschedule
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={handleCancel}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          </>
        )}
        {consultation.status === ConsultationStatus.IN_PROGRESS && (
          <Button size="sm" className="w-full" variant="default" asChild>
            <Link href={consultation.meetingLink || "#"}>
              <Video className="h-4 w-4 mr-2" />
              Join Meeting
            </Link>
          </Button>
        )}
        {consultation.status === ConsultationStatus.CANCELLED && (
          <>
            <Button size="sm" className="w-full" variant="default">
              <RotateCcw className="h-4 w-4 mr-2" />
              Rebook
            </Button>
            <Button size="sm" className="w-full" variant="outline">
              View Details
            </Button>
          </>
        )}
        {consultation.status === ConsultationStatus.COMPLETED && (
          <>
            <Button size="sm" className="w-full" variant="default">
              <FileText className="h-4 w-4 mr-2" />
              View Summary
            </Button>
            <Button size="sm" className="w-full" variant="outline">
              Leave Review
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default ConsultationCardGrid; 