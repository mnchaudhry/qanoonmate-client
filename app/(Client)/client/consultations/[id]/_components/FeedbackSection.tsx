"use client";

import { useState } from "react";
import { Consultation } from "@/store/types/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Edit2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { submitFeedback } from "@/store/reducers/consultationSlice";
import { ConsultationStatus } from "@/lib/enums";

interface FeedbackSectionProps {
  consultation: Consultation;
}

export default function FeedbackSection({ consultation }: FeedbackSectionProps) {

  //////////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>();

  //////////////////////////////////////////////////// STATES ////////////////////////////////////////////////////
  const [rating, setRating] = useState(consultation.rating || 0);
  const [feedback, setFeedback] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Only show if the consultation is completed
  if (consultation.status !== ConsultationStatus.COMPLETED) {
    return null;
  }

  // If there's no feedback yet, show a button to add feedback
  if (!consultation.notes && !consultation.rating) {
    return (
      <Card className="mb-6">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-lg flex items-center">
            <span className="mr-2">📝</span>
            Post-Consultation Feedback
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 text-center">
          <p className="mb-4">How was your consultation experience?</p>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Give Feedback</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rate Your Consultation</DialogTitle>
                <DialogDescription>
                  Share your experience with the lawyer to help others.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="flex items-center justify-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-8 w-8 cursor-pointer ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
                <Textarea
                  placeholder="Share your experience with the lawyer..."
                  className="min-h-[100px]"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <DialogFooter className="mt-4">
                  <Button
                    onClick={() => {
                      dispatch(submitFeedback({
                        id: consultation._id || "",
                        formData: { rating, feedback }
                      }));
                    }}
                  >
                    Submit Feedback
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    );
  }

  // Format submission date
  const submissionDate = consultation.updatedAt
    ? format(new Date(consultation.updatedAt), "dd MMMM yyyy")
    : "Recently";

  return (
    <Card className="mb-6">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="text-lg flex items-center">
          <span className="mr-2">📝</span>
          Post-Consultation Feedback
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-3 flex items-center">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${star <= (consultation.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="ml-2">– {consultation.rating?.toFixed(1) || 0}</span>
        </div>

        <p className="text-gray-700 mb-2 italic"><q>{consultation.notes || "No comment provided."}</q></p>
        <p className="text-sm text-gray-500">Submitted on: {submissionDate}</p>

        <div className="mt-4 flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Edit2 className="h-4 w-4 mr-1" />
                Edit Feedback
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Your Feedback</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <div className="flex items-center justify-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-8 w-8 cursor-pointer ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
                <Textarea
                  placeholder="Share your experience with the lawyer..."
                  className="min-h-[100px]"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <DialogFooter className="mt-4">
                  <Button
                    onClick={() => {
                      dispatch(submitFeedback({
                        id: consultation._id || "",
                        formData: { rating, feedback }
                      }));
                      setIsDialogOpen(false);
                    }}
                  >
                    Update Feedback
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="sm" className="text-red-600">
            <Trash2 className="h-4 w-4 mr-1" />
            Delete Review
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
