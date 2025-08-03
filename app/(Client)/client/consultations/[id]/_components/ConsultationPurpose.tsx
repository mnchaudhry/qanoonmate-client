"use client";

import { Consultation } from "@/store/types/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

interface ConsultationPurposeProps {
  consultation: Consultation;
}

export default function ConsultationPurpose({ consultation }: ConsultationPurposeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(consultation.description || "");

  const handleSave = () => {
    // Here you would dispatch an action to save the updated notes
    // dispatch(updateConsultationNotes({ id: consultation._id, notes }));
    setIsEditing(false);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="bg-gray-50 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Purpose of Consultation
          </CardTitle>

          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="text-blue-600"
            >
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
              placeholder="Describe the purpose of your consultation..."
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setNotes(consultation.description || "");
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-gray-700">
            {notes || "No consultation purpose specified."}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
