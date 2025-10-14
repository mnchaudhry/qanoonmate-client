"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, MessageSquare, Save, Clock, Users, DollarSign } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { SubsectionHeader } from "./SubsectionHeader";
import { LawyerProfile, ProfileCompletionData } from "@/lib/types/profile.types";

interface NotificationsSectionProps {
  profile: LawyerProfile;
  completion: ProfileCompletionData;
  onUpdate: (updatedProfile: Partial<LawyerProfile>) => void;
}

const NOTIFICATION_FREQUENCIES = [
  { value: 'immediate', label: 'Immediate' },
  { value: 'daily', label: 'Daily Digest' },
  { value: 'weekly', label: 'Weekly Summary' },
  { value: 'never', label: 'Never' },
];

export function NotificationsSection({ }: NotificationsSectionProps) {
  const [form, setForm] = useState({
    emailNotifications: {
      newClients: true,
      messages: true,
      appointments: true,
      payments: true,
      reviews: true,
      systemUpdates: false,
    },
    pushNotifications: {
      newClients: true,
      messages: true,
      appointments: true,
      payments: false,
      reviews: true,
      systemUpdates: false,
    },
    smsNotifications: {
      newClients: false,
      messages: false,
      appointments: true,
      payments: true,
      reviews: false,
      systemUpdates: false,
    },
    frequency: 'immediate',
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00',
    },
  });

  const [loading, setLoading] = useState(false);

  const setField = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const setNotificationField = (type: keyof typeof form.emailNotifications, category: string, value: boolean) => {
    setForm(prev => ({
      ...prev,
      // @ts-expect-error 123
      [type]: { ...prev[type], [category]: value }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Implement notification settings update
      console.log('Notification settings updated:', form);

    } catch (error) {
      console.error('Error saving notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (category: string) => {
    switch (category) {
      case 'newClients': return <Users className="w-4 h-4" />;
      case 'messages': return <MessageSquare className="w-4 h-4" />;
      case 'appointments': return <Clock className="w-4 h-4" />;
      case 'payments': return <DollarSign className="w-4 h-4" />;
      case 'reviews': return <Bell className="w-4 h-4" />;
      case 'systemUpdates': return <Bell className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getNotificationLabel = (category: string) => {
    switch (category) {
      case 'newClients': return 'New Clients';
      case 'messages': return 'Messages';
      case 'appointments': return 'Appointments';
      case 'payments': return 'Payments';
      case 'reviews': return 'Reviews';
      case 'systemUpdates': return 'System Updates';
      default: return category;
    }
  };

  const getNotificationDescription = (category: string) => {
    switch (category) {
      case 'newClients': return 'When new clients contact you';
      case 'messages': return 'When you receive new messages';
      case 'appointments': return 'Appointment reminders and updates';
      case 'payments': return 'Payment confirmations and issues';
      case 'reviews': return 'New reviews and ratings';
      case 'systemUpdates': return 'Platform updates and maintenance';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <SectionHeader
          title="Notifications"
          description="Configure how and when you receive notifications"
          icon={<Bell className="w-4 h-4 text-primary" />}
          action={{
            label: "Save Changes",
            onClick: handleSave,
            variant: "default"
          }}
        />
        <CardContent className="space-y-4">
          {/* Email Notifications */}
          <div className="space-y-2">
            <SubsectionHeader title="Email Notifications" />
            <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/20">
              <div className="space-y-4">
                {Object.entries(form.emailNotifications).map(([category, enabled]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getNotificationIcon(category)}
                      <div className="space-y-1">
                        <Label className="text-sm font-medium text-foreground">
                          {getNotificationLabel(category)}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {getNotificationDescription(category)}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={enabled}
                      onCheckedChange={(checked) => setNotificationField('appointments', category, checked)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Push Notifications */}
          <div className="space-y-2">
            <SubsectionHeader title="Push Notifications" />
            <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/20">
              <div className="space-y-4">
                {Object.entries(form.pushNotifications).map(([category, enabled]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getNotificationIcon(category)}
                      <div className="space-y-1">
                        <Label className="text-sm font-medium text-foreground">
                          {getNotificationLabel(category)}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {getNotificationDescription(category)}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={enabled}
                      onCheckedChange={(checked) => setNotificationField('appointments', category, checked)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SMS Notifications */}
          <div className="space-y-2">
            <SubsectionHeader title="SMS Notifications" />
            <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/20">
              <div className="space-y-4">
                {Object.entries(form.smsNotifications).map(([category, enabled]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getNotificationIcon(category)}
                      <div className="space-y-1">
                        <Label className="text-sm font-medium text-foreground">
                          {getNotificationLabel(category)}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {getNotificationDescription(category)}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={enabled}
                      onCheckedChange={(checked) => setNotificationField('appointments', category, checked)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="space-y-2">
            <SubsectionHeader title="Notification Preferences" />
            <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/20">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Notification Frequency</Label>
                  <Select value={form.frequency} onValueChange={(value) => setField('frequency', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {NOTIFICATION_FREQUENCIES.map(freq => (
                        <SelectItem key={freq.value} value={freq.value}>
                          {freq.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    How often you want to receive notification summaries
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-foreground">Quiet Hours</Label>
                      <p className="text-xs text-muted-foreground">
                        Pause notifications during specific hours
                      </p>
                    </div>
                    <Switch
                      checked={form.quietHours.enabled}
                      onCheckedChange={(checked) => setField('quietHours', { ...form.quietHours, enabled: checked })}
                    />
                  </div>

                  {form.quietHours.enabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Time</Label>
                        <Select
                          value={form.quietHours.start}
                          onValueChange={(value) => setField('quietHours', { ...form.quietHours, start: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }, (_, i) => {
                              const hour = i.toString().padStart(2, '0');
                              return (
                                <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                                  {hour}:00
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>End Time</Label>
                        <Select
                          value={form.quietHours.end}
                          onValueChange={(value) => setField('quietHours', { ...form.quietHours, end: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }, (_, i) => {
                              const hour = i.toString().padStart(2, '0');
                              return (
                                <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                                  {hour}:00
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Notification Tips */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h4 className="font-medium text-primary mb-2">🔔 Notification Tips</h4>
            <ul className="text-sm text-primary/80 space-y-1">
              <li>• Enable push notifications for urgent matters like new clients</li>
              <li>• Use quiet hours to avoid notifications during sleep</li>
              <li>• Set up email digests for less urgent notifications</li>
              <li>• Review your notification settings regularly</li>
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
