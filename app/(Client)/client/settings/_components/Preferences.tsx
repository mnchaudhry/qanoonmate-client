"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Bell } from 'lucide-react'
import { updateClientSettings } from '@/store/reducers/clientSettingsSlice'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UserTheme } from '@/lib/enums'

const Preferences = () => {

  //////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////
  const { selectedSettings } = useSelector((state: RootState) => state.clientSettings)
  const dispatch = useDispatch<AppDispatch>()

  //////////////////////////////////////////////// STATE /////////////////////////////////////////////////
  const [formData, setFormData] = useState({
    theme: UserTheme.LIGHT,
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
      setFormData({
        theme: selectedSettings.preferences.theme || UserTheme.LIGHT,
        notification: {
          email: selectedSettings.preferences.notification?.email ?? true,
          sms: selectedSettings.preferences.notification?.sms ?? false,
          push: selectedSettings.preferences.notification?.push ?? true,
          newsletter: selectedSettings.preferences.notification?.newsletter ?? false,
        }
      })
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl ">
          <Bell className="h-5 w-5 text-primary" />
          Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select
              value={String(formData.theme)}
              onValueChange={v => handleInputChange('theme', v as UserTheme)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserTheme.LIGHT}>Light</SelectItem>
                <SelectItem value={UserTheme.DARK}>Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-4 pt-2">
          <div className="flex items-center space-x-3">
            <Checkbox 
              id="email" 
              checked={formData.notification.email} 
              onCheckedChange={v => handleNotificationChange('email', v as boolean)} 
            />
            <Label htmlFor="email">Email notifications</Label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox 
              id="sms" 
              checked={formData.notification.sms} 
              onCheckedChange={v => handleNotificationChange('sms', v as boolean)} 
            />
            <Label htmlFor="sms">SMS notifications</Label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox 
              id="push" 
              checked={formData.notification.push} 
              onCheckedChange={v => handleNotificationChange('push', v as boolean)} 
            />
            <Label htmlFor="push">Push notifications</Label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox 
              id="newsletter" 
              checked={formData.notification.newsletter} 
              onCheckedChange={v => handleNotificationChange('newsletter', v as boolean)} 
            />
            <Label htmlFor="newsletter">Newsletter updates</Label>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90" disabled={loading}>
            <Bell className="h-4 w-4 mr-2" />
            Update Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default Preferences
