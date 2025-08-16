"use client";

import { Button } from "@/components/ui/button";
import { Lawyer } from "@/store/types/lawyer.types";
import { Star } from "lucide-react";

export default function ReviewsSection({ lawyer }: { lawyer: Lawyer }) {



  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
        />
      ));
  };

  return (
    <div className="rounded-lg border border-gray-200 shadow-sm p-6 bg-white">

      <h2 className="text-xl font-bold mb-4">Reviews</h2>

      {/* Overall Rating */}
      {
        lawyer.reviews && lawyer.reviews.length > 0 &&
        <div className="flex items-center mb-6">
          <div className="flex items-center gap-1 mr-2">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="font-bold text-lg">{lawyer.avgRating || 0}</span>
          </div>
          <span className="text-gray-500">from {lawyer.reviews?.length || 0} clients</span>
        </div>
      }

      {/* Review Cards */}
      <div className="space-y-4">
        {lawyer.reviews && lawyer.reviews.length > 0 ? (
          lawyer.reviews.map((review) => (
            <div
              key={review._id}
              className="border border-gray-100 rounded-lg p-4 bg-gray-50"
            >
              <div className="flex items-center gap-1 mb-2">
                {renderStars(review.rating)}
              </div>
              <p className="text-gray-700 text-sm mb-2">{`"${review.comment || 'Great service!'}"`}</p>
              <p className="text-gray-500 text-sm text-right">– {review.reviewer}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No reviews yet.</p>
        )}
      </div>

      {/* View All Reviews Button */}
      <div className="mt-6 text-center">
        <Button variant="outline">
          View All Reviews
        </Button>
      </div>
    </div>
  );
}
