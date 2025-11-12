"use client";

import { format } from "date-fns";
import { Calendar, Clock, MapPin, Tag, CreditCard, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { cancelConsultation } from "@/store/reducers/consultationSlice";
import { Consultation } from "@/store/types/api";
import { ILawyer } from "@/store/types/lawyer.types";
import { ConsultationStatus } from "@/lib/enums";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Hint from "@/components/Hint";
import Link from "next/link";

interface ConsultationCardProps {
  consultation: Consultation;
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
      dispatch(cancelConsultation({ id: consultation._id, reason: "User cancelled" }));
    }
  };

  /////////////////////////////////////////////// RETURN ///////////////////////////////////////////////
  return (
    <Card className="mb-6 border !border-border bg-background rounded-xl shadow-sm transition-transform duration-150 hover:shadow-lg hover:-translate-y-1">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-[72px] w-[72px]">
              <AvatarImage src={(consultation.lawyerId as ILawyer)?.profilePicture} />
              <AvatarFallback className="uppercase text-xl">
                {(consultation.lawyerId as ILawyer)?.firstname?.[0] || "L"}
                {(consultation.lawyerId as ILawyer)?.lastname?.[0] || "L"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-lg font-semibold text-foreground capitalize">
                {(consultation.lawyerId as ILawyer)?.firstname} {(consultation.lawyerId as ILawyer)?.lastname}
              </div>
              <div className="flex gap-2 mt-1">
                <Hint label="Specialization">
                  <Tag className="h-4 w-4 text-primary cursor-pointer" />
                </Hint>
                <span className="text-xs text-muted-foreground">
                  {(consultation.lawyerId as ILawyer)?.specializations?.[0] || "General Law"}
                </span>
                <Hint label="City">
                  <MapPin className="h-4 w-4 text-primary cursor-pointer" />
                </Hint>
                <span className="text-xs text-muted-foreground">
                  {(consultation.lawyerId as ILawyer)?.location?.city || "Not specified"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {getStatusBadge()}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Hint label="Date">
                <Calendar className="h-4 w-4" />
              </Hint>
              {consultation.scheduledDate ? format(new Date(consultation.scheduledDate), "dd MMM yyyy") : "Date"}
              <Hint label="Time">
                <Clock className="h-4 w-4 ml-2" />
              </Hint>
              {consultation.scheduledDate ? format(new Date(consultation.scheduledDate), "hh:mm a") : "Time"}
              <Hint label="Fee">
                <CreditCard className="h-4 w-4 ml-2" />
              </Hint>
              {/* PKR {consultation.fee?.toLocaleString() || (consultation.lawyerId as Lawyer)?.fee?.toLocaleString() || "-"} */}
            </div>
          </div>
        </div>
        {/* Case Description */}
        {consultation.description && (
          <div className="text-sm text-foreground/90 mt-2">
            {consultation.description.length > 120
              ? `${consultation.description.slice(0, 120)}...`
              : consultation.description}
          </div>
        )}
        {/* Case Brief */}
        {consultation.notes?.[0] && (
          <div className="text-muted-foreground text-sm italic truncate max-w-full">
            {`"${consultation.notes?.[0]}"`}
          </div>
        )}
        {/* Feedback */}
        {consultation.status === ConsultationStatus.COMPLETED && consultation.rating && (
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${star <= consultation.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
              />
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2 pt-2">
        {consultation.status === ConsultationStatus.PENDING && (
          <Button size="sm" variant="outline"><Link href={"/client/messages"}>Chat with Lawyer</Link></Button>
        )}
        {consultation.status === ConsultationStatus.SCHEDULED && (
          <>
            <Button variant="outline" size="sm">Reschedule</Button>
            <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10" onClick={handleCancel}>
              Cancel
            </Button>
          </>
        )}
        {consultation.status === ConsultationStatus.COMPLETED && !consultation.rating && (
          <Button size="sm">Give Feedback</Button>
        )}
        {consultation.status === ConsultationStatus.CANCELLED && (
          <Button size="sm">Rebook</Button>
        )}
        {consultation.status === ConsultationStatus.COMPLETED && (
          <Button variant="outline" size="sm">View Summary</Button>
        )}
      </CardFooter>
    </Card>
  );
}
