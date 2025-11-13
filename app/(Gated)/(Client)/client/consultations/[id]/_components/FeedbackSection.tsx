"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConsultationStatus } from "@/lib/enums";
import { IConsultation } from "@/store/types/consultation.types";

interface FeedbackSectionProps {
  consultation: IConsultation;
}

export default function FeedbackSection({ consultation }: FeedbackSectionProps) {

  //////////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////////

  // Only show if the consultation is completed
  if (consultation.status !== ConsultationStatus.COMPLETED) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="text-lg flex items-center">
          <span className="mr-2">📝</span>
          Post-Consultation Feedback
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-sm text-gray-500">Submitted on</p>


      </CardContent>
    </Card>
  );
}
