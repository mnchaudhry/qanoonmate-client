"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Settings, Plus, X, Clock, DollarSign, Video, Phone, Users, MessageSquare } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { SubsectionHeader } from "./SubsectionHeader";
import { LawyerProfile, ProfileCompletionData, ConsultationFee } from "@/lib/types/profile.types";

interface ConsultationSettingsSectionProps {
  profile: LawyerProfile;
  completion: ProfileCompletionData;
  onUpdate: (updatedProfile: Partial<LawyerProfile>) => void;
}

const CONSULTATION_MODES = [
  { value: 'video', label: 'Video Call', description: 'Face-to-face consultation via video' },
  { value: 'phone', label: 'Phone Call', description: 'Voice consultation over phone' },
  { value: 'in-person', label: 'In-Person', description: 'Physical meeting at your office' },
  { value: 'chat', label: 'Chat', description: 'Text-based consultation' },
];

const DURATION_OPTIONS = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
];

const RESPONSE_TIME_OPTIONS = [
  { value: '1 hour', label: 'Within 1 hour' },
  { value: '4 hours', label: 'Within 4 hours' },
  { value: '24 hours', label: 'Within 24 hours' },
  { value: '48 hours', label: 'Within 48 hours' },
  { value: '1 week', label: 'Within 1 week' },
];

export function ConsultationSettingsSection({ profile, onUpdate }: ConsultationSettingsSectionProps) {
  const [form, setForm] = useState({
    consultationFees: profile.services.consultationFees,
    responseTime: profile.services.responseTime,
    consultationModes: profile.services.consultationModes,
  });

  const [loading, setLoading] = useState(false);
  const [newFee, setNewFee] = useState<ConsultationFee>({
    mode: 'video',
    duration: 30,
    price: 0,
    currency: 'PKR',
    description: ''
  });

  const setField = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const addConsultationFee = () => {
    if (newFee.price > 0) {
      setForm(prev => ({
        ...prev,
        consultationFees: [...prev.consultationFees, newFee]
      }));
      setNewFee({
        mode: 'video',
        duration: 30,
        price: 0,
        currency: 'PKR',
        description: ''
      });
    }
  };

  const removeConsultationFee = (index: number) => {
    setForm(prev => ({
      ...prev,
      consultationFees: prev.consultationFees.filter((_, i) => i !== index)
    }));
  };

  const toggleConsultationMode = (mode: string) => {
    setForm(prev => ({
      ...prev,
      consultationModes: prev.consultationModes.includes(mode)
        ? prev.consultationModes.filter(m => m !== mode)
        : [...prev.consultationModes, mode]
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedProfile: Partial<LawyerProfile> = {
        services: {
          ...profile.services,
          consultationFees: form.consultationFees,
          responseTime: form.responseTime,
          consultationModes: form.consultationModes,
        }
      };

      onUpdate(updatedProfile);

      // TODO: Call API to save changes
      // await dispatch(updateMeLawyer(updatedProfile));

    } catch (error) {
      console.error('Error saving consultation settings:', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="space-y-6">
      <Card className="border-border">
        <SectionHeader
          title="Consultation Settings"
          description="Set up your consultation preferences, fees, and response times to start receiving client inquiries."
          icon={<Settings className="w-4 h-4 text-primary" />}
          action={{
            label: "Save Changes",
            onClick: handleSave,
            variant: "default"
          }}
        />
        <CardContent className="space-y-4">
          {/* Consultation Modes */}
          <div className="space-y-2">
            <SubsectionHeader title="Consultation Modes" />
            <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CONSULTATION_MODES.map(mode => {
                  const getModeIcon = (modeValue: string) => {
                    switch (modeValue) {
                      case 'video': return <Video className="w-4 h-4" />;
                      case 'phone': return <Phone className="w-4 h-4" />;
                      case 'in-person': return <Users className="w-4 h-4" />;
                      case 'chat': return <MessageSquare className="w-4 h-4" />;
                      default: return <Video className="w-4 h-4" />;
                    }
                  };

                  return (
                    <div
                      key={mode.value}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${form.consultationModes.includes(mode.value)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                        }`}
                      onClick={() => toggleConsultationMode(mode.value)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded border-2 ${form.consultationModes.includes(mode.value)
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground'
                          }`}>
                          {form.consultationModes.includes(mode.value) && (
                            <div className="w-full h-full rounded-sm bg-white scale-50" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {getModeIcon(mode.value)}
                          <div>
                            <h4 className="font-medium text-foreground">{mode.label}</h4>
                            <p className="text-sm text-muted-foreground">{mode.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Consultation Fees */}
          <div className="space-y-2">
            <SubsectionHeader title="Consultation Fees" />

            <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/20">
              {form.consultationFees.length > 0 && (
                <div className="space-y-3 mb-4">
                  {form.consultationFees.map((fee, index) => {
                    const mode = CONSULTATION_MODES.find(m => m.value === fee.mode);
                    const duration = DURATION_OPTIONS.find(d => d.value === fee.duration);

                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">{mode?.label}</h4>
                            <p className="text-sm text-muted-foreground">
                              {duration?.label} • {fee.price} {fee.currency}
                            </p>
                            {fee.description && (
                              <p className="text-sm text-muted-foreground">{fee.description}</p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeConsultationFee(index)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Consultation Mode</Label>
                  <Select value={newFee.mode} onValueChange={(value) => setNewFee(prev => ({ ...prev, mode: value as any }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CONSULTATION_MODES.map(mode => (
                        <SelectItem key={mode.value} value={mode.value}>
                          {mode.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Select value={newFee.duration.toString()} onValueChange={(value) => setNewFee(prev => ({ ...prev, duration: Number(value) }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DURATION_OPTIONS.map(duration => (
                        <SelectItem key={duration.value} value={duration.value.toString()}>
                          {duration.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Price (PKR)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={newFee.price}
                    onChange={(e) => setNewFee(prev => ({ ...prev, price: Number(e.target.value) }))}
                    placeholder="Enter consultation fee"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={newFee.currency} onValueChange={(value) => setNewFee(prev => ({ ...prev, currency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PKR">PKR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <Label>Description (Optional)</Label>
                <Input
                  value={newFee.description}
                  onChange={(e) => setNewFee(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g., Initial consultation includes case review"
                />
              </div>
              <Button
                onClick={addConsultationFee}
                disabled={newFee.price <= 0}
                className="mt-4"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Fee
              </Button>
            </div>
          </div>

          {/* Response Time */}
          <div className="space-y-2">
            <SubsectionHeader title="Response Time" />
            <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/20">
              <div className="space-y-2">
                <Select value={form.responseTime} onValueChange={(value) => setField('responseTime', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select response time" />
                  </SelectTrigger>
                  <SelectContent>
                    {RESPONSE_TIME_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  This helps clients know when to expect a response from you.
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Tips */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h4 className="font-medium text-primary mb-2">💡 Pricing Tips</h4>
            <ul className="text-sm text-primary/80 space-y-1">
              <li>• Start with competitive rates to build your client base</li>
              <li>• Consider offering different rates for different consultation types</li>
              <li>• You can always adjust your fees later based on demand</li>
              <li>• Include any additional services in your description</li>
            </ul>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={loading || form.consultationFees.length === 0}
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
