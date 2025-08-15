"use client";

import React, { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Star, Clock, Globe, DollarSign, Calendar, BadgeCheck } from "lucide-react";
import Link from "next/link";
import { Lawyer } from "@/store/types/lawyer.types";
import { ConsultationMode } from "@/lib/enums";

interface LawyerGridProps {
  lawyers: Lawyer[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onSpecializationClick?: (specialization: string) => void;
}

export const LawyerGrid: React.FC<LawyerGridProps> = ({ lawyers, onSpecializationClick }) => {
  

  /////////////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////////////
  const renderStars = (rating: number) => {
    const stars: ReactNode[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }

    return stars;
  };

  const getAvailabilityStatus = (lawyer: Lawyer) => {
    if (!lawyer.settings?.availability || lawyer.settings.availability.length === 0) return "Not Available";

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayAvailability = lawyer.settings.availability.find(a => a.day === today);

    if (
      todayAvailability &&
      Array.isArray(todayAvailability.timeSlots) &&
      todayAvailability.timeSlots.some((slot: any) => typeof slot === 'object' && 'is_available' in slot && slot.is_available)
    ) {
      return "Available Today";
    }

    return "Available";
  };

  const getConsultationFee = (lawyer: Lawyer) => {
    return lawyer.settings?.consultation?.fees?.find(f => f.mode === ConsultationMode.VIDEO_CALL)?.amount || 3000;
  };

  /////////////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////////
    if (!lawyers || lawyers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground text-6xl mb-4">⚖️</div>
        <h3 className="text-xl font-semibold mb-2">No lawyers found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search criteria or filters to find more results.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lawyers.map((lawyer) => (
        <Card key={lawyer._id} className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-start space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={lawyer.profilePicture} alt={`${lawyer.firstname} ${lawyer.lastname}`} />
                <AvatarFallback>
                  {lawyer.firstname.charAt(0)}{lawyer.lastname.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground truncate">
                    {lawyer.firstname} {lawyer.lastname}
                  </h3>
                  {lawyer.identityVerified && (
                    <Badge variant="default" className="text-xs">
                      <BadgeCheck className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{lawyer.location?.city}, {lawyer.location?.province}</span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 space-y-4">
            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex">
                {renderStars(lawyer.avgRating || 0)}
              </div>
              <span className="text-sm text-muted-foreground">
                ({lawyer.avgRating?.toFixed(1) || 'N/A'})
              </span>
            </div>

            {/* Specializations */}
            <div className="flex flex-wrap gap-1">
              {lawyer.specializations?.slice(0, 2).map((spec) => (
                <Badge
                  key={spec}
                  variant="secondary"
                  className={`text-xs ${onSpecializationClick ? 'cursor-pointer hover:underline hover:bg-secondary/80 transition-colors' : ''}`}
                  onClick={onSpecializationClick ? () => onSpecializationClick(spec) : undefined}
                >
                  {spec.replace(/_/g, ' ')}
                </Badge>
              ))}
              {lawyer.specializations && lawyer.specializations.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{lawyer.specializations.length - 2} more
                </Badge>
              )}
            </div>

            {/* Bio */}
            <p className="text-sm text-muted-foreground line-clamp-2">
              {lawyer.bio || "No bio available"}
            </p>

            {/* Details */}
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{lawyer.experience || 0} years exp</span>
              </div>
              <div className="flex items-center space-x-1">
                <Globe className="h-3 w-3" />
                <span>{lawyer.languages?.join(", ") || "English"}</span>
              </div>
              <div className="flex items-center space-x-1">
                <DollarSign className="h-3 w-3" />
                <span>Rs {getConsultationFee(lawyer)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span className={`${getAvailabilityStatus(lawyer) === "Available Today"
                  ? "text-green-600"
                  : "text-muted-foreground"
                  }`}>
                  {getAvailabilityStatus(lawyer)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2 pt-2">
              <Button asChild size="sm" className="flex-1">
                <Link href={`/lawyers/${lawyer.username}`}>
                  View Profile
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link href={`/lawyers/${lawyer.username}/book`}>
                  Book Consultation
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};