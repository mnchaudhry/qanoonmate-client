"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Bell, Palette, Globe, Clock } from 'lucide-react'
import { updateClientSettings } from '@/store/reducers/clientSettingsSlice'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { UserTheme } from '@/lib/enums'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const Preferences = () => {

  //////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////
  const { selectedSettings } = useSelector((state: RootState) => state.clientSettings)
  const dispatch = useDispatch<AppDispatch>()

  //////////////////////////////////////////////// STATE /////////////////////////////////////////////////
  const [formData, setFormData] = useState({
    theme: UserTheme.LIGHT,
    language: 'english',
    timeFormat: '12h',
    dateFormat: 'mm/dd/yyyy',
    notification: {
      email: true,
      sms: false,
      push: true,
      newsletter: false
    }
  })
  const [loading, setLoading] = useState(false)

  //////////////////////////////////////////////// EFFECTS /////////////////////////////////////////////////
  useEffect(() => {
    if (selectedSettings?.preferences) {
      setFormData(prev => ({
        ...prev,
        theme: selectedSettings.preferences.theme || UserTheme.LIGHT,
        notification: {
          email: selectedSettings.preferences.notification?.email ?? true,
          sms: selectedSettings.preferences.notification?.sms ?? false,
          push: selectedSettings.preferences.notification?.push ?? true,
          newsletter: selectedSettings.preferences.notification?.newsletter ?? false,
        }
      }))
    }
  }, [selectedSettings?.preferences])

  //////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNotificationChange = (field: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      notification: {
        ...prev.notification,
        [field]: value
      }
    }))
  }

  const handleSubmit = () => {
    setLoading(true)

    dispatch(updateClientSettings({
      preferences: {
        theme: formData.theme,
        notification: formData.notification
      }
    }))
      .finally(() => setLoading(false))
  }

  //////////////////////////////////////////////// RENDER /////////////////////////////////////////////////
  return (
    <div className="space-y-6">
      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Palette className="h-5 w-5 text-primary" />
            Appearance & Display
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="theme">Interface Theme</Label>
              <Select
                value={String(formData.theme)}
                onValueChange={v => handleInputChange('theme', v as UserTheme)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserTheme.LIGHT}>Light Mode</SelectItem>
                  <SelectItem value={UserTheme.DARK}>Dark Mode</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">Choose your preferred color scheme</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={formData.language}
                onValueChange={v => handleInputChange('language', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="urdu">Urdu</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">Interface language preference</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeFormat">Time Format</Label>
              <Select
                value={formData.timeFormat}
                onValueChange={v => handleInputChange('timeFormat', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                  <SelectItem value="24h">24-hour</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">How time is displayed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateFormat">Date Format</Label>
              <Select
                value={formData.dateFormat}
                onValueChange={v => handleInputChange('dateFormat', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select date format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                  <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">How dates are displayed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-primary" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-slate-700">Communication</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">Email Notifications</Label>
                    <p className="text-xs text-slate-500">Important updates via email</p>
                  </div>
                  <Switch 
                    id="email" 
                    checked={formData.notification.email} 
                    onCheckedChange={v => handleNotificationChange('email', v as boolean)} 
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                  <div>
                    <Label htmlFor="sms" className="text-sm font-medium">SMS Notifications</Label>
                    <p className="text-xs text-slate-500">Critical alerts via text</p>
                  </div>
                  <Switch 
                    id="sms" 
                    checked={formData.notification.sms} 
                    onCheckedChange={v => handleNotificationChange('sms', v as boolean)} 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-slate-700">Platform</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                  <div>
                    <Label htmlFor="push" className="text-sm font-medium">Push Notifications</Label>
                    <p className="text-xs text-slate-500">Real-time app notifications</p>
                  </div>
                  <Switch 
                    id="push" 
                    checked={formData.notification.push} 
                    onCheckedChange={v => handleNotificationChange('push', v as boolean)} 
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                  <div>
                    <Label htmlFor="newsletter" className="text-sm font-medium">Newsletter Updates</Label>
                    <p className="text-xs text-slate-500">Product news and updates</p>
                  </div>
                  <Switch 
                    id="newsletter" 
                    checked={formData.notification.newsletter} 
                    onCheckedChange={v => handleNotificationChange('newsletter', v as boolean)} 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90" disabled={loading}>
              <Bell className="h-4 w-4 mr-2" />
              {loading ? 'Updating...' : 'Update Preferences'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Preferences
