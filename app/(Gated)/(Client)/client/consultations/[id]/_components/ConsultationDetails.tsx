"use client";

import { Consultation } from "@/store/types/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { format } from "date-fns";
import { ConsultationStatus } from "@/lib/enums";
import { ILawyer } from "@/store/types/lawyer.types";

interface ConsultationDetailsProps {
  consultation: Consultation;
}

export default function ConsultationDetails({ consultation }: ConsultationDetailsProps) {
  // Format date and time
  const formattedDate = consultation.scheduledDate
    ? format(new Date(consultation.scheduledDate), "EEEE, dd MMMM")
    : "Date not available";

  const formattedTime = consultation.scheduledDate
    ? format(new Date(consultation.scheduledDate), "hh:mm") + " – " +
    format(
      new Date(new Date(consultation.scheduledDate).getTime() + (consultation.duration || 30) * 60000),
      "hh:mm a"
    )
    : "Time not available";


  return (
    <Card className="mb-6">
      <CardHeader className="bg-gray-50 border-b px-4 py-3">
        <div className="grid grid-cols-2">
          <div className="text-right">
            Platform: Office Location
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
          <div className="p-4">
            <p className="text-gray-600 font-medium mb-1">Scheduled Date:</p>
            <p>{formattedDate}</p>
          </div>
          <div className="p-4">
            <p className="text-gray-600 font-medium mb-1">Time Slot:</p>
            <p>{formattedTime}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x border-t">
          <div className="p-4">
            <p className="text-gray-600 font-medium mb-1">Duration:</p>
            <p>{consultation.duration || 30} Minutes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x border-t">
          <div className="p-4">
            <p className="text-gray-600 font-medium mb-1">Consultation Fee:</p>
            <p>Rs. {consultation.fee || "Not specified"}</p>
          </div>
          <div className="p-4">
            <p className="text-gray-600 font-medium mb-1">Payment Status:</p>
            <p>
              {consultation.status == ConsultationStatus.SCHEDULED ? (
                <span className="text-green-600">✅ Paid</span>
              ) : (
                <span className="text-red-600">❌ Unpaid</span>
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
