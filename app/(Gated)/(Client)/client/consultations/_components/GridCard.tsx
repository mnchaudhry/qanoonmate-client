"use client";

import { format } from "date-fns";
import { Card, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Tag, MapPin, Star, XCircle, MessageSquare, RotateCcw, CalendarClock, FileText } from "lucide-react";
import { Consultation } from "@/store/types/api";
import { ILawyer } from "@/store/types/lawyer.types";
import { ConsultationStatus } from "@/lib/enums";
import Hint from "@/components/Hint";
import Link from "next/link";

interface ConsultationCardGridProps {
  consultation: Consultation;
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
  return (
    <Card className="flex flex-col items-center p-4 border !border-border bg-background rounded-xl shadow-sm h-full">
      <Avatar className="h-[72px] w-[72px] mb-2">
        <AvatarImage src={(consultation.lawyerId as ILawyer)?.profilePicture} />
        <AvatarFallback className="uppercase text-xl">
          {(consultation.lawyerId as ILawyer)?.firstname?.[0] || "L"}
          {(consultation.lawyerId as ILawyer)?.lastname?.[0] || "L"}
        </AvatarFallback>
      </Avatar>
      <div className="text-base font-semibold text-foreground text-center capitalize">
        {(consultation.lawyerId as ILawyer)?.firstname} {(consultation.lawyerId as ILawyer)?.lastname}
      </div>
      {/* Case Description */}
      {consultation.description && (
        <div className="text-xs text-foreground/80 text-center mt-1 mb-1 max-w-[14rem] truncate">
          {consultation.description.length > 80
            ? `${consultation.description.slice(0, 80)}...`
            : consultation.description}
        </div>
      )}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
        <Hint label="Date">
          <Calendar className="h-3 w-3 cursor-pointer" />
        </Hint>
        {consultation.scheduledDate ? format(new Date(consultation.scheduledDate), "dd MMM yyyy") : "Date"}
        <Hint label="Time">
          <Clock className="h-3 w-3 cursor-pointer ml-2" />
        </Hint>
        {consultation.scheduledDate ? format(new Date(consultation.scheduledDate), "hh:mm a") : "Time"}
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
        <Hint label="Specialization">
          <Tag className="h-3 w-3 cursor-pointer" />
        </Hint>
        <span>{(consultation.lawyerId as ILawyer)?.specializations?.[0] || "General Law"}</span>
        <Hint label="City">
          <MapPin className="h-3 w-3 cursor-pointer ml-2" />
        </Hint>
        <span>{(consultation.lawyerId as ILawyer)?.location?.city || "Not specified"}</span>
      </div>
      <div className="mt-2 mb-3">{getStatusBadge(consultation.status)}</div>
      <CardFooter className="w-full flex justify-center p-0">
        <div className="flex gap-2 mb-2 w-full justify-center">
          {consultation.status === ConsultationStatus.PENDING && (
            <Button size='sm' variant="outline" title="Chat">
              <Link href={"/client/messages"}>
                Chat with Lawyer
              </Link>
              <MessageSquare className="h-4 w-4" />
            </Button>
          )}
          {consultation.status === ConsultationStatus.SCHEDULED && (
            <>
              <Button size='sm' variant="outline" title="Reschedule">
                Reschedule
                <CalendarClock className="h-4 w-4" />
              </Button>
              <Button size='sm' variant="outline" className="text-destructive border-destructive hover:bg-destructive/10" title="Cancel">
                Cancel
                <XCircle className="h-4 w-4" />
              </Button>
            </>
          )}
          {consultation.status === ConsultationStatus.COMPLETED && !consultation.rating && (
            <Button size='sm' title="Give Feedback">
              Give Feedback
              <Star className="h-4 w-4" />
            </Button>
          )}
          {consultation.status === ConsultationStatus.CANCELLED && (
            <Button size='sm' title="Rebook">
              Rebook
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
          {consultation.status === ConsultationStatus.COMPLETED && (
            <Button size='sm' variant="outline" title="View Summary">
              View Summary
              <FileText className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ConsultationCardGrid; 