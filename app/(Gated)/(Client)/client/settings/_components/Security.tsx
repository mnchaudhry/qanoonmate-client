import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck, Lock, Smartphone, Clock, AlertTriangle } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { updateClientSecurity } from '@/store/reducers/clientSettingsSlice'
import PasswordManagement from './PasswordManagement'

const Security = () => {

  //////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>()
  const { selectedSettings } = useSelector((state: RootState) => state.clientSettings)

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'enabled':
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Enabled</Badge>
      case 'disabled':
        return <Badge variant="secondary">Disabled</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const formatDate = (dateString?: string) => {
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
      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Two-Factor Authentication
          </CardTitle>
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
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-primary" />
            Security Information
          </CardTitle>
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
                {formatDate(selectedSettings?.security?.lastLoginAt)}
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
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-primary" />
            Password Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PasswordManagement />
        </CardContent>
      </Card>
    </div>
  )
}

export default Security