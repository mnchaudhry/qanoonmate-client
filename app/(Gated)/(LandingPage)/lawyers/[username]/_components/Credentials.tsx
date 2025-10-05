"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Award, Calendar, MapPin, Edit } from "lucide-react";
import { LawyerProfile } from "@/lib/types/profile.types";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEditModal } from "./edit/EditModalContext";
import { EditCredentialsModal } from "./edit/EditCredentialsModal";

interface CredentialsProps {
  lawyer: LawyerProfile;
}

export function Credentials({ lawyer }: CredentialsProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const isOwnProfile = user?.email === lawyer.personalInfo.email;
  const { isCredentialsModalOpen, openCredentialsModal, closeAllModals } = useEditModal();

  return (
    <Card className="border-gray-100 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg font-semibold">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-gray-600" />
            Credentials & Education
          </div>
          {isOwnProfile && (
            <Edit 
              className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" 
              onClick={openCredentialsModal}
            />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bar Council Information */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3 text-sm">Bar Council Registration</h4>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-primary" />
              <span className="font-medium text-gray-900 text-sm">{lawyer.credentials.barCouncil}</span>
            </div>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <span className="font-medium">License Number:</span>
                <span>{lawyer.credentials.licenseNumber}</span>
              </div>
              {lawyer.credentials.barAssociation && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Bar Association:</span>
                  <span>{lawyer.credentials.barAssociation}</span>
                </div>
              )}
              {lawyer.credentials.barCouncilEnrollmentDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  <span>Enrolled: {new Date(lawyer.credentials.barCouncilEnrollmentDate).getFullYear()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Education */}
        {lawyer.credentials.education.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3 text-sm">Education</h4>
            <div className="space-y-3">
              {lawyer.credentials.education.map((edu, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-medium text-gray-900 text-sm">{edu.degree}</h5>
                      <p className="text-xs text-gray-600">{edu.institution}</p>
                      {edu.field && (
                        <p className="text-xs text-gray-500">{edu.field}</p>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {edu.year}
                    </Badge>
                  </div>
                  {edu.honors && (
                    <div className="mt-2">
                      <Badge variant="secondary" className="text-xs bg-yellow-50 text-yellow-700">
                        {edu.honors}
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience Summary */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3 text-sm">Experience Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs font-medium text-gray-900">Licensed Experience</span>
              </div>
              <p className="text-xs text-gray-600">
                {lawyer.professionalOverview.yearsOfExperience} years
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-3.5 h-3.5 text-green-600" />
                <span className="text-xs font-medium text-gray-900">Pre-Licensed Experience</span>
              </div>
              <p className="text-xs text-gray-600">
                {lawyer.credentials.preLicensedExperience} years
              </p>
            </div>
          </div>
        </div>

        {/* Work History Preview */}
        {lawyer.credentials.workHistory.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3 text-sm">Recent Experience</h4>
            <div className="space-y-2">
              {lawyer.credentials.workHistory.slice(0, 2).map((work, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-start justify-between mb-1">
                    <h5 className="font-medium text-gray-900 text-sm">{work.position}</h5>
                    <span className="text-xs text-gray-500">
                      {new Date(work.startDate).getFullYear()} - {work.endDate ? new Date(work.endDate).getFullYear() : 'Present'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{work.organization}</p>
                  <p className="text-xs text-gray-500 line-clamp-2">{work.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      {/* Edit Modal */}
      <EditCredentialsModal 
        isOpen={isCredentialsModalOpen} 
        onClose={closeAllModals} 
      />
    </Card>
  );
}
