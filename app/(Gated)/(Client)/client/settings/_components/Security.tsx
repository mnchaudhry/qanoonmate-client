import React, { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { ShieldCheck, Lock, Smartphone, Clock, Shield } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { updateClientSecurity } from '@/store/reducers/clientSettingsSlice'
import { SubsectionHeader } from './sections/SubsectionHeader'
import PasswordManagement from './PasswordManagement'

const Security = () => {

  //////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>()
  const { selectedSettings } = useSelector((state: RootState) => state.clientSettings)
  const { user } = useSelector((state: RootState) => state.auth)

  //////////////////////////////////////////////// STATE /////////////////////////////////////////////////
  const [loading, setLoading] = useState(false)

  //////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////
  const handleToggle2FA = () => {
    setLoading(true)
    dispatch(updateClientSecurity({
      twoFactorEnabled: !selectedSettings?.security?.twoFactorEnabled
    }))
      .finally(() => setLoading(false))
  }

  const formatDate = (dateString?: Date | string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  //////////////////////////////////////////////// RENDER /////////////////////////////////////////////////
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <Shield className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Security & Privacy</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage your account security settings and two-factor authentication</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Two-Factor Authentication */}
        <Card>
          <CardHeader className="pb-4">
            <SubsectionHeader
              title="Two-Factor Authentication"
              description="Add an extra layer of security to your account"
            />
          </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
            <div className="space-y-1">
              <p className="text-sm font-medium">Enable 2FA</p>
              <p className="text-xs text-slate-500">
                {selectedSettings?.security?.twoFactorEnabled
                  ? "Two-factor authentication is currently enabled"
                  : "Add an extra layer of security to your account"
                }
              </p>
            </div>
            <Switch
              checked={selectedSettings?.security?.twoFactorEnabled}
              onCheckedChange={handleToggle2FA}
              disabled={loading}
            />
          </div>

          {selectedSettings?.security?.twoFactorEnabled && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-emerald-800">2FA is active</p>
                  <p className="text-xs text-emerald-700">Your account is protected with two-factor authentication</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

        {/* Security Information */}
        <Card>
          <CardHeader className="pb-4">
            <SubsectionHeader
              title="Security Information"
              description="View your account security activity"
            />
          </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-slate-200">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium">Password Last Updated</span>
              </div>
              <p className="text-sm text-slate-600">
                {formatDate(selectedSettings?.security?.passwordUpdatedAt)}
              </p>
            </div>

            <div className="p-4 rounded-lg border border-slate-200">
              <div className="flex items-center gap-3 mb-2">
                <Smartphone className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium">Last Login</span>
              </div>
              <p className="text-sm text-slate-600">
                {formatDate(user?.lastLogin || null)}
              </p>
            </div>
          </div>

          {selectedSettings?.security?.lastLoginDevices && selectedSettings.security.lastLoginDevices.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-slate-700">Recent Login Devices</h4>
              <div className="space-y-2">
                {selectedSettings.security.lastLoginDevices.slice(0, 3).map((device, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                    <Smartphone className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-600">{device}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

        {/* Password Management */}
        <Card>
          <CardHeader className="pb-4">
            <SubsectionHeader
              title="Password Management"
              description="Update your account password"
            />
          </CardHeader>
          <CardContent>
            <PasswordManagement />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Security