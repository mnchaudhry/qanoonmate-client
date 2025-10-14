"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Save, Shield, X } from "lucide-react";
import { LawyerProfile, ProfileCompletionData } from "@/lib/types/profile.types";
import { LawCategory, LawyerLanguage } from "@/lib/enums";
import { enumToLabel } from "@/lib/utils";
import TagInput from "@/components/ui/tag-input";

interface LegalExpertiseSectionProps {
  profile: LawyerProfile;
  completion: ProfileCompletionData;
  onUpdate: (updatedProfile: Partial<LawyerProfile>) => void;
}

const PRACTICE_AREAS = [
  { key: LawCategory.CRIMINAL_LAWS, label: 'Criminal Law' },
  { key: LawCategory.CIVIL_LAWS, label: 'Civil Law' },
  { key: LawCategory.FAMILY_LAWS, label: 'Family Law' },
  { key: LawCategory.SERVICE_LAWS, label: 'Service Law' },
  { key: LawCategory.LABOUR_LAWS, label: 'Labour Law' },
  { key: LawCategory.POLICE_LAWS, label: 'Police Law' },
  { key: LawCategory.COMPANIES_LAWS, label: 'Companies Law' },
  { key: LawCategory.LAND_PROPERTY_LAWS, label: 'Land & Property Law' },
  { key: LawCategory.ISLAMIC_RELIGIOUS_LAWS, label: 'Islamic Religious Law' },
  { key: LawCategory.BANKING_FINANCIAL_LAWS, label: 'Banking & Financial Law' },
  { key: LawCategory.LAW_OF_EVIDENCE, label: 'Law of Evidence' },
  { key: LawCategory.RENT_LAWS, label: 'Rent Laws' },
  { key: LawCategory.INTERNATIONAL_LAWS, label: 'International Law' },
  { key: LawCategory.TENANCY_LAWS, label: 'Tenancy Laws' },
  { key: LawCategory.LAND_REFORM_LAWS, label: 'Land Reform Laws' },
  { key: LawCategory.MINORITIES_LAWS, label: 'Minorities Laws' },
  { key: LawCategory.EXCISE_TAXATION_LAWS, label: 'Excise & Taxation Laws' },
  { key: LawCategory.MILITARY_LAWS, label: 'Military Laws' },
  { key: LawCategory.HEALTH_MEDICAL_LAWS, label: 'Health & Medical Laws' },
  { key: LawCategory.MEDIA_LAWS, label: 'Media Laws' },
  { key: LawCategory.ELECTION_LAWS, label: 'Election Laws' },
  { key: LawCategory.DEPARTMENTAL_LAWS, label: 'Departmental Laws' },
  { key: LawCategory.GENERAL_LAWS, label: 'General Laws' },
];

export function LegalExpertiseSection({ profile, completion, onUpdate }: LegalExpertiseSectionProps) {
  const [form, setForm] = useState({
    primarySpecialization: profile.legalExpertise.primarySpecialization,
    secondarySpecializations: profile.legalExpertise.secondarySpecializations,
    jurisdictions: profile.legalExpertise.jurisdictions,
    languages: profile.legalExpertise.languages,
    certifications: profile.legalExpertise.certifications,
  });

  const [loading, setLoading] = useState(false);

  const setField = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleSecondarySpecialization = (specialization: LawCategory) => {
    setForm(prev => ({
      ...prev,
      secondarySpecializations: prev.secondarySpecializations.includes(specialization)
        ? prev.secondarySpecializations.filter(s => s !== specialization)
        : [...prev.secondarySpecializations, specialization]
    }));
  };

  const toggleLanguage = (language: string) => {
    setForm(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedProfile: Partial<LawyerProfile> = {
        legalExpertise: {
          ...profile.legalExpertise,
          primarySpecialization: form.primarySpecialization,
          secondarySpecializations: form.secondarySpecializations,
          jurisdictions: form.jurisdictions,
          languages: form.languages,
          certifications: form.certifications,
        }
      };

      onUpdate(updatedProfile);

      // TODO: Call API to save changes
      // await dispatch(updateMeLawyer(updatedProfile));

    } catch (error) {
      console.error('Error saving legal expertise:', error);
    } finally {
      setLoading(false);
    }
  };

  const sectionCompletion = completion.sectionCompletion.legalExpertise;

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-gray-900">Legal Expertise</h1>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${sectionCompletion.completed
            ? 'bg-green-100 text-green-800'
            : 'bg-amber-100 text-amber-800'
            }`}>
            {sectionCompletion.percentage}% Complete
          </div>
        </div>
        <p className="text-gray-600">
          Define your legal specializations and practice areas to help clients find you for relevant cases.
        </p>
      </div>

      <div className="space-y-6">
        {/* Primary Specialization */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Primary Specialization *</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="primarySpecialization">Your Main Practice Area</Label>
              <Select
                value={form.primarySpecialization}
                onValueChange={(value) => setField('primarySpecialization', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your primary specialization" />
                </SelectTrigger>
                <SelectContent>
                  {PRACTICE_AREAS.map(area => (
                    <SelectItem key={area.key} value={area.key}>
                      {area.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-600">
                This is your main area of expertise and will be prominently displayed on your profile.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Secondary Specializations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Secondary Specializations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Additional Practice Areas</Label>
              <p className="text-sm text-gray-600 mb-4">
                Select 2-3 additional areas where you have experience. This helps expand your client reach.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {PRACTICE_AREAS
                  .filter(area => area.key !== form.primarySpecialization)
                  .map(area => (
                    <Button
                      key={area.key}
                      variant={form.secondarySpecializations.includes(area.key) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSecondarySpecialization(area.key)}
                      className="justify-start"
                    >
                      {area.label}
                    </Button>
                  ))}
              </div>

              {form.secondarySpecializations.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Selected:</p>
                  <div className="flex flex-wrap gap-2">
                    {form.secondarySpecializations.map(specialization => {
                      const area = PRACTICE_AREAS.find(a => a.key === specialization);
                      return (
                        <Badge key={specialization} variant="secondary" className="flex items-center gap-1">
                          {area?.label}
                          <X
                            className="w-3 h-3 cursor-pointer"
                            onClick={() => toggleSecondarySpecialization(specialization)}
                          />
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Languages */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Languages Spoken</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Languages</Label>
              <p className="text-sm text-gray-600 mb-4">
                Choose all languages you can communicate in with clients.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.values(LawyerLanguage).map(language => (
                  <Button
                    key={language}
                    variant={form.languages.includes(language) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleLanguage(language)}
                    className="justify-start"
                  >
                    {enumToLabel(language)}
                  </Button>
                ))}
              </div>

              {form.languages.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Selected:</p>
                  <div className="flex flex-wrap gap-2">
                    {form.languages.map(language => (
                      <Badge key={language} variant="secondary" className="flex items-center gap-1">
                        {enumToLabel(language)}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => toggleLanguage(language)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Certifications & Special Training</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Professional Certifications</Label>
              <p className="text-sm text-gray-600 mb-4">
                Add any relevant certifications, special training, or qualifications.
              </p>

              <TagInput
                value={form.certifications}
                onChange={(tags) => setField('certifications', tags)}
                placeholder="Add certification or training..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={loading || !form.primarySpecialization}
            className="bg-primary hover:bg-primary/90"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
