"use client";

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getLawyerSettings, updatePreferences } from "@/store/reducers/lawyerSettingsSlice";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings2, Bell } from "lucide-react";
import { LawyerProfile, ProfileCompletionData } from "@/lib/types/profile.types";
import { SubsectionHeader } from "./SubsectionHeader";
import { Timezone, DateFormat, UserTheme, FontSize } from "@/lib/enums";

interface PreferencesSectionProps {
  profile: LawyerProfile;
  completion: ProfileCompletionData;
  onUpdate: (updatedProfile: Partial<LawyerProfile>) => void;
}

export function PreferencesSection({ }: PreferencesSectionProps) {

  /////////////////////////////////////////////////////// VARIABLES //////////////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>();
  const { selectedSettings } = useSelector((state: RootState) => state.lawyerSettings);
  const isInitialized = useRef(false);

  /////////////////////////////////////////////////////// STATES //////////////////////////////////////////////////////////////
  const [form, setForm] = useState({
    notification: { email: true, sms: false, push: true, newsletter: false, },
    timezone: Timezone.UTC,
    dateFormat: DateFormat.DD_MM_YYYY,
    theme: UserTheme.LIGHT,
    fontSize: FontSize.MEDIUM,
    highContrast: false,
  });
  const [loading, setLoading] = useState(false);

  /////////////////////////////////////////////////////// EFFECTS //////////////////////////////////////////////////////////////
  useEffect(() => {
    if (!selectedSettings) {
      dispatch(getLawyerSettings());
    }
  }, [dispatch, selectedSettings]);

  useEffect(() => {
    if (selectedSettings?.preferences && !isInitialized.current) {
      const prefs = selectedSettings.preferences;
      setForm({
        notification: {
          email: prefs.notification?.email ?? true,
          sms: prefs.notification?.sms ?? false,
          push: prefs.notification?.push ?? true,
          newsletter: prefs.notification?.newsletter ?? false
        },
        timezone: prefs.timezone || Timezone.UTC,
        dateFormat: prefs.dateFormat || DateFormat.DD_MM_YYYY,
        theme: prefs.theme || UserTheme.LIGHT,
        fontSize: prefs.fontSize || FontSize.MEDIUM,
        highContrast: prefs.highContrast || false,
      });
      isInitialized.current = true;
    }
  }, [selectedSettings]);

  /////////////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////////////////////
  const setField = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const setNotificationField = (field: keyof typeof form.notification, value: boolean) => {
    setForm(prev => ({
      ...prev,
      notification: { ...prev.notification, [field]: value }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await dispatch(updatePreferences({ updateData: form })).unwrap();
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  /////////////////////////////////////////////////////// RENDER //////////////////////////////////////////////////////////////
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <Settings2 className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Preferences</h2>
          <p className="text-sm text-muted-foreground mt-1">Customize your account preferences and settings</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Notification Preferences */}
        <Card>
          <CardHeader className="pb-4">
            <SubsectionHeader
              title="Notification Preferences"
              description="Configure how you receive notifications"
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-primary" />
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-foreground">Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive updates via email</p>
                </div>
              </div>
              <Switch
                checked={form.notification.email}
                onCheckedChange={(checked) => setNotificationField('email', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-primary" />
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-foreground">SMS Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive alerts via text message</p>
                </div>
              </div>
              <Switch
                checked={form.notification.sms}
                onCheckedChange={(checked) => setNotificationField('sms', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-primary" />
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-foreground">Push Notifications</Label>
                  <p className="text-xs text-muted-foreground">Get browser and mobile push notifications</p>
                </div>
              </div>
              <Switch
                checked={form.notification.push}
                onCheckedChange={(checked) => setNotificationField('push', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-primary" />
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-foreground">Newsletter</Label>
                  <p className="text-xs text-muted-foreground">Subscribe to newsletter and updates</p>
                </div>
              </div>
              <Switch
                checked={form.notification.newsletter}
                onCheckedChange={(checked) => setNotificationField('newsletter', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Regional & Display Settings */}
        <Card>
          <CardHeader className="pb-4">
            <SubsectionHeader
              title="Regional Settings"
              description="Configure timezone and date format preferences"
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select value={form.timezone} onValueChange={(value) => setField('timezone', value as Timezone)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Timezone).map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Your local timezone for appointments and scheduling</p>
            </div>

            <div className="space-y-2">
              <Label>Date Format</Label>
              <Select value={form.dateFormat} onValueChange={(value) => setField('dateFormat', value as DateFormat)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date format" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(DateFormat).map((format) => (
                    <SelectItem key={format} value={format}>
                      {format}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">How dates are displayed throughout the platform</p>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader className="pb-4">
            <SubsectionHeader
              title="Appearance"
              description="Customize the look and feel of your interface"
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select value={form.theme} onValueChange={(value) => setField('theme', value as UserTheme)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(UserTheme).map((theme) => (
                    <SelectItem key={theme} value={theme}>
                      {theme.charAt(0) + theme.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Choose between light, dark, or system theme</p>
            </div>

            <div className="space-y-2">
              <Label>Font Size</Label>
              <Select value={form.fontSize} onValueChange={(value) => setField('fontSize', value as FontSize)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select font size" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(FontSize).map((size) => (
                    <SelectItem key={size} value={size}>
                      {size.charAt(0) + size.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Adjust text size for better readability</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">High Contrast</Label>
                <p className="text-xs text-muted-foreground">Increase contrast for better visibility</p>
              </div>
              <Switch
                checked={form.highContrast}
                onCheckedChange={(checked) => setField('highContrast', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <Button
            onClick={handleSave}
            disabled={loading}
            size="lg"
            className="bg-primary hover:bg-primary/90"
          >
            {loading ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </div>
    </div>
  );
}
