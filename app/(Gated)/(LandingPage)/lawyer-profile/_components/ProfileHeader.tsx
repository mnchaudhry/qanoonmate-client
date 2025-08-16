import React, { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Star, Calendar, Shield, Scale } from 'lucide-react';

interface Props {
    lawyer: any;
}

const ProfileHeader = ({ lawyer }: Props) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available':
                return 'bg-success-100 text-success-700 border-success-200';
            case 'busy':
                return 'bg-warning-100 text-warning-700 border-warning-200';
            case 'offline':
                return 'bg-secondary-100 text-secondary-700 border-secondary-200';
            default:
                return 'bg-secondary-100 text-secondary-700 border-secondary-200';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'available':
                return 'Available';
            case 'busy':
                return 'Busy';
            case 'offline':
                return 'Offline';
            default:
                return 'Unknown';
        }
    };

    const renderStars = (rating: number) => {
        const stars: ReactNode[] = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <Star key={i} className="w-5 h-5 fill-warning-400 text-warning-400" />
            );
        }

        if (hasHalfStar) {
            stars.push(
                <Star key="half" className="w-5 h-5 fill-warning-400/50 text-warning-400" />
            );
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <Star key={`empty-${i}`} className="w-5 h-5 text-secondary-300" />
            );
        }

        return stars;
    };

    return (
        <Card className="mx-6 mt-6 border-primary-200 shadow-lg">
            <CardContent className="p-8">
                <div className="flex items-start gap-6">
                    {/* Profile Picture */}
                    <div className="relative">
                        <Avatar className="w-32 h-32 ring-4 ring-primary-100">
                            <AvatarImage src={lawyer.profilePicture} alt={lawyer.name} />
                            <AvatarFallback className="text-2xl font-semibold bg-primary-100 text-primary-700">
                                {lawyer.name.split(' ').map((n: string) => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>

                        {/* Status Indicator */}
                        <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(lawyer.status)}`}>
                            {getStatusText(lawyer.status)}
                        </div>
                    </div>

                    {/* Main Info */}
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                            <h1 className="text-3xl font-bold text-primary-900">{lawyer.name}</h1>

                            {lawyer.identityVerified && (
                                <Badge className="bg-success-100 text-success-700 border-success-200 hover:bg-success-100">
                                    <Shield className="w-4 h-4 mr-1" />
                                    Verified
                                </Badge>
                            )}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center gap-1">
                                {renderStars(lawyer.rating)}
                            </div>
                            <span className="text-lg font-semibold text-primary-900">
                                {lawyer.rating.toFixed(1)}
                            </span>
                            <span className="text-secondary-600">
                                ({lawyer.reviewCount} reviews)
                            </span>
                        </div>

                        {/* Location and Experience */}
                        <div className="flex items-center gap-6 mb-4">
                            <div className="flex items-center gap-2 text-secondary-700">
                                <MapPin className="w-5 h-5" />
                                <span>{lawyer.city}, {lawyer.province}</span>
                            </div>
                            <div className="flex items-center gap-2 text-secondary-700">
                                <Calendar className="w-5 h-5" />
                                <span>{lawyer.experience} Years Experience</span>
                            </div>
                        </div>

                        {/* Specializations */}
                        <div className="mb-4">
                            <h3 className="text-sm font-medium text-secondary-700 mb-2">Specializations:</h3>
                            <div className="flex flex-wrap gap-2">
                                {lawyer.specializations.map((spec: string, index: number) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100"
                                    >
                                        {spec}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Bar Association and License */}
                        <div className="flex items-center gap-6 text-secondary-700">
                            <div className="flex items-center gap-2">
                                <Scale className="w-5 h-5" />
                                <span className="text-sm">Bar Association: {lawyer.barAssociation}</span>
                            </div>
                            <div className="text-sm">
                                License #: <span className="font-mono">{lawyer.licenseNumber}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProfileHeader;