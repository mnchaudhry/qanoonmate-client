"use client";

import { useState, useEffect } from "react";
import { EditModal } from "./EditModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lawyer } from "@/store/types/lawyer.types";
import { useEditModal } from "./EditModalContext";
import { LawCategory } from "@/lib/enums";
import { X, Plus } from "lucide-react";

interface EditExpertiseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditExpertiseModal({ isOpen, onClose }: EditExpertiseModalProps) {
  const { lawyer, setLawyer } = useEditModal();
  const [formData, setFormData] = useState({
    primarySpecialization: "",
    secondarySpecializations: [] as string[],
    languages: [] as string[],
    jurisdictions: [] as string[],
  });

  const [newLanguage, setNewLanguage] = useState("");
  const [newJurisdiction, setNewJurisdiction] = useState("");

  useEffect(() => {
    if (lawyer) {
      setFormData({
        primarySpecialization: lawyer.primarySpecialization || "",
        secondarySpecializations: lawyer.specializations || [],
        languages: [], // This field doesn't exist in Lawyer type yet
        jurisdictions: [], // This field has a different structure in Lawyer type
      });
    }
  }, [lawyer]);

  const handlePrimarySpecializationChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      primarySpecialization: value
    }));
  };

  const handleSecondarySpecializationChange = (value: string) => {
    if (!formData.secondarySpecializations.includes(value)) {
      setFormData(prev => ({
        ...prev,
        secondarySpecializations: [...prev.secondarySpecializations, value]
      }));
    }
  };

  const removeSecondarySpecialization = (specialization: string) => {
    setFormData(prev => ({
      ...prev,
      secondarySpecializations: prev.secondarySpecializations.filter(s => s !== specialization)
    }));
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }));
      setNewLanguage("");
    }
  };

  const removeLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== language)
    }));
  };

  const addJurisdiction = () => {
    if (newJurisdiction.trim() && !formData.jurisdictions.includes(newJurisdiction.trim())) {
      setFormData(prev => ({
        ...prev,
        jurisdictions: [...prev.jurisdictions, newJurisdiction.trim()]
      }));
      setNewJurisdiction("");
    }
  };

  const removeJurisdiction = (jurisdiction: string) => {
    setFormData(prev => ({
      ...prev,
      jurisdictions: prev.jurisdictions.filter(j => j !== jurisdiction)
    }));
  };

  const { updateProfile } = useEditModal();

  const handleSave = async () => {
    if (!lawyer) return;

    try {
      await updateProfile({
        primarySpecialization: formData.primarySpecialization,
        specializations: formData.secondarySpecializations,
        // Note: languages and jurisdictions might need to be handled differently
        // as they have different structures in the Lawyer type
      });
      
      console.log("Successfully saved expertise data:", formData);
    } catch (error) {
      console.error("Failed to save expertise data:", error);
      throw error;
    }
  };

  return (
    <EditModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Legal Expertise"
      onSave={handleSave}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Primary Specialization */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Primary Practice Area</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="primary-specialization">Select your primary specialization</Label>
              <Select value={formData.primarySpecialization} onValueChange={handlePrimarySpecializationChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your primary practice area" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(LawCategory).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Secondary Specializations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Additional Practice Areas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Add secondary specializations</Label>
              <Select onValueChange={handleSecondarySpecializationChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Add additional practice areas" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(LawCategory)
                    .filter(category => category !== formData.primarySpecialization)
                    .map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {formData.secondarySpecializations.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.secondarySpecializations.map((specialization) => (
                  <Badge key={specialization} variant="secondary" className="flex items-center gap-1">
                    {specialization.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeSecondarySpecialization(specialization)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Languages */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Languages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                placeholder="Add a language"
                onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
              />
              <Button onClick={addLanguage} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {formData.languages.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.languages.map((language) => (
                  <Badge key={language} variant="outline" className="flex items-center gap-1">
                    {language}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeLanguage(language)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Jurisdictions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Jurisdictions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newJurisdiction}
                onChange={(e) => setNewJurisdiction(e.target.value)}
                placeholder="Add a jurisdiction (e.g., High Court, District Court)"
                onKeyPress={(e) => e.key === 'Enter' && addJurisdiction()}
              />
              <Button onClick={addJurisdiction} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {formData.jurisdictions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.jurisdictions.map((jurisdiction) => (
                  <Badge key={jurisdiction} variant="outline" className="flex items-center gap-1">
                    {jurisdiction}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeJurisdiction(jurisdiction)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </EditModal>
  );
}
