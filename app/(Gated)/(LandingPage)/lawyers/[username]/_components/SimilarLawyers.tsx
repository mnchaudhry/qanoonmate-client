"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Star, ArrowRight, Loader2 } from "lucide-react";
import { AppDispatch, RootState } from "@/store/store";
import { getSimilarLawyers } from "@/store/reducers/lawyerSlice";
import { ILawyer } from "@/store/types/lawyer.types";
import { enumToLabel } from "@/lib/utils";

interface SimilarLawyersProps {
  lawyerId: string;
}

export function SimilarLawyers({ lawyerId }: SimilarLawyersProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { similarLawyers, isLoading, error } = useSelector((state: RootState) => state.lawyer);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (lawyerId && !hasFetched) {
      dispatch(getSimilarLawyers({
        lawyerId,
        params: { limit: 3 }
      }));
      setHasFetched(true);
    }
  }, [dispatch, lawyerId, hasFetched]);

  const getLowestPrice = (lawyer: ILawyer) => {
    return `Starting from ${lawyer.hourlyRate} PKR`;
  };

  const getAverageRating = (lawyer: ILawyer) => {
    if (!lawyer.reviews?.length) return 0;
    const totalRating = lawyer.reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / lawyer.reviews.length;
  };

  if (isLoading) {
    return (
      <Card className="border-gray-100 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Users className="w-4 h-4 text-gray-600" />
            Similar Lawyers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2 text-sm text-gray-600">Loading similar lawyers...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-gray-100 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Users className="w-4 h-4 text-gray-600" />
            Similar Lawyers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Unable to Load Similar Lawyers
            </h3>
            <p className="text-gray-600 max-w-md mx-auto text-sm">
              We couldn&apos;t find similar lawyers at the moment. Please try again later.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!similarLawyers || similarLawyers.length === 0) {
    return (
      <Card className="border-gray-100 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Users className="w-4 h-4 text-gray-600" />
            Similar Lawyers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Similar Lawyers Found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto text-sm">
              We couldn&apos;t find any lawyers with similar specializations and experience in your area.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-100 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Users className="w-4 h-4 text-gray-600" />
          Similar Lawyers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 mb-4">
          Discover other lawyers with similar specializations and experience in your area.
        </p>

        <div className="space-y-3">
          {similarLawyers.map((lawyer) => {
            const averageRating = getAverageRating(lawyer);
            const reviewCount = lawyer.reviews?.length || 0;
            const primarySpecialization = lawyer.primarySpecialization || lawyer.specializations?.[0] || "General Law";

            return (
              <div key={lawyer._id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm mb-1">
                      {lawyer.firstname} {lawyer.lastname}
                    </h4>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                        {enumToLabel(primarySpecialization)}
                      </Badge>
                      {averageRating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-600">{averageRating.toFixed(1)}</span>
                          <span className="text-xs text-gray-500">({reviewCount})</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>
                          {lawyer.location?.city}, {lawyer.location?.province}
                        </span>
                      </div>
                      <span>{lawyer.preLicensedYearsOfExperience || 0}+ years</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={() => window.open(`/lawyers/${lawyer.username}`, '_blank')}
                  >
                    View Profile
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-primary">
                    {getLowestPrice(lawyer)}
                  </span>
                  <Button
                    size="sm"
                    className="text-xs bg-primary hover:bg-primary/90 text-white"
                    onClick={() => window.open(`/lawyers/${lawyer.username}/book`, '_blank')}
                  >
                    Book Consultation
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-gray-100">
          <Button
            variant="outline"
            className="w-full text-sm"
            onClick={() => window.open('/lawyers', '_blank')}
          >
            View All Similar Lawyers
            <ArrowRight className="w-3.5 h-3.5 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
