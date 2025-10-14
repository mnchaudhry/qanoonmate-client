"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, MapPin, Globe, Edit } from "lucide-react";
import { LawyerProfile } from "@/lib/types/profile.types";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEditModal } from "./edit/EditModalContext";
import { EditExpertiseModal } from "./edit/EditExpertiseModal";

interface LegalExpertiseProps {
  lawyer: LawyerProfile;
}

export function LegalExpertise({ lawyer }: LegalExpertiseProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const isOwnProfile = user?.email === lawyer.personalInfo.email;
  const { isExpertiseModalOpen, openExpertiseModal, closeAllModals } = useEditModal();

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg font-semibold">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-muted-foreground" />
            Legal Expertise
          </div>
          {isOwnProfile && (
            <Edit
              className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary"
              onClick={openExpertiseModal}
            />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Primary Specialization */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3 text-sm">Primary Practice Area</h4>
          <Badge variant="default" className="bg-primary text-white text-sm px-3 py-1">
            {lawyer.legalExpertise.primarySpecialization.replace('_', ' ')}
          </Badge>
        </div>

        {/* Secondary Specializations */}
        {lawyer.legalExpertise.secondarySpecializations.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3 text-sm">Additional Practice Areas</h4>
            <div className="flex flex-wrap gap-2">
              {lawyer.legalExpertise.secondarySpecializations.map((specialization, index) => (
                <Badge key={index} variant="outline" className="text-xs border-gray-200">
                  {specialization.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Jurisdictions */}
        {lawyer?.legalExpertise?.jurisdictions && lawyer?.legalExpertise?.jurisdictions?.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2 text-sm">
              <MapPin className="w-3.5 h-3.5" />
              Jurisdictions
            </h4>
            <div className="space-y-3">
              {lawyer?.legalExpertise?.jurisdictions?.map((jurisdiction, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-500" />
                    <span className="font-medium text-gray-900 text-sm">
                      {jurisdiction.geography.province}
                      {jurisdiction.geography.district && `, ${jurisdiction.geography.district}`}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {jurisdiction?.courts?.map((court, courtIndex) => (
                      <Badge key={courtIndex} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                        {court}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {lawyer.legalExpertise.languages.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2 text-sm">
              <Globe className="w-3.5 h-3.5" />
              Languages
            </h4>
            <div className="flex flex-wrap gap-2">
              {lawyer.legalExpertise.languages.map((language, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-gray-50 text-gray-700">
                  {language}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {lawyer.legalExpertise.certifications.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3 text-sm">Certifications & Training</h4>
            <div className="space-y-2">
              {lawyer.legalExpertise.certifications.map((certification, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>{certification}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      {/* Edit Modal */}
      <EditExpertiseModal
        isOpen={isExpertiseModalOpen}
        onClose={closeAllModals}
      />
    </Card>
  );
}
