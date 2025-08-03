"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { Input } from "@/components/ui/input";

interface RatingSectionProps {
  rating: number;
  setRating: (rating: number) => void;
  feedbackAttributes: string[];
  setFeedbackAttributes: (attributes: string[]) => void;
  otherFeedback: string;
  setOtherFeedback: (feedback: string) => void;
}

export default function RatingSection({
  rating,
  setRating,
  feedbackAttributes,
  setFeedbackAttributes,
  otherFeedback,
  setOtherFeedback,
}: RatingSectionProps) {
  const [hoveredRating, setHoveredRating] = useState(0);

  // Predefined feedback options
  const feedbackOptions = [
    "Lawyer was knowledgeable",
    "Lawyer was respectful and professional",
    "Lawyer explained the matter clearly",
    "Consultation started on time",
    "Value for money",
  ];

  // Handle checkbox change
  const handleCheckboxChange = (option: string) => {
    if (feedbackAttributes.includes(option)) {
      setFeedbackAttributes(feedbackAttributes.filter((attr) => attr !== option));
    } else {
      setFeedbackAttributes([...feedbackAttributes, option]);
    }
  };

  // Handle "Other" checkbox
  const handleOtherCheckboxChange = () => {
    if (feedbackAttributes.includes("Other")) {
      setFeedbackAttributes(feedbackAttributes.filter((attr) => attr !== "Other"));
      setOtherFeedback("");
    } else {
      setFeedbackAttributes([...feedbackAttributes, "Other"]);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="text-lg flex items-center">
          <span className="mr-2">⭐</span>
          Rate Your Consultation Experience
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {/* Star Rating */}
        <div className="mb-6">
          <div className="flex items-center justify-center md:justify-start mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-8 w-8 cursor-pointer mr-1 ${
                  star <= (hoveredRating || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 text-center md:text-left">
            Hover to highlight, click to select
          </p>
        </div>

        {/* Feedback Checkboxes */}
        <div>
          <h3 className="font-medium flex items-center mb-3">
            <span className="mr-2">✔️</span>
            How was the consultation?
          </h3>
          <div className="space-y-3">
            {feedbackOptions.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`option-${option}`}
                  checked={feedbackAttributes.includes(option)}
                  onCheckedChange={() => handleCheckboxChange(option)}
                />
                <Label htmlFor={`option-${option}`} className="text-sm font-normal">
                  {option}
                </Label>
              </div>
            ))}

            <div className="flex items-start space-x-2">
              <Checkbox
                id="option-other"
                checked={feedbackAttributes.includes("Other")}
                onCheckedChange={handleOtherCheckboxChange}
                className="mt-2"
              />
              <div className="grid gap-1.5">
                <Label htmlFor="option-other" className="text-sm font-normal">
                  Other:
                </Label>
                <Input
                  id="other-feedback"
                  value={otherFeedback}
                  onChange={(e) => setOtherFeedback(e.target.value)}
                  placeholder="Please specify"
                  className={`w-full ${!feedbackAttributes.includes("Other") && "opacity-50"}`}
                  disabled={!feedbackAttributes.includes("Other")}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
