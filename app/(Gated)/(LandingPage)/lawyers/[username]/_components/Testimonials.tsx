"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Star, User, Edit } from "lucide-react";
import { LawyerProfile } from "@/lib/types/profile.types";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface TestimonialsProps {
  lawyer: LawyerProfile;
}

export function Testimonials({ lawyer }: TestimonialsProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const isOwnProfile = user?.email === lawyer.personalInfo.email;
  const testimonials = lawyer.portfolio.testimonials;

  if (testimonials.length === 0) {
    return (
      <Card className="border-gray-100 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between text-lg font-semibold">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gray-600" />
              Client Testimonials
            </div>
            {isOwnProfile && (
              <Edit className="w-4 h-4 text-gray-400 cursor-pointer hover:text-primary" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Reviews Yet
            </h3>
            <p className="text-gray-600 max-w-md mx-auto text-sm">
              This lawyer hasn&apos;t received any client reviews yet. Be the first to share your experience!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const averageRating = testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;
  const ratingCount = testimonials.length;

  return (
    <Card className="border-gray-100 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <MessageSquare className="w-4 h-4 text-gray-600" />
          Client Testimonials
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rating Summary */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="flex items-center gap-1 mb-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl font-semibold text-gray-900">
                  {averageRating.toFixed(1)}
                </span>
              </div>
              <p className="text-xs text-gray-500">Average Rating</p>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-900">{ratingCount} Reviews</span>
                <Badge variant="secondary" className="text-xs">
                  {testimonials.filter(t => t.verified).length} Verified
                </Badge>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3 h-3 ${star <= Math.round(averageRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Individual Testimonials */}
        <div className="space-y-4">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 text-sm">
                      {testimonial.clientName}
                    </h5>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {testimonial.clientType === 'individual' ? 'Individual' : 'Corporate'}
                      </Badge>
                      {testimonial.verified && (
                        <Badge variant="secondary" className="text-xs bg-green-50 text-green-700">
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${star <= testimonial.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                          }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(testimonial.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                &quot;{testimonial.comment}&quot;
              </p>
            </div>
          ))}
        </div>

        {/* View All Reviews */}
        {testimonials.length > 3 && (
          <div className="text-center pt-4 border-t border-gray-100">
            <button className="text-sm text-primary hover:text-primary/80 font-medium">
              View All {testimonials.length} Reviews
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
