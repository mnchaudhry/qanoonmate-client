"use client";

import { Consultation } from "@/store/types/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Video, Phone, MapPin } from "lucide-react";
import { ConsultationMode, ConsultationStatus } from "@/lib/enums";
import { Lawyer } from "@/store/types/lawyer.types";

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

  // Get consultation mode icon
  const getModeIcon = () => {
    switch (consultation.mode) {
      case ConsultationMode.VIDEO_CALL:
        return <Video className="h-5 w-5" />;
      case ConsultationMode.PHONE_CALL:
        return <Phone className="h-5 w-5" />;
      case ConsultationMode.IN_PERSON:
        return <MapPin className="h-5 w-5" />;
      default:
        return <Video className="h-5 w-5" />;
    }
  };

  // Get consultation mode display name
  const getModeName = () => {
    switch (consultation.mode) {
      case ConsultationMode.VIDEO_CALL:
        return "Video Call";
      case ConsultationMode.PHONE_CALL:
        return "Phone Call";
      case ConsultationMode.IN_PERSON:
        return "In-Person";
      default:
        return "Not specified";
    }
  };

  // Get platform based on mode
  const getPlatform = () => {
    switch (consultation.mode) {
      case ConsultationMode.VIDEO_CALL:
        return "Zoom";
      case ConsultationMode.PHONE_CALL:
        return consultation.type || "Phone";
      case ConsultationMode.IN_PERSON:
        return "Office Location";
      default:
        return "Not specified";
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="bg-gray-50 border-b px-4 py-3">
        <div className="grid grid-cols-2">
          <div className="flex items-center">
            <div className="mr-2">
              {getModeIcon()}
            </div>
            <CardTitle className="text-base">Consultation Type: {getModeName()}</CardTitle>
          </div>
          <div className="text-right">
            Platform: {getPlatform()}
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
          <div className="p-4">
            {consultation.mode === ConsultationMode.VIDEO_CALL && (
              <>
                <p className="text-gray-600 font-medium mb-1">Link:</p>
                <Button variant="outline" size="sm" className="text-blue-600">
                  Join Meeting
                </Button>
              </>
            )}
            {consultation.mode === ConsultationMode.PHONE_CALL && (
              <>
                <p className="text-gray-600 font-medium mb-1">Phone:</p>
                <p>{(consultation.lawyerId as Lawyer).phone || "+92-XXX-XXXXXXX"}</p>
              </>
            )}
            {consultation.mode === ConsultationMode.IN_PERSON && (
              <>
                <p className="text-gray-600 font-medium mb-1">Address:</p>
                <p>{(consultation.lawyerId as Lawyer).location?.city || "Office address"}</p>
              </>
            )}
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
