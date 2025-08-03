"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from "lucide-react";

interface ReviewTextAreaProps {
  review: string;
  setReview: (review: string) => void;
}

export default function ReviewTextArea({ review, setReview }: ReviewTextAreaProps) {
  const MIN_LENGTH = 10;
  const MAX_LENGTH = 500;
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_LENGTH) {
      setReview(value);
    }
  };
  
  return (
    <Card className="mb-6">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="text-lg flex items-center">
          <MessageSquare className="mr-2 h-5 w-5" />
          Write Your Review
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Textarea
          value={review}
          onChange={handleChange}
          placeholder="Share your experience with the lawyer during the consultation. What was helpful? What could have been improved? Your review helps other users make informed decisions."
          className="min-h-[150px] resize-none"
        />
        <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
          <span>
            {review.length < MIN_LENGTH && review.length > 0 ? (
              <span className="text-amber-500">
                {`At least ${MIN_LENGTH} characters required (${review.length}/${MIN_LENGTH})`}
              </span>
            ) : (
              <span>Minimum: {MIN_LENGTH} characters</span>
            )}
          </span>
          <span className={review.length > MAX_LENGTH - 50 ? "text-amber-500" : ""}>
            {review.length}/{MAX_LENGTH}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
