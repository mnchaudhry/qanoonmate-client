"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Save, Clock, Mail, Phone, Video, Users } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { SubsectionHeader } from "./SubsectionHeader";
import { LawyerProfile, ProfileCompletionData } from "@/lib/types/profile.types";

interface CommunicationSectionProps {
  profile: LawyerProfile;
  completion: ProfileCompletionData;
  onUpdate: (updatedProfile: Partial<LawyerProfile>) => void;
}

const RESPONSE_TIME_OPTIONS = [
  { value: 'immediate', label: 'Immediate (within 1 hour)' },
  { value: 'same-day', label: 'Same Day (within 8 hours)' },
  { value: 'next-day', label: 'Next Day (within 24 hours)' },
  { value: '2-days', label: 'Within 2 Days' },
  { value: 'custom', label: 'Custom' },
];

const COMMUNICATION_PREFERENCES = [
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'phone', label: 'Phone Call', icon: Phone },
  { value: 'video', label: 'Video Call', icon: Video },
  { value: 'in-person', label: 'In-Person Meeting', icon: Users },
  { value: 'chat', label: 'Chat/Messaging', icon: MessageSquare },
];

export function CommunicationSection({ }: CommunicationSectionProps) {
  const [form, setForm] = useState({
    responseTime: 'same-day',
    customResponseTime: '',
    autoReply: {
      enabled: true,
      message: 'Thank you for your message. I will respond within 24 hours during business days.',
    },
    communicationPreferences: ['email', 'chat'],
    businessHours: {
      start: '09:00',
      end: '17:00',
      timezone: 'PKT',
      workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    },
    outOfOffice: {
      enabled: false,
      message: 'I am currently out of office and will respond upon my return.',
      returnDate: '',
    },
    clientCommunication: {
      allowDirectMessages: true,
      allowConsultationRequests: true,
      requireAppointmentBooking: false,
      sendReminders: true,
      reminderTime: '24', // hours before appointment
    },
  });

  const [loading, setLoading] = useState(false);

  const setField = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const setNestedField = (parent: string, field: string, value: any) => {
    setForm(prev => ({
      ...prev,
      [parent]: {
        ...((prev[parent as keyof typeof prev] as Record<string, any>) || {}),
        [field]: value
      }
    }));
  };

  const toggleCommunicationPreference = (preference: string) => {
    setForm(prev => ({
      ...prev,
      communicationPreferences: prev.communicationPreferences.includes(preference)
        ? prev.communicationPreferences.filter(p => p !== preference)
        : [...prev.communicationPreferences, preference]
    }));
  };

  const toggleWorkingDay = (day: string) => {
    setForm(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        workingDays: prev.businessHours.workingDays.includes(day)
          ? prev.businessHours.workingDays.filter(d => d !== day)
          : [...prev.businessHours.workingDays, day]
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Implement communication settings update
      console.log('Communication settings updated:', form);

    } catch (error) {
      console.error('Error saving communication settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const DAYS_OF_WEEK = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <SectionHeader
          title="Communication Preferences"
          description="Set your communication preferences and response settings"
          icon={<MessageSquare className="w-4 h-4 text-primary" />}
          action={{
            label: "Save Changes",
            onClick: handleSave,
            variant: "default"
          }}
        />
        <CardContent className="space-y-4">
          {/* Response Time */}
          <div className="space-y-2">
            <SubsectionHeader title="Response Time" />
            <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/20">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Expected Response Time</Label>
                  <Select value={form.responseTime} onValueChange={(value) => setField('responseTime', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RESPONSE_TIME_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {form.responseTime === 'custom' && (
                  <div className="space-y-2">
                    <Label>Custom Response Time</Label>
                    <Input
                      value={form.customResponseTime}
                      onChange={(e) => setField('customResponseTime', e.target.value)}
                      placeholder="e.g., Within 4 hours on weekdays"
                    />
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <h4 className="font-medium text-foreground">Response Commitment</h4>
                    <p className="text-sm text-muted-foreground">
                      {form.responseTime === 'custom' ? form.customResponseTime :
                        RESPONSE_TIME_OPTIONS.find(opt => opt.value === form.responseTime)?.label}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Auto Reply */}
          <div className="space-y-2">
            <SubsectionHeader title="Auto Reply" />
            <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/20">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-foreground">Enable Auto Reply</Label>
                    <p className="text-xs text-muted-foreground">Send automatic responses to new messages</p>
                  </div>
                  <Switch
                    checked={form.autoReply.enabled}
                    onCheckedChange={(checked) => setNestedField('autoReply', 'enabled', checked)}
                  />
                </div>

                {form.autoReply.enabled && (
                  <div className="space-y-2">
                    <Label>Auto Reply Message</Label>
                    <Textarea
                      value={form.autoReply.message}
                      onChange={(e) => setNestedField('autoReply', 'message', e.target.value)}
                      placeholder="Enter your auto reply message"
                      rows={3}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Communication Preferences */}
          <div className="space-y-2">
            <SubsectionHeader title="Preferred Communication Methods" />
            <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/20">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Select your preferred communication methods</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {COMMUNICATION_PREFERENCES.map((preference) => {
                    const Icon = preference.icon;
                    const isSelected = form.communicationPreferences.includes(preference.value);
                    return (
                      <div
                        key={preference.value}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                          }`}
                        onClick={() => toggleCommunicationPreference(preference.value)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded border-2 ${isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'
                            }`}>
                            {isSelected && (
                              <div className="w-full h-full rounded-sm bg-white scale-50" />
                            )}
                          </div>
                          <Icon className="w-4 h-4 text-foreground" />
                          <span className="text-sm font-medium text-foreground">{preference.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="space-y-2">
            <SubsectionHeader title="Business Hours" />
            <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/20">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={form.businessHours.start}
                      onChange={(e) => setNestedField('businessHours', 'start', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={form.businessHours.end}
                      onChange={(e) => setNestedField('businessHours', 'end', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select value={form.businessHours.timezone} onValueChange={(value) => setNestedField('businessHours', 'timezone', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PKT">PKT (Pakistan Standard Time)</SelectItem>
                        <SelectItem value="IST">IST (India Standard Time)</SelectItem>
                        <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Working Days</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {DAYS_OF_WEEK.map((day) => (
                      <div
                        key={day.value}
                        className={`p-2 border rounded-lg cursor-pointer transition-all text-center ${form.businessHours.workingDays.includes(day.value)
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border hover:border-primary/50'
                          }`}
                        onClick={() => toggleWorkingDay(day.value)}
                      >
                        <span className="text-sm font-medium">{day.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Out of Office */}
          <div className="space-y-2">
            <SubsectionHeader title="Out of Office" />
            <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/20">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-foreground">Enable Out of Office</Label>
                    <p className="text-xs text-muted-foreground">Set automatic out of office message</p>
                  </div>
                  <Switch
                    checked={form.outOfOffice.enabled}
                    onCheckedChange={(checked) => setNestedField('outOfOffice', 'enabled', checked)}
                  />
                </div>

                {form.outOfOffice.enabled && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Out of Office Message</Label>
                      <Textarea
                        value={form.outOfOffice.message}
                        onChange={(e) => setNestedField('outOfOffice', 'message', e.target.value)}
                        placeholder="Enter your out of office message"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Return Date</Label>
                      <Input
                        type="date"
                        value={form.outOfOffice.returnDate}
                        onChange={(e) => setNestedField('outOfOffice', 'returnDate', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Client Communication */}
          <div className="space-y-2">
            <SubsectionHeader title="Client Communication" />
            <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/20">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-foreground">Allow Direct Messages</Label>
                    <p className="text-xs text-muted-foreground">Let clients send you direct messages</p>
                  </div>
                  <Switch
                    checked={form.clientCommunication.allowDirectMessages}
                    onCheckedChange={(checked) => setNestedField('clientCommunication', 'allowDirectMessages', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-foreground">Allow Consultation Requests</Label>
                    <p className="text-xs text-muted-foreground">Let clients request consultations</p>
                  </div>
                  <Switch
                    checked={form.clientCommunication.allowConsultationRequests}
                    onCheckedChange={(checked) => setNestedField('clientCommunication', 'allowConsultationRequests', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-foreground">Require Appointment Booking</Label>
                    <p className="text-xs text-muted-foreground">Force clients to book appointments</p>
                  </div>
                  <Switch
                    checked={form.clientCommunication.requireAppointmentBooking}
                    onCheckedChange={(checked) => setNestedField('clientCommunication', 'requireAppointmentBooking', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-foreground">Send Appointment Reminders</Label>
                    <p className="text-xs text-muted-foreground">Automatically send reminders before appointments</p>
                  </div>
                  <Switch
                    checked={form.clientCommunication.sendReminders}
                    onCheckedChange={(checked) => setNestedField('clientCommunication', 'sendReminders', checked)}
                  />
                </div>

                {form.clientCommunication.sendReminders && (
                  <div className="space-y-2">
                    <Label>Reminder Time (hours before appointment)</Label>
                    <Select value={form.clientCommunication.reminderTime} onValueChange={(value) => setNestedField('clientCommunication', 'reminderTime', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hour</SelectItem>
                        <SelectItem value="2">2 hours</SelectItem>
                        <SelectItem value="4">4 hours</SelectItem>
                        <SelectItem value="12">12 hours</SelectItem>
                        <SelectItem value="24">24 hours</SelectItem>
                        <SelectItem value="48">48 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Communication Tips */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h4 className="font-medium text-primary mb-2">💬 Communication Tips</h4>
            <ul className="text-sm text-primary/80 space-y-1">
              <li>• Set realistic response times to manage client expectations</li>
              <li>• Use auto-reply to acknowledge messages immediately</li>
              <li>• Enable appointment reminders to reduce no-shows</li>
              <li>• Keep your business hours updated and accurate</li>
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
