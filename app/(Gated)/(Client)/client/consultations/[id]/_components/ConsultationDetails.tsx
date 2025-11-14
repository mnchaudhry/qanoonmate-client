"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { format } from "date-fns";
import { ConsultationStatus } from "@/lib/enums";
import { IConsultation } from "@/store/types/consultation.types";

interface ConsultationDetailsProps {
  consultation: IConsultation;
}

export default function ConsultationDetails({ consultation }: ConsultationDetailsProps) {
  // Format date and time
  const formattedDate = consultation.scheduledDate
    ? format(new Date(consultation.scheduledDate), "EEEE, dd MMMM")
    : "Date not available";

  // Parse scheduledTime (24-hour format) and calculate end time
  const formattedTime = (() => {
    if (!consultation.scheduledTime) return "Time not available";
    
    const [hours, minutes] = consultation.scheduledTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    
    const endDate = new Date(startDate.getTime() + (consultation.duration || 30) * 60000);
    
    return `${consultation.scheduledTime} – ${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
  })();


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
