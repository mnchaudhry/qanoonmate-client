"use client";

import { Consultation } from "@/store/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { FileText, ExternalLink } from "lucide-react";
import { ConsultationStatus } from "@/lib/enums";
import { ILawyer } from "@/store/types/lawyer.types";

interface ConsultationSummaryProps {
  consultation: Consultation;
}

export default function ConsultationSummary({ consultation }: ConsultationSummaryProps) {
  // Format date
  const formattedDate = consultation.scheduledDate
    ? format(new Date(consultation.scheduledDate), "MMMM d, yyyy")
    : "Date not available";

  // Format time
  const formattedTime = consultation.scheduledDate
    ? format(new Date(consultation.scheduledDate), "hh:mm a") + " - " +
    format(new Date(new Date(consultation.scheduledDate).getTime() + (consultation.duration || 30) * 60000), "hh:mm a")
    : "Time not available";


  return (
    <Card className="mb-6">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="text-lg flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Consultation Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="mb-2">
              <span className="font-medium">Lawyer:</span>{" "}
              {(consultation.lawyerId as ILawyer)?.firstname} {((consultation.lawyerId as ILawyer))?.lastname}
            </p>
            <p className="mb-2">
              <span className="font-medium">Field:</span>{" "}
              {((consultation.lawyerId as ILawyer))?.specializations?.[0] || "Not specified"}
            </p>
            <p className="mb-2">
              <span className="font-medium">Date:</span>{" "}
              {formattedDate}
            </p>
          </div>
          <div>
            <p className="mb-2">
              <span className="font-medium">Time:</span>{" "}
              {formattedTime}
            </p>
            <p className="mb-2">
              <span className="font-medium">Status:</span>{" "}
              <span className={`
                ${consultation.status === ConsultationStatus.COMPLETED ? "text-green-600" :
                  consultation.status === ConsultationStatus.SCHEDULED ? "text-blue-600" :
                    consultation.status === ConsultationStatus.CANCELLED ? "text-red-600" : "text-amber-600"}
                font-medium
              `}>
                {consultation.status}
              </span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
