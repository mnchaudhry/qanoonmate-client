"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Clock, Save } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { SubsectionHeader } from "./SubsectionHeader";
import { LawyerProfile, ProfileCompletionData } from "@/lib/types/profile.types";

interface AvailabilitySectionProps {
  profile: LawyerProfile;
  completion: ProfileCompletionData;
  onUpdate: (updatedProfile: Partial<LawyerProfile>) => void;
}

const TIMEZONES = [
  { value: 'Asia/Karachi', label: 'Pakistan Standard Time (PKT)' },
  { value: 'Asia/Dubai', label: 'Gulf Standard Time (GST)' },
  { value: 'UTC', label: 'Coordinated Universal Time (UTC)' },
];

const DAYS_OF_WEEK = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
];

export function AvailabilitySection({ profile, onUpdate }: AvailabilitySectionProps) {
  const [form, setForm] = useState({
    timezone: profile.services.availability.timezone,
    workingDays: profile.services.availability.workingDays,
    exceptions: profile.services.availability.exceptions,
  });

  const [loading, setLoading] = useState(false);

  const setField = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleDayAvailability = (day: string) => {
    setForm(prev => ({
      ...prev,
      workingDays: {
        ...prev.workingDays,
        [day]: prev.workingDays[day as keyof typeof prev.workingDays].length > 0 ? [] : ['09:00', '17:00']
      }
    }));
  };

  const updateDayTimeSlots = (day: string, slots: string[]) => {
    setForm(prev => ({
      ...prev,
      workingDays: {
        ...prev.workingDays,
        [day]: slots as any
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedProfile: Partial<LawyerProfile> = {
        services: {
          ...profile.services,
          availability: {
            timezone: form.timezone,
            workingDays: form.workingDays,
            exceptions: form.exceptions,
          }
        }
      };

      onUpdate(updatedProfile);

    } catch (error) {
      console.error('Error saving availability settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <SectionHeader
          title="Availability Settings"
          description="Set your working hours, timezone, and availability schedule"
          icon={<Clock className="w-4 h-4 text-primary" />}
          action={{
            label: "Save Changes",
            onClick: handleSave,
            variant: "default"
          }}
        />
        <CardContent className="space-y-4">
          {/* Timezone */}
          <div className="space-y-2">
            <SubsectionHeader title="Timezone" />
            <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/20">
              <div className="space-y-2">
                <Select value={form.timezone} onValueChange={(value) => setField('timezone', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map(timezone => (
                      <SelectItem key={timezone.value} value={timezone.value}>
                        {timezone.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              <p className="text-sm text-muted-foreground">
                This ensures clients see your availability in their local time.
              </p>
              </div>
            </div>
          </div>

          {/* Working Days */}
          <div className="space-y-2">
            <SubsectionHeader title="Working Days" />
            <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/20">
              <div className="space-y-4">
                {DAYS_OF_WEEK.map(day => {
                  const daySlots = form.workingDays[day.value as keyof typeof form.workingDays];
                  const isAvailable = daySlots.length > 0;

                  return (
                    <div key={day.value} className="p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={isAvailable}
                            onCheckedChange={() => toggleDayAvailability(day.value)}
                          />
                          <Label className="font-medium text-foreground">{day.label}</Label>
                        </div>
                        {isAvailable && (
                          <span className="text-sm text-muted-foreground">
                            {daySlots.length > 0 ? `${daySlots[0]} - ${daySlots[daySlots.length - 1]}` : 'Not available'}
                          </span>
                        )}
                      </div>

                      {isAvailable && (
                        <div className="ml-8">
                          <Label className="text-sm text-muted-foreground mb-2 block">
                            Available time slots
                          </Label>
                          <div className="grid grid-cols-6 gap-2">
                            {TIME_SLOTS.map(slot => (
                              <button
                                key={slot}
                                onClick={() => {
                                  const daySlotsArray = daySlots as unknown as string[];
                                  const newSlots = daySlotsArray.includes(slot)
                                    ? daySlotsArray.filter(s => s !== slot)
                                    : [...daySlotsArray, slot].sort();
                                  updateDayTimeSlots(day.value, newSlots);
                                }}
                                className={`px-2 py-1 text-xs rounded border transition-colors ${(daySlots as unknown as string[]).includes(slot)
                                  ? 'bg-primary text-primary-foreground border-primary'
                                  : 'bg-background text-foreground border-border hover:border-primary/50'
                                  }`}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                 })}
              </div>
            </div>
          </div>

          {/* Availability Tips */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h4 className="font-medium text-primary mb-2">💡 Availability Tips</h4>
            <ul className="text-sm text-primary/80 space-y-1">
              <li>• Set realistic working hours to maintain work-life balance</li>
              <li>• Consider your most productive hours when setting availability</li>
              <li>• Update your schedule regularly to reflect changes</li>
              <li>• Use exceptions for holidays and time off</li>
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
