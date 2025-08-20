"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Mail, Smartphone, Clock, Settings, Save, Loader2, AlertCircle } from "lucide-react";
import { User as UserType } from "@/store/types/user.types";
import { toast } from "react-hot-toast";

interface NotificationPreferencesProps {
  user: UserType | null;
}

interface NotificationSettings {
  email: {
    consultations: boolean;
    messages: boolean;
    updates: boolean;
    marketing: boolean;
  };
  push: {
    consultations: boolean;
    messages: boolean;
    updates: boolean;
    reminders: boolean;
  };
  sms: {
    consultations: boolean;
    reminders: boolean;
    updates: boolean;
  };
  frequency: 'immediate' | 'daily' | 'weekly';
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export default function NotificationPreferences({ user }: NotificationPreferencesProps) {


  //////////////////////////////////////////////////// VARIABLES //////////////////////////////////////////////////////////
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalSettings, setOriginalSettings] = useState<NotificationSettings | null>(null);

  //////////////////////////////////////////////////// EFFECTS //////////////////////////////////////////////////////////
  useEffect(() => {
    if (user) {
      fetchNotificationSettings();
    }
  }, [user]);

  //////////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////////////////
  const fetchNotificationSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/profile/me/notifications', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        const fetchedSettings = data.data.preferences;
        setSettings(fetchedSettings);
        setOriginalSettings(fetchedSettings);
      } else {
        throw new Error('Failed to fetch notification settings');
      }
    } catch (error) {
      console.error('Failed to fetch notification settings:', error);
      setError('Failed to load notification preferences');
      // Set default settings if API fails
      const defaultSettings: NotificationSettings = {
        email: {
          consultations: true,
          messages: true,
          updates: true,
          marketing: false
        },
        push: {
          consultations: true,
          messages: true,
          updates: true,
          reminders: true
        },
        sms: {
          consultations: false,
          reminders: false,
          updates: false
        },
        frequency: 'immediate',
        quietHours: {
          enabled: false,
          start: '22:00',
          end: '08:00'
        }
      };
      setSettings(defaultSettings);
      setOriginalSettings(defaultSettings);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (category: keyof NotificationSettings, key: string, value: boolean) => {
    if (!settings) return;

    setSettings(prev => {
      if (!prev) return prev;
      const newSettings = { ...prev };
      if (category === 'email' || category === 'push' || category === 'sms') {
        (newSettings[category] as any)[key] = value;
      }
      return newSettings;
    });
    setHasChanges(true);
  };

  const handleFrequencyChange = (frequency: 'immediate' | 'daily' | 'weekly') => {
    if (!settings) return;
    setSettings(prev => prev ? { ...prev, frequency } : prev);
    setHasChanges(true);
  };

  const handleQuietHoursToggle = (enabled: boolean) => {
    if (!settings) return;
    setSettings(prev => prev ? {
      ...prev,
      quietHours: { ...prev.quietHours, enabled }
    } : prev);
    setHasChanges(true);
  };

  const handleTimeChange = (type: 'start' | 'end', value: string) => {
    if (!settings) return;
    setSettings(prev => prev ? {
      ...prev,
      quietHours: { ...prev.quietHours, [type]: value }
    } : prev);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!settings) return;

    try {
      setIsSaving(true);

      const response = await fetch('/api/profile/me/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences: settings }),
        credentials: 'include'
      });

      if (response.ok) {
        toast.success('Notification preferences updated successfully!');
        setOriginalSettings(settings);
        setHasChanges(false);
      } else {
        throw new Error('Failed to update notification preferences');
      }
    } catch (error) {
      console.error('Failed to update notification preferences:', error);
      toast.error('Failed to update notification preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (originalSettings) {
      setSettings(originalSettings);
      setHasChanges(false);
    }
  };

  //////////////////////////////////////////////////// RENDER //////////////////////////////////////////////////////////
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-slate-900">Notification Preferences</h4>
            <p className="text-sm text-slate-600">Customize how and when you receive notifications</p>
          </div>
        </div>

        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-slate-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading preferences...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error && !settings) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-slate-900">Notification Preferences</h4>
            <p className="text-sm text-slate-600">Customize how and when you receive notifications</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-rose-600" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">Failed to load preferences</h3>
            <p className="text-slate-600 mb-4">{error}</p>
            <Button onClick={fetchNotificationSettings} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-slate-900">Notification Preferences</h4>
            <p className="text-sm text-slate-600">Customize how and when you receive notifications</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No preferences found</h3>
            <p className="text-slate-600">Unable to load your notification preferences.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold text-slate-900">Notification Preferences</h4>
          <p className="text-sm text-slate-600">Customize how and when you receive notifications</p>
        </div>

        {hasChanges && (
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleReset} disabled={isSaving}>
              Reset
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
        )}
      </div>

      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Email Notifications</h3>
              <p className="text-sm text-slate-600 font-normal">Receive important updates via email</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
              <div>
                <Label htmlFor="email-consultations" className="text-sm font-medium">Consultations</Label>
                <p className="text-xs text-slate-500">Booking confirmations and updates</p>
              </div>
              <Switch
                id="email-consultations"
                checked={settings.email.consultations}
                onCheckedChange={(checked) => handleToggle('email', 'consultations', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
              <div>
                <Label htmlFor="email-messages" className="text-sm font-medium">Messages</Label>
                <p className="text-xs text-slate-500">Direct messages from lawyers</p>
              </div>
              <Switch
                id="email-messages"
                checked={settings.email.messages}
                onCheckedChange={(checked) => handleToggle('email', 'messages', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
              <div>
                <Label htmlFor="email-updates" className="text-sm font-medium">Platform Updates</Label>
                <p className="text-xs text-slate-500">New features and announcements</p>
              </div>
              <Switch
                id="email-updates"
                checked={settings.email.updates}
                onCheckedChange={(checked) => handleToggle('email', 'updates', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
              <div>
                <Label htmlFor="email-marketing" className="text-sm font-medium">Marketing</Label>
                <p className="text-xs text-slate-500">Promotional content and offers</p>
              </div>
              <Switch
                id="email-marketing"
                checked={settings.email.marketing}
                onCheckedChange={(checked) => handleToggle('email', 'marketing', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Push Notifications</h3>
              <p className="text-sm text-slate-600 font-normal">Real-time notifications on your device</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
              <div>
                <Label htmlFor="push-consultations" className="text-sm font-medium">Consultations</Label>
                <p className="text-xs text-slate-500">Booking confirmations and updates</p>
              </div>
              <Switch
                id="push-consultations"
                checked={settings.push.consultations}
                onCheckedChange={(checked) => handleToggle('push', 'consultations', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
              <div>
                <Label htmlFor="push-messages" className="text-sm font-medium">Messages</Label>
                <p className="text-xs text-slate-500">Direct messages from lawyers</p>
              </div>
              <Switch
                id="push-messages"
                checked={settings.push.messages}
                onCheckedChange={(checked) => handleToggle('push', 'messages', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
              <div>
                <Label htmlFor="push-updates" className="text-sm font-medium">Platform Updates</Label>
                <p className="text-xs text-slate-500">New features and announcements</p>
              </div>
              <Switch
                id="push-updates"
                checked={settings.push.updates}
                onCheckedChange={(checked) => handleToggle('push', 'updates', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
              <div>
                <Label htmlFor="push-reminders" className="text-sm font-medium">Reminders</Label>
                <p className="text-xs text-slate-500">Appointment and task reminders</p>
              </div>
              <Switch
                id="push-reminders"
                checked={settings.push.reminders}
                onCheckedChange={(checked) => handleToggle('push', 'reminders', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SMS Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">SMS Notifications</h3>
              <p className="text-sm text-slate-600 font-normal">Important alerts via text message</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
              <div>
                <Label htmlFor="sms-consultations" className="text-sm font-medium">Consultations</Label>
                <p className="text-xs text-slate-500">Critical booking updates</p>
              </div>
              <Switch
                id="sms-consultations"
                checked={settings.sms.consultations}
                onCheckedChange={(checked) => handleToggle('sms', 'consultations', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
              <div>
                <Label htmlFor="sms-reminders" className="text-sm font-medium">Reminders</Label>
                <p className="text-xs text-slate-500">Important appointment reminders</p>
              </div>
              <Switch
                id="sms-reminders"
                checked={settings.sms.reminders}
                onCheckedChange={(checked) => handleToggle('sms', 'reminders', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
              <div>
                <Label htmlFor="sms-updates" className="text-sm font-medium">Updates</Label>
                <p className="text-xs text-slate-500">Critical platform updates</p>
              </div>
              <Switch
                id="sms-updates"
                checked={settings.sms.updates}
                onCheckedChange={(checked) => handleToggle('sms', 'updates', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Frequency & Quiet Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Frequency */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Notification Frequency</h3>
                <p className="text-sm text-slate-600 font-normal">How often to receive notifications</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={settings.frequency} onValueChange={handleFrequencyChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
                <SelectItem value="weekly">Weekly Summary</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500 mt-2">
              {settings.frequency === 'immediate' && 'Receive notifications as they happen'}
              {settings.frequency === 'daily' && 'Get a daily summary of all notifications'}
              {settings.frequency === 'weekly' && 'Get a weekly summary of all notifications'}
            </p>
          </CardContent>
        </Card>

        {/* Quiet Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Quiet Hours</h3>
                <p className="text-sm text-slate-600 font-normal">Pause notifications during specific hours</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="quiet-hours-toggle" className="text-sm font-medium">Enable Quiet Hours</Label>
              <Switch
                id="quiet-hours-toggle"
                checked={settings.quietHours.enabled}
                onCheckedChange={handleQuietHoursToggle}
              />
            </div>

            {settings.quietHours.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quiet-start" className="text-sm">Start Time</Label>
                  <input
                    id="quiet-start"
                    type="time"
                    value={settings.quietHours.start}
                    onChange={(e) => handleTimeChange('start', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quiet-end" className="text-sm">End Time</Label>
                  <input
                    id="quiet-end"
                    type="time"
                    value={settings.quietHours.end}
                    onChange={(e) => handleTimeChange('end', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Save Status */}
      {hasChanges && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800">You have unsaved changes</p>
              <p className="text-xs text-amber-700">Save your notification preferences to apply the changes</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
