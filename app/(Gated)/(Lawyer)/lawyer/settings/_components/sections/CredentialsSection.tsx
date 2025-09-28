"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Save, GraduationCap, Plus, X, Calendar } from "lucide-react";
import { LawyerProfile, ProfileCompletionData, EducationEntry, WorkExperience } from "@/lib/types/profile.types";
import { BarCouncils } from "@/lib/enums";
import { enumToLabel } from "@/lib/utils";

interface CredentialsSectionProps {
  profile: LawyerProfile;
  completion: ProfileCompletionData;
  onUpdate: (updatedProfile: Partial<LawyerProfile>) => void;
}

export function CredentialsSection({ profile, completion, onUpdate }: CredentialsSectionProps) {
  const [form, setForm] = useState({
    education: profile.credentials.education,
    barCouncil: profile.credentials.barCouncil,
    licenseNumber: profile.credentials.licenseNumber,
    licenseValidity: profile.credentials.licenseValidity,
    barAssociation: profile.credentials.barAssociation,
    barCouncilEnrollmentDate: profile.credentials.barCouncilEnrollmentDate,
    preLicensedExperience: profile.credentials.preLicensedExperience,
    workHistory: profile.credentials.workHistory,
  });

  const [loading, setLoading] = useState(false);
  const [newEducation, setNewEducation] = useState<EducationEntry>({
    degree: '',
    institution: '',
    year: new Date().getFullYear(),
    field: '',
    honors: ''
  });

  const [newWorkExperience, setNewWorkExperience] = useState<WorkExperience>({
    position: '',
    organization: '',
    startDate: new Date(),
    endDate: undefined,
    description: '',
    achievements: []
  });

  const setField = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const addEducation = () => {
    if (newEducation.degree && newEducation.institution) {
      setForm(prev => ({
        ...prev,
        education: [...prev.education, newEducation]
      }));
      setNewEducation({
        degree: '',
        institution: '',
        year: new Date().getFullYear(),
        field: '',
        honors: ''
      });
    }
  };

  const removeEducation = (index: number) => {
    setForm(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addWorkExperience = () => {
    if (newWorkExperience.position && newWorkExperience.organization) {
      setForm(prev => ({
        ...prev,
        workHistory: [...prev.workHistory, newWorkExperience]
      }));
      setNewWorkExperience({
        position: '',
        organization: '',
        startDate: new Date(),
        endDate: undefined,
        description: '',
        achievements: []
      });
    }
  };

  const removeWorkExperience = (index: number) => {
    setForm(prev => ({
      ...prev,
      workHistory: prev.workHistory.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedProfile: Partial<LawyerProfile> = {
        credentials: {
          ...profile.credentials,
          education: form.education,
          barCouncil: form.barCouncil,
          licenseNumber: form.licenseNumber,
          licenseValidity: form.licenseValidity,
          barAssociation: form.barAssociation,
          barCouncilEnrollmentDate: form.barCouncilEnrollmentDate,
          preLicensedExperience: form.preLicensedExperience,
          workHistory: form.workHistory,
        }
      };

      onUpdate(updatedProfile);
      
      // TODO: Call API to save changes
      // await dispatch(updateMeLawyer(updatedProfile));
      
    } catch (error) {
      console.error('Error saving credentials:', error);
    } finally {
      setLoading(false);
    }
  };

  const sectionCompletion = completion.sectionCompletion.credentials;

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <GraduationCap className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-gray-900">Credentials & Experience</h1>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            sectionCompletion.completed 
              ? 'bg-green-100 text-green-800' 
              : 'bg-amber-100 text-amber-800'
          }`}>
            {sectionCompletion.percentage}% Complete
          </div>
        </div>
        <p className="text-gray-600">
          Add your educational background, bar council details, and professional experience to build credibility.
        </p>
      </div>

      <div className="space-y-6">
        {/* Bar Council Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bar Council Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="barCouncil">Bar Council *</Label>
                <Select value={form.barCouncil} onValueChange={(value) => setField('barCouncil', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bar council" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(BarCouncils).map(council => (
                      <SelectItem key={council} value={council}>
                        {enumToLabel(council)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number *</Label>
                <Input
                  id="licenseNumber"
                  value={form.licenseNumber}
                  onChange={(e) => setField('licenseNumber', e.target.value)}
                  placeholder="Enter your bar license number"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="licenseValidity">License Validity Date</Label>
                <Input
                  id="licenseValidity"
                  type="date"
                  value={form.licenseValidity ? new Date(form.licenseValidity).toISOString().split('T')[0] : ''}
                  onChange={(e) => setField('licenseValidity', e.target.value ? new Date(e.target.value) : undefined)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="barAssociation">Bar Association</Label>
                <Input
                  id="barAssociation"
                  value={form.barAssociation}
                  onChange={(e) => setField('barAssociation', e.target.value)}
                  placeholder="e.g., Lahore Bar Association"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="barCouncilEnrollmentDate">Bar Council Enrollment Date</Label>
              <Input
                id="barCouncilEnrollmentDate"
                type="date"
                value={form.barCouncilEnrollmentDate ? new Date(form.barCouncilEnrollmentDate).toISOString().split('T')[0] : ''}
                onChange={(e) => setField('barCouncilEnrollmentDate', e.target.value ? new Date(e.target.value) : undefined)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preLicensedExperience">Pre-License Experience (Years)</Label>
              <Input
                id="preLicensedExperience"
                type="number"
                min="0"
                value={form.preLicensedExperience}
                onChange={(e) => setField('preLicensedExperience', Number(e.target.value))}
                placeholder="Years of experience before getting licensed"
              />
            </div>
          </CardContent>
        </Card>

        {/* Education */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Education</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {form.education.length > 0 && (
              <div className="space-y-3">
                {form.education.map((edu, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{edu.degree}</h4>
                      <p className="text-sm text-gray-600">{edu.institution} • {edu.year}</p>
                      {edu.field && <p className="text-sm text-gray-500">{edu.field}</p>}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEducation(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <h4 className="font-medium mb-3">Add Education</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Degree *</Label>
                  <Input
                    value={newEducation.degree}
                    onChange={(e) => setNewEducation(prev => ({ ...prev, degree: e.target.value }))}
                    placeholder="e.g., LLB, LLM"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Institution *</Label>
                  <Input
                    value={newEducation.institution}
                    onChange={(e) => setNewEducation(prev => ({ ...prev, institution: e.target.value }))}
                    placeholder="e.g., University of Punjab"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Input
                    type="number"
                    min="1950"
                    max={new Date().getFullYear()}
                    value={newEducation.year}
                    onChange={(e) => setNewEducation(prev => ({ ...prev, year: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Field of Study</Label>
                  <Input
                    value={newEducation.field}
                    onChange={(e) => setNewEducation(prev => ({ ...prev, field: e.target.value }))}
                    placeholder="e.g., Constitutional Law"
                  />
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <Label>Honors/Awards</Label>
                <Input
                  value={newEducation.honors}
                  onChange={(e) => setNewEducation(prev => ({ ...prev, honors: e.target.value }))}
                  placeholder="e.g., Magna Cum Laude, Gold Medal"
                />
              </div>
              <Button
                onClick={addEducation}
                disabled={!newEducation.degree || !newEducation.institution}
                className="mt-4"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Education
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Work Experience */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Professional Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {form.workHistory.length > 0 && (
              <div className="space-y-3">
                {form.workHistory.map((work, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{work.position}</h4>
                        <p className="text-sm text-gray-600">{work.organization}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(work.startDate).getFullYear()} - {work.endDate ? new Date(work.endDate).getFullYear() : 'Present'}
                        </p>
                        {work.description && (
                          <p className="text-sm text-gray-700 mt-2">{work.description}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeWorkExperience(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <h4 className="font-medium mb-3">Add Work Experience</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Position *</Label>
                  <Input
                    value={newWorkExperience.position}
                    onChange={(e) => setNewWorkExperience(prev => ({ ...prev, position: e.target.value }))}
                    placeholder="e.g., Senior Associate"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Organization *</Label>
                  <Input
                    value={newWorkExperience.organization}
                    onChange={(e) => setNewWorkExperience(prev => ({ ...prev, organization: e.target.value }))}
                    placeholder="e.g., ABC Law Firm"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={newWorkExperience.startDate ? new Date(newWorkExperience.startDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setNewWorkExperience(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date (leave empty if current)</Label>
                  <Input
                    type="date"
                    value={newWorkExperience.endDate ? new Date(newWorkExperience.endDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setNewWorkExperience(prev => ({ ...prev, endDate: e.target.value ? new Date(e.target.value) : undefined }))}
                  />
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <Label>Description</Label>
                <Textarea
                  value={newWorkExperience.description}
                  onChange={(e) => setNewWorkExperience(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your role and responsibilities..."
                  rows={3}
                />
              </div>
              <Button
                onClick={addWorkExperience}
                disabled={!newWorkExperience.position || !newWorkExperience.organization}
                className="mt-4"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={loading || !form.barCouncil || !form.licenseNumber}
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
