"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin, Clock, Shield, MessageCircle, Calendar, DollarSign, CheckCircle } from "lucide-react";
import { LawyerProfile } from "@/lib/types/profile.types";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { PlaceholderLawyer } from "@/constants/images";
import { enumToLabel } from "@/lib/utils";

interface LawyerProfileHeaderProps {
  lawyer: LawyerProfile;
}

export function LawyerProfileHeader({ lawyer }: LawyerProfileHeaderProps) {

  ////////////////////////////////////////////// VARIABLES //////////////////////////////////////////////
  const { user } = useSelector((state: RootState) => state.auth);
  const isOwnProfile = user?.email === lawyer.personalInfo.email;

  ////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////
  const getLowestPrice = () => {
    if (!lawyer.services.consultationFees.length) return null;
    const lowestPrice = Math.min(...lawyer.services.consultationFees.map(fee => fee.price));
    return lowestPrice;
  };

  const getVerificationBadge = () => {
    if (lawyer.verification.identityVerified && lawyer.verification.barCardVerified) {
      return (
        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
          <Shield className="w-3 h-3 mr-1" />
          Verified Lawyer
        </Badge>
      );
    } else if (lawyer.verification.identityVerified) {
      return (
        <Badge variant="secondary" className="bg-accent/50 text-accent-foreground border-accent text-xs">
          <Shield className="w-3 h-3 mr-1" />
          Identity Verified
        </Badge>
      );
    }
    return null;
  };

  const getExperienceBadge = () => {
    if (lawyer.professionalOverview.yearsOfExperience > 0) {
      return (
        <Badge variant="outline" className="border-border text-muted-foreground text-xs">
          {lawyer.professionalOverview.yearsOfExperience}+ Years Experience
        </Badge>
      );
    }
    return null;
  };
  
  ////////////////////////////////////////////// RENDER //////////////////////////////////////////////
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-shrink-0 flex justify-center lg:justify-start">
          <div className="relative w-24 h-24">
              <Avatar className="w-full h-full border-2 border-border shadow-sm relative ">
                <AvatarImage src={lawyer.personalInfo.profilePicture || PlaceholderLawyer} alt="Profile" />
                <AvatarFallback className="capitalize text-lg bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                  {lawyer.personalInfo.firstname[0]}{lawyer.personalInfo.lastname[0]}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-1 right-1">
                <div className="relative w-4 h-4 bg-primary border-2 border-background rounded-full"></div>
              </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                <div className="flex items-center justify-start gap-4">
                  <h1 className="capitalize text-2xl font-semibold text-foreground">
                    {lawyer.personalInfo.fullName}
                  </h1>
                  {/* Verification Prompt for Unverified Users */}
                  {!lawyer.verification.identityVerified && isOwnProfile && (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span className="text-sm text-primary underline cursor-pointer hover:text-primary/80">
                        Verify your Identity
                      </span>
                    </div>
                  )}
                </div>
                {getVerificationBadge()}
              </div>


              {/* Pricing Display */}
              {getLowestPrice() && (
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span className="text-lg font-semibold text-primary">
                    {getLowestPrice()?.toLocaleString()} PKR/hour
                  </span>
                </div>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{enumToLabel(lawyer.personalInfo.location.city)}, {enumToLabel(lawyer.personalInfo.location.province)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Responds within {lawyer.services.responseTime}</span>
                </div>
                {lawyer.verification.identityVerified && (
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Verified Identity</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {getExperienceBadge()}
                {lawyer.legalExpertise.primarySpecialization && (
                  <Badge variant="secondary" className="text-xs">
                    {enumToLabel(lawyer.legalExpertise.primarySpecialization)}
                  </Badge>
                )}
                {lawyer.legalExpertise.languages.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {lawyer.legalExpertise.languages.length} Languages
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center lg:items-end gap-4">
              <div className="text-center lg:text-right">
                <div className="flex items-center justify-center lg:justify-end gap-1.5 mb-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-base">4.8</span>
                  <span className="text-muted-foreground text-sm">(127 reviews)</span>
                </div>
                <p className="text-xs text-muted-foreground">Based on client feedback</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                  Send Message
                </Button>
                <Button size="sm" variant="outline">
                  <Calendar className="w-3.5 h-3.5 mr-1.5" />
                  Book Consultation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-xl font-semibold text-foreground">
              {lawyer.professionalOverview.yearsOfExperience}+
            </div>
            <div className="text-xs text-muted-foreground">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-foreground">
              {lawyer.portfolio.notableCases.length}+
            </div>
            <div className="text-xs text-muted-foreground">Cases Handled</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-foreground">
              {lawyer.legalExpertise.secondarySpecializations.length + 1}
            </div>
            <div className="text-xs text-muted-foreground">Specializations</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-foreground">
              {lawyer.legalExpertise.languages.length}
            </div>
            <div className="text-xs text-muted-foreground">Languages</div>
          </div>
        </div>
      </div>
      </CardContent>
    </Card>
  );
}
