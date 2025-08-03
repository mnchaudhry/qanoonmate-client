"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Lawyer } from "@/store/types/lawyer.types";


export default function LawyerBanner({ lawyer }: { lawyer: Lawyer }) {
  return (
    <div className="rounded-lg border border-gray-200 shadow-md p-6 bg-white">
      <div className="flex flex-col md:flex-row items-start gap-6">
        {/* Profile Picture */}
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20">
          <Image
            src={lawyer.profilePicture || "/placeholder-lawyer.jpg"}
            alt={`${lawyer.firstname} ${lawyer.lastname}`}
            fill
            className="object-cover"
          />
        </div>

        {/* Lawyer Info */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              {/* Name and Verified Badge */}
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{lawyer.firstname} {lawyer.lastname}</h1>
                {lawyer.isVerified && (
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Verified
                  </Badge>
                )}
              </div>

              {/* Title */}
              {lawyer.title && (
                <p className="text-lg text-gray-600 mt-1">{lawyer.title}</p>
              )}

              {/* Specializations */}
              <div className="mt-2 flex flex-wrap gap-2">
                {lawyer.specializations?.map((specialization) => (
                  <Badge key={specialization} variant="secondary" className="text-xs">
                    {specialization}
                  </Badge>
                ))}
              </div>

              {/* Location and Languages */}
              <div className="mt-4 flex flex-col md:flex-row gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">{lawyer.location?.city}, {lawyer.location?.province}</span>
                </div>
                <div className="hidden md:block">|</div>
                <div>
                  <span className="font-medium">
                    Languages: {lawyer.languages?.join(", ") || "English"}
                  </span>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-md">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold">{lawyer.avgRating || 0}</span>
              <span className="text-gray-500">|</span>
              <span className="text-sm text-gray-500">{lawyer.reviews?.length || 0} Reviews</span>
            </div>
          </div>

          {/* Book Consultation Button */}
          <div className="mt-6">
            <Button size="lg" className="font-semibold">
              Book Consultation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
