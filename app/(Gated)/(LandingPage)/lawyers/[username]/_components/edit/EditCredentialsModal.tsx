"use client";

import { useState, useEffect } from "react";
import { EditModal } from "./EditModal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEditModal } from "./EditModalContext";
import { X, Plus, Calendar, Award, GraduationCap } from "lucide-react";

interface EditCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Education {
  degree: string;
  institution: string;
  field?: string;
  year: number;
  honors?: string;
}

interface WorkHistory {
  position: string;
  organization: string;
  startDate: Date;
  endDate?: Date;
  description: string;
}

export function EditCredentialsModal({ isOpen, onClose }: EditCredentialsModalProps) {
  const { lawyer } = useEditModal();
  const [formData, setFormData] = useState({
    barCouncil: "",
    licenseNumber: "",
    barAssociation: "",
    barCouncilEnrollmentDate: "",
    preLicensedExperience: 0,
    education: [] as Education[],
    workHistory: [] as WorkHistory[],
  });

  const [newEducation, setNewEducation] = useState({
    degree: "",
    institution: "",
    field: "",
    year: new Date().getFullYear(),
    honors: "",
  });

  const [newWork, setNewWork] = useState({
    position: "",
    organization: "",
    startDate: new Date(),
    endDate: new Date(),
    description: "",
  });

  useEffect(() => {
    if (lawyer) {
      setFormData({
        barCouncil: lawyer.barCouncil || "",
        licenseNumber: lawyer.licenseNumber || "",
        barAssociation: lawyer.barAssociation || "",
        barCouncilEnrollmentDate: lawyer.barCouncilEnrollmentDate?.toString() || "",
        preLicensedExperience: lawyer.preLicensedYearsOfExperience || 0,
        education: lawyer.education?.map(edu => {
          // Parse education string back to object format
          const match = edu.match(/(.+?) from (.+?) \((\d+)\)/);
          if (match) {
            return { degree: match[1], institution: match[2], year: parseInt(match[3]), field: "", honors: "" };
          }
          return { degree: edu, institution: "", year: new Date().getFullYear(), field: "", honors: "" };
        }) || [],
        workHistory: [], // This field doesn't exist in Lawyer type yet
      });
    }
  }, [lawyer]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addEducation = () => {
    if (newEducation.degree && newEducation.institution && newEducation.year) {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, { ...newEducation }]
      }));
      setNewEducation({ degree: "", institution: "", field: "", year: new Date().getFullYear(), honors: "" });
    }
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addWorkHistory = () => {
    if (newWork.position && newWork.organization && newWork.startDate) {
      setFormData(prev => ({
        ...prev,
        workHistory: [...prev.workHistory, { ...newWork }]
      }));
      setNewWork({ position: "", organization: "", startDate: new Date(), endDate: new Date(), description: "" });
    }
  };

  const removeWorkHistory = (index: number) => {
    setFormData(prev => ({
      ...prev,
      workHistory: prev.workHistory.filter((_, i) => i !== index)
    }));
  };

  const { updateProfile } = useEditModal();

  const handleSave = async () => {
    if (!lawyer) return;

    try {
      await updateProfile({
        barCouncil: formData.barCouncil,
        licenseNumber: formData.licenseNumber,
        barAssociation: formData.barAssociation,
        barCouncilEnrollmentDate: formData.barCouncilEnrollmentDate,
        preLicensedYearsOfExperience: formData.preLicensedExperience,
        education: formData.education.map(edu => `${edu.degree} from ${edu.institution} (${edu.year})`),
        // Note: workHistory might need to be stored in a different field or added to the Lawyer type
      });
      
      console.log("Successfully saved credentials data:", formData);
    } catch (error) {
      console.error("Failed to save credentials data:", error);
      throw error;
    }
  };

  return (
    <EditModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Credentials & Education"
      onSave={handleSave}
      maxWidth="5xl"
    >
      <div className="space-y-6">
        {/* Bar Council Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Award className="w-4 h-4" />
              Bar Council Registration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bar-council">Bar Council</Label>
                <Input
                  id="bar-council"
                  value={formData.barCouncil}
                  onChange={(e) => handleInputChange("barCouncil", e.target.value)}
                  placeholder="e.g., Punjab Bar Council"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license-number">License Number</Label>
                <Input
                  id="license-number"
                  value={formData.licenseNumber}
                  onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                  placeholder="e.g., PBC-12345"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bar-association">Bar Association</Label>
                <Input
                  id="bar-association"
                  value={formData.barAssociation}
                  onChange={(e) => handleInputChange("barAssociation", e.target.value)}
                  placeholder="e.g., Lahore Bar Association"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="enrollment-date">Enrollment Date</Label>
                <Input
                  id="enrollment-date"
                  type="date"
                  value={formData.barCouncilEnrollmentDate}
                  onChange={(e) => handleInputChange("barCouncilEnrollmentDate", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pre-licensed-experience">Pre-Licensed Experience (Years)</Label>
              <Input
                id="pre-licensed-experience"
                type="number"
                value={formData.preLicensedExperience}
                onChange={(e) => handleInputChange("preLicensedExperience", parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
          </CardContent>
        </Card>

        {/* Education */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Education
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="edu-degree">Degree</Label>
                <Input
                  id="edu-degree"
                  value={newEducation.degree}
                  onChange={(e) => setNewEducation(prev => ({ ...prev, degree: e.target.value }))}
                  placeholder="e.g., LLB, LLM"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edu-institution">Institution</Label>
                <Input
                  id="edu-institution"
                  value={newEducation.institution}
                  onChange={(e) => setNewEducation(prev => ({ ...prev, institution: e.target.value }))}
                  placeholder="e.g., University of Punjab"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edu-year">Year</Label>
                <Input
                  id="edu-year"
                  type="number"
                  value={newEducation.year}
                  onChange={(e) => setNewEducation(prev => ({ ...prev, year: parseInt(e.target.value) || new Date().getFullYear() }))}
                  placeholder="e.g., 2015"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edu-field">Field of Study</Label>
                <Input
                  id="edu-field"
                  value={newEducation.field}
                  onChange={(e) => setNewEducation(prev => ({ ...prev, field: e.target.value }))}
                  placeholder="e.g., Corporate Law"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edu-honors">Honors/Awards</Label>
                <Input
                  id="edu-honors"
                  value={newEducation.honors}
                  onChange={(e) => setNewEducation(prev => ({ ...prev, honors: e.target.value }))}
                  placeholder="e.g., Magna Cum Laude"
                />
              </div>
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button onClick={addEducation} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </div>
            </div>

            {formData.education.length > 0 && (
              <div className="space-y-2">
                <Label>Education History</Label>
                <div className="space-y-2">
                  {formData.education.map((edu, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{edu.degree}</div>
                        <div className="text-xs text-muted-foreground">{edu.institution} • {edu.year}</div>
                        {edu.field && <div className="text-xs text-muted-foreground">{edu.field}</div>}
                        {edu.honors && <Badge variant="secondary" className="text-xs mt-1">{edu.honors}</Badge>}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeEducation(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Work History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Work History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="work-position">Position</Label>
                <Input
                  id="work-position"
                  value={newWork.position}
                  onChange={(e) => setNewWork(prev => ({ ...prev, position: e.target.value }))}
                  placeholder="e.g., Associate Lawyer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="work-organization">Organization</Label>
                <Input
                  id="work-organization"
                  value={newWork.organization}
                  onChange={(e) => setNewWork(prev => ({ ...prev, organization: e.target.value }))}
                  placeholder="e.g., ABC Law Firm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="work-start">Start Date</Label>
                <Input
                  id="work-start"
                  type="date"
                  value={newWork.startDate.toISOString().split('T')[0]}
                  onChange={(e) => setNewWork(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="work-end">End Date (Leave empty if current)</Label>
                <Input
                  id="work-end"
                  type="date"
                  value={newWork.endDate.toISOString().split('T')[0]}
                  onChange={(e) => setNewWork(prev => ({ ...prev, endDate: new Date(e.target.value) }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="work-description">Description</Label>
              <Textarea
                id="work-description"
                value={newWork.description}
                onChange={(e) => setNewWork(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your role and responsibilities..."
                rows={3}
              />
            </div>
            <Button onClick={addWorkHistory} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Work Experience
            </Button>

            {formData.workHistory.length > 0 && (
              <div className="space-y-2">
                <Label>Work History</Label>
                <div className="space-y-2">
                  {formData.workHistory.map((work, index) => (
                    <div key={index} className="flex items-start justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{work.position}</div>
                        <div className="text-xs text-muted-foreground">{work.organization}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(work.startDate).getFullYear()} - {work.endDate ? new Date(work.endDate).getFullYear() : 'Present'}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{work.description}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeWorkHistory(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </EditModal>
  );
}
