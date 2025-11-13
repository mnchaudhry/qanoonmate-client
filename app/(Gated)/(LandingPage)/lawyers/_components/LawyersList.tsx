import React, { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Star, Clock, Globe, DollarSign, Calendar, BadgeCheck } from "lucide-react";
import Link from "next/link";
import { ILawyer } from "@/store/types/lawyer.types";
import { enumToLabel } from "@/lib/utils";

interface Props {
    lawyers: ILawyer[];
    currentPage: number;
    totalPages: number;
    totalCount: number;
    onPageChange: (page: number) => void;
    itemsPerPage: number;
    onSpecializationClick?: (specialization: string) => void;
}

export const LawyersList = ({ lawyers, onSpecializationClick }: Props) => {

    /////////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////////////
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

    const getAvailabilityStatus = (lawyer: ILawyer) => {
        const settings = typeof lawyer?.settings === 'object' ? lawyer?.settings : null;
        if (!settings?.availability || settings.availability.length === 0) return "Not Available";

        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const todayAvailability = settings.availability.find(a => a.day.toLowerCase() === today);

        if (todayAvailability && todayAvailability.isAvailable && todayAvailability.timeSlots.length > 0) {
            return "Available Today";
        }

        // Check if available on any other day
        const hasAvailability = settings.availability.some(a => a.isAvailable && a.timeSlots.length > 0);
        return hasAvailability ? "Available" : "Not Available";
    };

    /////////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////////
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
        <div className="space-y-6">
            {lawyers.map((lawyer) => (
                <Card key={lawyer?._id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start space-x-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={lawyer?.profilePicture} alt={`${lawyer?.firstname} ${lawyer?.lastname}`} />
                                    <AvatarFallback>
                                        {lawyer?.firstname.charAt(0)}{lawyer?.lastname.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-xl font-semibold text-foreground">
                                            {lawyer?.firstname} {lawyer?.lastname}
                                        </h3>
                                        {lawyer?.identityVerified && (
                                            <Badge variant="default" className="text-xs">
                                                <BadgeCheck className="h-3 w-3 mr-1" />
                                                Verified
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4" />
                                        <span>{enumToLabel(lawyer?.location?.city || '')}, {enumToLabel(lawyer?.location?.province || '')}</span>
                                    </div>

                                    <div className="flex items-center space-x-2 mb-3">
                                        <div className="flex">
                                            {renderStars(lawyer?.avgRating || 0)}
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            ({lawyer?.avgRating?.toFixed(1) || 'N/A'})
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {lawyer?.specializations?.slice(0, 3).map((spec: string) => (
                                            <Badge
                                                key={spec}
                                                variant="secondary"
                                                className={`text-xs ${onSpecializationClick ? 'cursor-pointer hover:underline hover:bg-secondary/80 transition-colors' : ''}`}
                                                onClick={onSpecializationClick ? () => onSpecializationClick(spec) : undefined}
                                            >
                                                {enumToLabel(spec || '')}
                                            </Badge>
                                        ))}
                                        {lawyer?.specializations && lawyer?.specializations.length > 3 && (
                                            <Badge variant="outline" className="text-xs">
                                                +{lawyer?.specializations.length - 3} more
                                            </Badge>
                                        )}
                                    </div>

                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                        {lawyer?.bio || "No bio available"}
                                    </p>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-muted-foreground">
                                        <div className="flex items-center space-x-1">
                                            <Clock className="h-3 w-3" />
                                            <span>{lawyer?.preLicensedYearsOfExperience || 0} years exp</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Globe className="h-3 w-3" />
                                            <span>{lawyer?.languages?.map((lang: string) => enumToLabel(lang || '')).join(", ") || "English"}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <DollarSign className="h-3 w-3" />
                                            <span>Rs {lawyer?.hourlyRate}</span>
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
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 shrink-0">
                                <Button asChild size="sm" className="flex items-center gap-2">
                                    <Link href={`/lawyers/${lawyer?.username}`}>
                                        View Profile
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="sm" className="flex items-center gap-2">
                                    <Link href={`/lawyers/${lawyer?.username}/book`}>
                                        Book Consultation
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
