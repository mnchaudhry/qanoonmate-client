import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { ShieldCheck } from 'lucide-react'
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

  //////////////////////////////////////////////// RENDER /////////////////////////////////////////////////
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl ">
          <ShieldCheck className="h-5 w-5 text-primary" />
          Security
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between py-2">
          <span className="font-medium">Two-Factor Authentication (2FA)</span>
          <Switch 
            checked={selectedSettings?.security?.twoFactorEnabled} 
            onCheckedChange={handleToggle2FA}
            disabled={loading}
          />
        </div>
        <div className="py-2">
          <div className="font-medium mb-1">Last Login Devices</div>
          <ul className="list-disc pl-5 text-sm text-muted-foreground">
            {selectedSettings?.security?.lastLoginDevices?.length ? 
              selectedSettings.security.lastLoginDevices.map((d, i) => (
              <li key={i}>{d}</li>
              )) : 
              <li>No recent devices found.</li>
            }
          </ul>
        </div>
        <div className="py-2">
          <div className="font-medium mb-1">Password Last Updated</div>
          <div className="text-sm text-muted-foreground">
            {selectedSettings?.security?.passwordUpdatedAt ? 
              new Date(selectedSettings.security.passwordUpdatedAt).toLocaleString() : 
              'Never'
            }
          </div>
        </div>
        
        <PasswordManagement />
      </CardContent>
    </Card>
  )
}

export default Security