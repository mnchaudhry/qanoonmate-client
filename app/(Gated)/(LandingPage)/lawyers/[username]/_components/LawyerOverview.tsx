"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Clock, Shield, Edit } from "lucide-react";
import { LawyerProfile } from "@/lib/types/profile.types";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEditModal } from "./edit/EditModalContext";
import { EditOverviewModal } from "./edit/EditOverviewModal";

interface LawyerOverviewProps {
  lawyer: LawyerProfile;
}

export function LawyerOverview({ lawyer }: LawyerOverviewProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const isOwnProfile = user?.email === lawyer.personalInfo.email;
  const { isOverviewModalOpen, openOverviewModal, closeAllModals } = useEditModal();

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg font-semibold">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            About {lawyer.personalInfo.firstname}
          </div>
          {isOwnProfile && (
            <Edit 
              className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" 
              onClick={openOverviewModal}
            />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Professional Title */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {lawyer.professionalOverview.title}
          </h3>
          {lawyer.professionalOverview.tagline && (
            <p className="text-muted-foreground italic text-sm mb-3">
              {`"${lawyer.professionalOverview.tagline}"`}
            </p>
          )}
        </div>

        {/* Bio */}
        <div className="prose max-w-none">
          <p className="text-muted-foreground leading-relaxed text-sm">
            {lawyer.professionalOverview.bio}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-foreground text-sm">Practice Areas</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default" className="bg-primary text-primary-foreground text-xs">
                {lawyer.legalExpertise.primarySpecialization.replace('_', ' ')}
              </Badge>
              {lawyer.legalExpertise.secondarySpecializations.map((specialization, index) => (
                <Badge key={index} variant="outline" className="text-xs border-border">
                  {specialization.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-foreground text-sm">Languages</h4>
            <div className="flex flex-wrap gap-2">
              {lawyer.legalExpertise.languages.map((language, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-secondary text-secondary-foreground">
                  {language}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent/50 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-accent-foreground" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">Location</p>
                <p className="text-xs text-muted-foreground">
                  {lawyer.personalInfo.location.city}, {lawyer.personalInfo.location.province}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">Response Time</p>
                <p className="text-xs text-muted-foreground">{lawyer.services.responseTime}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">Verification</p>
                <p className="text-xs text-muted-foreground">
                  {lawyer.verification.identityVerified ? 'Verified' : 'Pending'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      {/* Edit Modal */}
      <EditOverviewModal 
        isOpen={isOverviewModalOpen} 
        onClose={closeAllModals} 
      />
    </Card>
  );
}
