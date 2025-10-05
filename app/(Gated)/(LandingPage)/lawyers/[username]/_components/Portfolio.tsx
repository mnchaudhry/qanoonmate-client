"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, BookOpen, Trophy, FileText, Edit } from "lucide-react";
import { LawyerProfile } from "@/lib/types/profile.types";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEditModal } from "./edit/EditModalContext";
import { EditPortfolioModal } from "./edit/EditPortfolioModal";

interface PortfolioProps {
  lawyer: LawyerProfile;
}

export function Portfolio({ lawyer }: PortfolioProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const isOwnProfile = user?.email === lawyer.personalInfo.email;
  const { isPortfolioModalOpen, openPortfolioModal, closeAllModals } = useEditModal();

  const hasContent =
    lawyer.portfolio.notableCases.length > 0 ||
    lawyer.portfolio.publications.length > 0 ||
    lawyer.portfolio.awards.length > 0 ||
    lawyer.portfolio.caseStudies.length > 0;

  if (!hasContent) {
    return (
      <Card className="border-gray-100 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between text-lg font-semibold">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-gray-600" />
              Portfolio & Achievements
            </div>
            {isOwnProfile && (
              <Edit 
                className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" 
                onClick={openPortfolioModal}
              />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Portfolio Coming Soon
            </h3>
            <p className="text-gray-600 max-w-md mx-auto text-sm">
              This lawyer is working on showcasing their notable cases, publications, and professional achievements.
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
          <Award className="w-4 h-4 text-gray-600" />
          Portfolio & Achievements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Notable Cases */}
        {lawyer.portfolio.notableCases.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3 text-sm flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" />
              Notable Cases
            </h4>
            <div className="space-y-3">
              {lawyer.portfolio.notableCases.slice(0, 3).map((case_, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-medium text-gray-900 text-sm">{case_.title}</h5>
                    <Badge variant="outline" className="text-xs">
                      {case_.year}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">{case_.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs bg-green-50 text-green-700">
                      {case_.outcome}
                    </Badge>
                    {case_.anonymized && (
                      <Badge variant="outline" className="text-xs">
                        Anonymized
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Publications */}
        {lawyer.portfolio.publications.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3 text-sm flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5" />
              Publications
            </h4>
            <div className="space-y-2">
              {lawyer.portfolio.publications.slice(0, 3).map((pub, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-start justify-between mb-1">
                    <h5 className="font-medium text-gray-900 text-sm">{pub.title}</h5>
                    <Badge variant="outline" className="text-xs">
                      {pub.year}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="capitalize">{pub.type}</span>
                    {pub.publisher && <span>• {pub.publisher}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Awards */}
        {lawyer.portfolio.awards.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3 text-sm flex items-center gap-2">
              <Trophy className="w-3.5 h-3.5" />
              Awards & Recognition
            </h4>
            <div className="space-y-2">
              {lawyer.portfolio.awards.slice(0, 3).map((award, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-start justify-between mb-1">
                    <h5 className="font-medium text-gray-900 text-sm">{award.title}</h5>
                    <Badge variant="outline" className="text-xs">
                      {award.year}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">{award.organization}</p>
                  {award.description && (
                    <p className="text-xs text-gray-500 mt-1">{award.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Case Studies */}
        {lawyer.portfolio.caseStudies.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3 text-sm flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" />
              Case Studies
            </h4>
            <div className="space-y-3">
              {lawyer.portfolio.caseStudies.slice(0, 2).map((study, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <h5 className="font-medium text-gray-900 text-sm mb-2">{study.title}</h5>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div>
                      <span className="font-medium">Challenge:</span> {study.challenge}
                    </div>
                    <div>
                      <span className="font-medium">Solution:</span> {study.solution}
                    </div>
                    <div>
                      <span className="font-medium">Outcome:</span> {study.outcome}
                    </div>
                  </div>
                  {study.anonymized && (
                    <Badge variant="outline" className="text-xs mt-2">
                      Anonymized Case
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      {/* Edit Modal */}
      <EditPortfolioModal 
        isOpen={isPortfolioModalOpen} 
        onClose={closeAllModals} 
      />
    </Card>
  );
}
