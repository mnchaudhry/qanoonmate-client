"use client";

import { Consultation } from "@/store/types/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import Link from "next/link";
import { Lawyer } from "@/store/types/lawyer.types";

interface LawyerInformationProps {
  consultation: Consultation;
}

export default function LawyerInformation({ consultation }: LawyerInformationProps) {
  const lawyer = consultation.lawyerId as Lawyer;

  if (!lawyer) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">👤 Lawyer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Lawyer information not available</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate average rating if available
  const avgRating = lawyer.avgRating || 0;
  const reviewCount = lawyer.reviews?.length || 0;

  return (
    <Card className="mb-6">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="text-lg flex items-center">
          <span className="mr-2">👤</span>
          Lawyer Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 font-medium mb-1">Name:</p>
              <p>{lawyer.firstname} {lawyer.lastname}</p>
            </div>
            <div>
              <p className="text-gray-600 font-medium mb-1">Specialization:</p>
              <p>{lawyer.specializations?.join(', ') || "Not specified"}</p>
            </div>
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 font-medium mb-1">Experience:</p>
              <p>{lawyer.experience ? `${lawyer.experience}+ years` : "Not specified"}</p>
            </div>
            <div>
              <p className="text-gray-600 font-medium mb-1">Location:</p>
              <p>{lawyer?.location?.city || "Not specified"}
                {(lawyer?.location?.province) &&
                  `, ${lawyer?.location?.province}`}
              </p>
            </div>
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 font-medium mb-1">Language:</p>
              <p>{lawyer.preferredLanguage || "Not specified"}
                {lawyer.languages && lawyer.languages.length > 0 &&
                  `, ${lawyer.languages.join(', ')}`}
              </p>
            </div>
            <div>
              <p className="text-gray-600 font-medium mb-1">Profile:</p>
              <Link href={`/lawyers/${lawyer._id}`} passHref>
                <Button variant="link" className="p-0 h-auto text-blue-600">
                  View Profile →
                </Button>
              </Link>
            </div>
          </div>

          <div className="p-4">
            <p className="text-gray-600 font-medium mb-1">Rating:</p>
            <div className="flex items-center">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${star <= Math.round(avgRating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                      }`}
                  />
                ))}
              </div>
              <span className="ml-2">
                ({avgRating.toFixed(1)} based on {reviewCount} {reviewCount === 1 ? "review" : "reviews"})
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
