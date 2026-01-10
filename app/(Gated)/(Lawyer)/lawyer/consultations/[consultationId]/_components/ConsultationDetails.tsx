"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IConsultation } from "@/store/types/consultation.types";
import { FileText, MessageSquare } from "lucide-react";

interface ConsultationDetailsProps {
  consultation: IConsultation;
}

export default function ConsultationDetails({ consultation }: ConsultationDetailsProps) {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Consultation Details</CardTitle>
        <CardDescription className="text-muted-foreground">
          Information about this consultation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Description */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            <h3 className="font-medium text-foreground">Client&apos;s Request</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {consultation.description || "No description provided"}
          </p>
        </div>

        {/* Client Notes */}
        {consultation.clientNotes && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-primary" />
              <h3 className="font-medium text-foreground">Client Notes</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {consultation.clientNotes}
            </p>
          </div>
        )}

        {/* Lawyer Notes */}
        {consultation.lawyerNotes && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-primary" />
              <h3 className="font-medium text-foreground">Your Notes</h3>
            </div>
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm text-foreground leading-relaxed">
                {consultation.lawyerNotes}
              </p>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Consultation Type</p>
            <p className="text-sm font-medium text-foreground capitalize">
              {consultation.type.replace(/_/g, ' ')}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Duration</p>
            <p className="text-sm font-medium text-foreground">
              {consultation.duration} minutes
            </p>
          </div>
          {consultation.isFollowUp && (
            <div className="col-span-2">
              <p className="text-xs text-muted-foreground mb-1">Follow-up Consultation</p>
              <p className="text-sm font-medium text-primary">
                This is a follow-up consultation
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
