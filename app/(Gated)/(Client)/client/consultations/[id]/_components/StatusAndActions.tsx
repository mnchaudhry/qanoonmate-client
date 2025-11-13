"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, RefreshCw, Video } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { cancelConsultation } from "@/store/reducers/consultationSlice";
import { ConsultationStatus } from "@/lib/enums";
import { IConsultation } from "@/store/types/consultation.types";

interface StatusAndActionsProps {
  consultation: IConsultation;
}

export default function StatusAndActions({ consultation }: StatusAndActionsProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [cancelReason, setCancelReason] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Determine the status of each step in the timeline
  const getStepStatus = (step: string) => {
    const status = consultation.status;

    if (step === 'Requested') {
      return "completed";
    } else if (step === 'Accepted') {
      if (status === ConsultationStatus.SCHEDULED || status === ConsultationStatus.COMPLETED || status === ConsultationStatus.RESCHEDULED) {
        return "completed";
      }
      return "pending";
    } else if (step === 'Scheduled') {
      if (status === ConsultationStatus.COMPLETED) {
        return "completed";
      } else if (status === ConsultationStatus.SCHEDULED || status === ConsultationStatus.RESCHEDULED) {
        return "current";
      }
      return "pending";
    } else if (step === 'Completed') {
      if (status === ConsultationStatus.COMPLETED) {
        return "completed";
      }
      return "pending";
    }
    return "pending";
  };

  // Get step icon based on status
  const getStepIcon = (step: string) => {
    const stepStatus = getStepStatus(step);

    if (stepStatus === "completed") {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (stepStatus === "current") {
      return <Clock className="h-5 w-5 text-amber-500" />;
    } else if (consultation.status === ConsultationStatus.CANCELLED) {
      return <XCircle className="h-5 w-5 text-red-500" />;
    } else {
      return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
    }
  };

  // Handle consultation cancellation
  const handleCancelConsultation = () => {
    if (!cancelReason.trim()) {
      alert("Please provide a reason for cancellation");
      return;
    }

    dispatch(cancelConsultation({
      id: consultation._id || "",
      reason: cancelReason,
    }));

    setIsDialogOpen(false);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="text-lg flex items-center">
          <RefreshCw className="mr-2 h-5 w-5" />
          Consultation Status & Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-6">
          <h4 className="font-medium mb-3">Status Timeline:</h4>
          <div className="flex flex-wrap justify-between relative">
            <div className="absolute top-3 left-[15px] right-[15px] h-1 bg-gray-200 -z-10"></div>

            {['Requested', 'Accepted', 'Scheduled', 'Completed'].map((step) => (
              <div key={step} className="flex flex-col items-center w-1/4 px-2">
                <div className={`flex items-center justify-center rounded-full mb-2 ${getStepStatus(step) === "completed" ? "bg-green-100" :
                  getStepStatus(step) === "current" ? "bg-amber-100" :
                    "bg-gray-100"
                  }`}>
                  {getStepIcon(step)}
                </div>
                <span className="text-xs text-center">{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {consultation.status === ConsultationStatus.SCHEDULED && (
            <Button className="bg-green-600 hover:bg-green-700">
              <Video className="h-4 w-4 mr-2" />
              Join Meeting
            </Button>
          )}

          {consultation.status === ConsultationStatus.SCHEDULED && (
            <>
              <Button variant="outline">
                Reschedule
              </Button>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                    Cancel Request
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cancel Consultation</DialogTitle>
                    <DialogDescription>
                      Please provide a reason for cancellation. This will be shared with the lawyer.
                    </DialogDescription>
                  </DialogHeader>
                  <Textarea
                    placeholder="Reason for cancellation..."
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Back
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleCancelConsultation}
                    >
                      Cancel Consultation
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
