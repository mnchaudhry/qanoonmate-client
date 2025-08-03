"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, User, Star } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

interface FeedbackItem {
  lawyerName: string;
  lawyerPhoto?: string;
  date: Date;
  rating: number;
  comment: string;
}

interface FeedbackHistoryProps {
  feedbackItems: FeedbackItem[];
}

export default function FeedbackHistory({ feedbackItems }: FeedbackHistoryProps) {
  // Function to render stars based on rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className="mb-6">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="flex items-center text-lg">
          <MessageSquare className="mr-2 h-5 w-5" />
          Feedback History
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {feedbackItems.length > 0 ? (
          <div className="space-y-4">
            {feedbackItems.map((item, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                    <div className="flex items-center mb-2 sm:mb-0">
                      {item.lawyerPhoto ? (
                        <div className="relative w-10 h-10 mr-3">
                          <Image
                            src={item.lawyerPhoto}
                            alt={item.lawyerName}
                            fill
                            className="rounded-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">
                          <span className="text-gray-600 text-sm">👤 Lawyer: </span>
                          {item.lawyerName}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span>📅 Date: </span>
                          {format(new Date(item.date), "d MMM yyyy")}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="text-gray-600 text-sm mr-2">🌟 Rating: </span>
                        {renderStars(item.rating)}
                      </div>
                    </div>
                  </div>
                  <div className="border-t pt-3">
                    <p className="text-gray-600 text-sm mb-1">🗨️ Your Comment:</p>
                    <p className="text-sm">{item.comment}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>You haven&apos;t provided any feedback yet.</p>
            <p className="text-sm mt-2">
              After completing a consultation, you can provide feedback to help improve our services.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
