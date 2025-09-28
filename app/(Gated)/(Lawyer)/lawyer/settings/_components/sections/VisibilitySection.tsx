"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Save, Users, Globe, Lock, Shield } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { SubsectionHeader } from "./SubsectionHeader";
import { LawyerProfile, ProfileCompletionData } from "@/lib/types/profile.types";

interface VisibilitySectionProps {
  profile: LawyerProfile;
  completion: ProfileCompletionData;
  onUpdate: (updatedProfile: Partial<LawyerProfile>) => void;
}

const VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public', description: 'Visible to everyone', icon: Globe },
  { value: 'private', label: 'Private', description: 'Only visible to you', icon: Lock },
  { value: 'limited', label: 'Limited', description: 'Visible to verified users only', icon: Shield },
];

export function VisibilitySection({ }: VisibilitySectionProps) {
  const [form, setForm] = useState({
    profileVisibility: 'public',
    showContactInfo: true,
    showPricing: true,
    showAvailability: true,
    showReviews: true,
    showPortfolio: true,
    showCredentials: true,
    allowDirectMessages: true,
    allowConsultationRequests: true,
    showInSearchResults: true,
    showInLawyerDirectory: true,
  });

  const [loading, setLoading] = useState(false);

  const setField = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Implement visibility settings update
      console.log('Visibility settings updated:', form);
      
    } catch (error) {
      console.error('Error saving visibility settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVisibilityIcon = (value: string) => {
    const option = VISIBILITY_OPTIONS.find(opt => opt.value === value);
    return option ? option.icon : Globe;
  };

  const getVisibilityDescription = (value: string) => {
    const option = VISIBILITY_OPTIONS.find(opt => opt.value === value);
    return option ? option.description : '';
  };

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <SectionHeader
          title="Profile Visibility"
          description="Control who can see your profile and what information is visible"
          icon={<Eye className="w-4 h-4 text-primary" />}
          action={{
            label: "Save Changes",
            onClick: handleSave,
            variant: "default"
          }}
        />
        <CardContent className="space-y-4">
          {/* Profile Visibility Level */}
          <div className="space-y-2">
            <SubsectionHeader title="Profile Visibility Level" />
            <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/20">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Overall Profile Visibility</Label>
                  <Select value={form.profileVisibility} onValueChange={(value) => setField('profileVisibility', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VISIBILITY_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <option.icon className="w-4 h-4" />
                            <div>
                              <div className="font-medium">{option.label}</div>
                              <div className="text-sm text-muted-foreground">{option.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  {(() => {
                    const VisibilityIcon = getVisibilityIcon(form.profileVisibility);
                    return <VisibilityIcon className="w-5 h-5 text-primary" />;
                  })()}
                  <div>
                    <h4 className="font-medium text-foreground capitalize">
                      {form.profileVisibility} Profile
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {getVisibilityDescription(form.profileVisibility)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Information Visibility */}
          <div className="space-y-2">
            <SubsectionHeader title="Information Visibility" />
            <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/20">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-foreground">Contact Information</Label>
                    <p className="text-xs text-muted-foreground">Show phone number and email</p>
                  </div>
                  <Switch
                    checked={form.showContactInfo}
                    onCheckedChange={(checked) => setField('showContactInfo', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-foreground">Pricing Information</Label>
                    <p className="text-xs text-muted-foreground">Show consultation fees and packages</p>
                  </div>
                  <Switch
                    checked={form.showPricing}
                    onCheckedChange={(checked) => setField('showPricing', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-foreground">Availability</Label>
                    <p className="text-xs text-muted-foreground">Show working hours and availability</p>
                  </div>
                  <Switch
                    checked={form.showAvailability}
                    onCheckedChange={(checked) => setField('showAvailability', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-foreground">Client Reviews</Label>
                    <p className="text-xs text-muted-foreground">Show testimonials and ratings</p>
                  </div>
                  <Switch
                    checked={form.showReviews}
                    onCheckedChange={(checked) => setField('showReviews', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-foreground">Portfolio</Label>
                    <p className="text-xs text-muted-foreground">Show notable cases and achievements</p>
                  </div>
                  <Switch
                    checked={form.showPortfolio}
                    onCheckedChange={(checked) => setField('showPortfolio', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-foreground">Credentials</Label>
                    <p className="text-xs text-muted-foreground">Show education and certifications</p>
                  </div>
                  <Switch
                    checked={form.showCredentials}
                    onCheckedChange={(checked) => setField('showCredentials', checked)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Interaction Settings */}
          <div className="space-y-2">
            <SubsectionHeader title="Interaction Settings" />
            <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/20">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-foreground">Direct Messages</Label>
                    <p className="text-xs text-muted-foreground">Allow clients to send direct messages</p>
                  </div>
                  <Switch
                    checked={form.allowDirectMessages}
                    onCheckedChange={(checked) => setField('allowDirectMessages', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-foreground">Consultation Requests</Label>
                    <p className="text-xs text-muted-foreground">Allow clients to request consultations</p>
                  </div>
                  <Switch
                    checked={form.allowConsultationRequests}
                    onCheckedChange={(checked) => setField('allowConsultationRequests', checked)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Discovery Settings */}
          <div className="space-y-2">
            <SubsectionHeader title="Discovery Settings" />
            <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/20">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-foreground">Search Results</Label>
                    <p className="text-xs text-muted-foreground">Show profile in search results</p>
                  </div>
                  <Switch
                    checked={form.showInSearchResults}
                    onCheckedChange={(checked) => setField('showInSearchResults', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-foreground">Lawyer Directory</Label>
                    <p className="text-xs text-muted-foreground">Show profile in public lawyer directory</p>
                  </div>
                  <Switch
                    checked={form.showInLawyerDirectory}
                    onCheckedChange={(checked) => setField('showInLawyerDirectory', checked)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Visibility Summary */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h4 className="font-medium text-primary mb-3">👁️ Visibility Summary</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Profile Status:</span>
                <Badge variant="outline" className="capitalize">
                  {form.profileVisibility}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Visible Information:</span>
                <span className="text-sm text-muted-foreground">
                  {[
                    form.showContactInfo && 'Contact',
                    form.showPricing && 'Pricing',
                    form.showAvailability && 'Availability',
                    form.showReviews && 'Reviews',
                    form.showPortfolio && 'Portfolio',
                    form.showCredentials && 'Credentials'
                  ].filter(Boolean).length} sections
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Client Interactions:</span>
                <span className="text-sm text-muted-foreground">
                  {form.allowDirectMessages && form.allowConsultationRequests ? 'Full' : 
                   form.allowDirectMessages || form.allowConsultationRequests ? 'Limited' : 'None'}
                </span>
              </div>
            </div>
          </div>

          {/* Visibility Tips */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h4 className="font-medium text-primary mb-2">🔍 Visibility Tips</h4>
            <ul className="text-sm text-primary/80 space-y-1">
              <li>• Public profiles get more client inquiries</li>
              <li>• Show pricing to attract serious clients</li>
              <li>• Enable reviews to build trust and credibility</li>
              <li>• Balance privacy with discoverability</li>
            </ul>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={loading}
              size="sm"
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
        </CardContent>
      </Card>
    </div>
  );
}
