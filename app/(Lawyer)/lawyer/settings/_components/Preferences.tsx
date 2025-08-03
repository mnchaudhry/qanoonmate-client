"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Bell } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Preferences, NotificationPreferences } from '@/store/types/lawyerSettings.types';
import { updateLawyerSettings } from '@/store/reducers/lawyerSettingsSlice';
import { DateFormat, FontSize, Timezone, UserTheme } from '@/lib/enums'
import { enumToLabel } from '@/lib/utils'

const TIMEZONES = Object.values(Timezone)
const DATE_FORMATS = Object.values(DateFormat).map(df => ({ label: df, value: enumToLabel(df) }))
const FONT_SIZES = Object.values(FontSize).map(fs => ({ label: fs, value: enumToLabel(fs) }))
const THEMES = Object.values(UserTheme).map(t => ({ label: t, value: enumToLabel(t) }))

const PreferencesComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedSettings } = useSelector((state: RootState) => state.lawyerSettings);

  // Extract preferences from selectedSettings
  const preferences: Preferences = selectedSettings?.preferences || {
    notification: {},
    timezone: Timezone.PST,
    dateFormat: DateFormat.DD_MM_YYYY,
    theme: UserTheme.LIGHT,
    fontSize: FontSize.MEDIUM,
    highContrast: false,
  };

  const [form, setForm] = useState<Preferences>({ ...preferences });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  console.log('success', success);

  useEffect(() => {
    if (!selectedSettings) return;
    setForm({
      ...selectedSettings.preferences,
      notification: {
        ...selectedSettings.preferences?.notification,
      },
    });
  }, [selectedSettings]);

  const setField = <K extends keyof Preferences>(k: K, v: Preferences[K]) => setForm(f => ({ ...f, [k]: v }));
  const setNotif = (k: keyof NotificationPreferences, v: boolean) => setForm(f => ({ ...f, notification: { ...f.notification, [k]: v } }));

  const handleSubmit = () => {
    setLoading(true);
    setSuccess(false);
    dispatch(updateLawyerSettings({
      ...selectedSettings,
      preferences: { ...form },
    }))
      .then(() => setSuccess(true))
      .finally(() => setLoading(false));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl ">
          <Bell className="h-5 w-5 text-primary" />
          Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-10">
        {/* Notification Preferences */}
        <section className="space-y-2 border-b pb-6 py-0 ">
          <div className="font-semibold mb-2 text-lg">Notification Preferences</div>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={!!form.notification.email} onCheckedChange={v => setNotif('email', !!v)} /> Email
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={!!form.notification.sms} onCheckedChange={v => setNotif('sms', !!v)} /> SMS
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={!!form.notification.push} onCheckedChange={v => setNotif('push', !!v)} /> Push
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={!!form.notification.newsletter} onCheckedChange={v => setNotif('newsletter', !!v)} /> Newsletter
            </label>
          </div>
        </section>
        {/* Language & Regional Settings */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b pb-6 py-0 ">
          <div>
            <Label htmlFor="timezone">Timezone</Label>
            <Select value={form.timezone} onValueChange={v => setField('timezone', v as Timezone)}>
              <SelectTrigger><SelectValue placeholder="Select timezone" /></SelectTrigger>
              <SelectContent>
                {TIMEZONES.map(tz => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="dateFormat">Date/Time Format</Label>
            <Select value={form.dateFormat} onValueChange={(v: DateFormat) => setField('dateFormat', v)}>
              <SelectTrigger><SelectValue placeholder="Select format" /></SelectTrigger>
              <SelectContent>
                {DATE_FORMATS.map(df => <SelectItem key={df.value} value={df.value}>{df.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </section>
        {/* Theme & Accessibility */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b pb-6 py-0 ">
          <div>
            <Label htmlFor="theme">Theme</Label>
            <Select value={form.theme} onValueChange={v => setField('theme', v as UserTheme)}>
              <SelectTrigger><SelectValue placeholder="Select theme" /></SelectTrigger>
              <SelectContent>
                {THEMES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="fontSize">Font Size</Label>
            <Select value={form.fontSize} onValueChange={v => setField('fontSize', v as FontSize)}>
              <SelectTrigger><SelectValue placeholder="Select size" /></SelectTrigger>
              <SelectContent>
                {FONT_SIZES.map(fs => <SelectItem key={fs.value} value={fs.value}>{fs.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 mt-6">
            <Checkbox checked={!!form.highContrast} onCheckedChange={v => setField('highContrast', !!v)} />
            <span>High-contrast mode</span>
          </div>
        </section>
        <div className="flex justify-end">
          <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90" disabled={loading}>
            Save Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreferencesComponent;
