"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Briefcase, Eye, EyeOff } from "lucide-react";
import { LawyerProfile, ProfileCompletionData } from "@/lib/types/profile.types";

interface ProfessionalOverviewSectionProps {
  profile: LawyerProfile;
  completion: ProfileCompletionData;
  onUpdate: (updatedProfile: Partial<LawyerProfile>) => void;
}

export function ProfessionalOverviewSection({ profile, completion, onUpdate }: ProfessionalOverviewSectionProps) {
  const [form, setForm] = useState({
    title: profile.professionalOverview.title,
    bio: profile.professionalOverview.bio,
    tagline: profile.professionalOverview.tagline,
    yearsOfExperience: profile.professionalOverview.yearsOfExperience,
    profileVisibility: profile.professionalOverview.profileVisibility,
  });

  const [loading, setLoading] = useState(false);

  const setField = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedProfile: Partial<LawyerProfile> = {
        professionalOverview: {
          ...profile.professionalOverview,
          title: form.title,
          bio: form.bio,
          tagline: form.tagline,
          yearsOfExperience: form.yearsOfExperience,
          profileVisibility: form.profileVisibility,
        }
      };

      onUpdate(updatedProfile);

      // TODO: Call API to save changes
      // await dispatch(updateMeLawyer(updatedProfile));

    } catch (error) {
      console.error('Error saving professional overview:', error);
    } finally {
      setLoading(false);
    }
  };

  const sectionCompletion = completion.sectionCompletion.professionalOverview;
  const bioLength = form.bio.length;
  const isBioValid = bioLength >= 50;

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Briefcase className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-gray-900">Professional Overview</h1>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${sectionCompletion.completed
              ? 'bg-green-100 text-green-800'
              : 'bg-amber-100 text-amber-800'
            }`}>
            {sectionCompletion.percentage}% Complete
          </div>
        </div>
        <p className="text-gray-600">
          Create a compelling professional summary that showcases your expertise and attracts clients.
        </p>
      </div>

      <div className="space-y-6">
        {/* Professional Title */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Professional Title</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Professional Title / Tagline *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setField('title', e.target.value)}
                placeholder="e.g., Senior Family Law Attorney, Criminal Defense Specialist"
              />
              <p className="text-sm text-gray-600">
                This appears in search results and client inquiries. Be specific about your expertise.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline">Short Tagline</Label>
              <Input
                id="tagline"
                value={form.tagline}
                onChange={(e) => setField('tagline', e.target.value)}
                placeholder="e.g., Protecting families, securing justice"
                maxLength={100}
              />
              <p className="text-sm text-gray-600">
                A brief, memorable phrase that describes your approach (optional)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Professional Bio */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Professional Bio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="bio">Professional Bio *</Label>
                <div className={`text-sm ${isBioValid ? 'text-green-600' : 'text-amber-600'}`}>
                  {bioLength}/50+ words
                </div>
              </div>
              <Textarea
                id="bio"
                value={form.bio}
                onChange={(e) => setField('bio', e.target.value)}
                placeholder="Write a compelling professional bio that highlights your expertise, experience, and approach to helping clients..."
                rows={6}
                className="resize-none"
              />
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Tips for a great bio:</strong>
                </p>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                  <li>Start with your years of experience and primary expertise</li>
                  <li>Mention your approach to client service</li>
                  <li>Highlight any notable achievements or specializations</li>
                  <li>Keep it professional but approachable</li>
                  <li>Include your commitment to client success</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Experience & Visibility */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Experience & Visibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                <Input
                  id="yearsOfExperience"
                  type="number"
                  min="0"
                  value={form.yearsOfExperience}
                  onChange={(e) => setField('yearsOfExperience', Number(e.target.value))}
                  placeholder="e.g., 10"
                />
                <p className="text-sm text-gray-600">
                  Total years practicing law
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="profileVisibility">Profile Visibility</Label>
                <Select value={form.profileVisibility} onValueChange={(value) => setField('profileVisibility', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Public - Visible to all clients
                      </div>
                    </SelectItem>
                    <SelectItem value="limited">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Limited - Visible to matched clients only
                      </div>
                    </SelectItem>
                    <SelectItem value="private">
                      <div className="flex items-center gap-2">
                        <EyeOff className="w-4 h-4" />
                        Private - Not visible to clients
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-600">
                  Control who can see your profile
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                {form.title || "Your Professional Title"}
              </h3>
              {form.tagline && (
                <p className="text-primary font-medium mb-3">
                  &quot;{form.tagline}&quot;
                </p>
              )}
              <p className="text-gray-700 text-sm leading-relaxed">
                {form.bio || "Your professional bio will appear here..."}
              </p>
              {form.yearsOfExperience > 0 && (
                <p className="text-sm text-gray-600 mt-3">
                  {form.yearsOfExperience}+ years of experience
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={loading || !form.title || !isBioValid}
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
