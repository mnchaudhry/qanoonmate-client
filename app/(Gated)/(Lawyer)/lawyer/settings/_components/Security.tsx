import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { ShieldCheck, LogOut, Trash2, Smartphone, Mail, Link2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { updateSecurityPreferences } from '@/store/reducers/lawyerSettingsSlice';
import PasswordManagement from './PasswordManagement'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'

const MOCK_DEVICES = [
  { id: 'dev1', name: 'Chrome on Mac', lastActive: '2024-03-01 10:00', current: true },
  { id: 'dev2', name: 'Safari on iPhone', lastActive: '2024-02-28 18:30', current: false },
]
const MOCK_LOGS = [
  { ts: '2024-03-01 10:00', action: 'Login', ip: '192.168.1.2' },
  { ts: '2024-02-28 18:30', action: 'Password Changed', ip: '192.168.1.2' },
  { ts: '2024-02-27 09:15', action: '2FA Enabled', ip: '192.168.1.2' },
]
const MOCK_APPS = [
  { id: 'app1', name: 'Zapier', lastUsed: '2024-02-20', token: '••••••••' },
]

const Security = () => {
  //////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>()
  const { selectedSettings } = useSelector((state: RootState) => state.lawyerSettings)
  const { user } = useSelector((state: RootState) => state.auth)
  const [showEmail, setShowEmail] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [securityQ, setSecurityQ] = useState(selectedSettings?.security?.securityQuestion || '')
  const [securityA, setSecurityA] = useState('')
  const [logs] = useState(MOCK_LOGS)
  const [devices, setDevices] = useState(MOCK_DEVICES)
  const [apps] = useState(MOCK_APPS)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  //////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////
  const handleToggle2FA = () => {
    if (!selectedSettings) return;
    setLoading(true);
    setSuccess(false);
    dispatch(updateSecurityPreferences({ twoFactorEnabled: !selectedSettings.security?.twoFactorEnabled }))
      .then(() => setSuccess(true))
      .finally(() => setLoading(false));
  }
  const handleRevokeDevice = (id: string) => setDevices(devices.filter(d => d.id !== id))
  const handleUpdateSecurityQ = () => {
    if (!selectedSettings) return;
    setLoading(true);
    setSuccess(false);
    dispatch(updateSecurityPreferences({ securityQuestion: securityQ, securityAnswerHash: securityA }))
      .then(() => setSuccess(true))
      .finally(() => setLoading(false));
    setSecurityA('');
  }
  const handleChangeEmail = () => {
    toast.success('Verification email sent to ' + newEmail)
    setShowEmail(false)
    setNewEmail('')
  }
  const handleRevokeApp = (id: string) => {
    if (!selectedSettings) return;
    setLoading(true);
    setSuccess(false);
    dispatch(updateSecurityPreferences({ authorizedApps: selectedSettings.security?.authorizedApps?.filter(a => a.id !== id) || [] }))
      .then(() => setSuccess(true))
      .finally(() => setLoading(false));
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
      <CardContent className="space-y-10">
        {/* 2FA */}
        <section className="space-y-2 border-b pb-6 py-0 ">
          <div className="flex items-center justify-between">
            <span className="font-medium">Two-Factor Authentication (2FA)</span>
            <Switch checked={selectedSettings?.security?.twoFactorEnabled} onCheckedChange={handleToggle2FA} />
          </div>
          {selectedSettings?.security?.twoFactorEnabled && (
            <div className="pl-2 text-sm text-muted-foreground">2FA enabled (TOTP/SMS). Use your authenticator app or SMS code on login.</div>
          )}
        </section>
        {/* Device Management */}
        <section className="py-2 border-b pb-6">
          <div className="font-medium mb-1">Device Management</div>
          <ul className="list-disc pl-5 text-sm text-muted-foreground">
            {devices.length ? devices.map((d) => (
              <li key={d.id} className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                <span>{d.name} ({d.lastActive}) {d.current && <span className="text-green-600">[Current]</span>}</span>
                {!d.current && <Button size="sm" variant="ghost" onClick={() => handleRevokeDevice(d.id)}><LogOut className="h-4 w-4" />Revoke</Button>}
              </li>
            )) : <li>No recent devices found.</li>}
          </ul>
        </section>
        {/* Activity Logs */}
        <section className="py-2 border-b pb-6">
          <div className="font-medium mb-1">Activity Logs</div>
          <ul className="list-disc pl-5 text-sm text-muted-foreground">
            {logs.length ? logs.map((l, i) => (
              <li key={i}><span className="font-mono">{l.ts}</span> — {l.action} (IP: {l.ip})</li>
            )) : <li>No activity logs found.</li>}
          </ul>
        </section>
        {/* Security Questions */}
        <section className="py-2 border-b pb-6">
          <div className="font-medium mb-1">Security Question (for recovery)</div>
          <div className="flex gap-2 items-center">
            <Input placeholder="e.g. Your first pet's name?" value={securityQ} onChange={e => setSecurityQ(e.target.value)} className="w-64" />
            <Input placeholder="Answer" value={securityA} onChange={e => setSecurityA(e.target.value)} className="w-48" />
            <Button size="sm" onClick={handleUpdateSecurityQ} disabled={loading}>Update</Button>
          </div>
        </section>
        {/* Authorized Apps / Integrations */}
        <section className="py-2 border-b pb-6">
          <div className="font-medium mb-1">Authorized Apps / Integrations</div>
          <ul className="list-disc pl-5 text-sm text-muted-foreground">
            {apps.length ? apps.map(a => (
              <li key={a.id} className="flex items-center gap-2">
                <Link2 className="h-4 w-4" />
                <span>{a.name} (last used: {a.lastUsed})</span>
                <Button size="sm" variant="ghost" onClick={() => handleRevokeApp(a.id)} disabled={loading}><Trash2 className="h-4 w-4" />Revoke</Button>
              </li>
            )) : <li>No authorized apps found.</li>}
          </ul>
        </section>
        {/* Change Email */}
        <section className="py-2 border-b pb-6">
          <div className="font-medium mb-1">Change Email</div>
          {showEmail ? (
            <div className="flex gap-2 items-center">
              <Input placeholder="New email address" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="w-64" />
              <Button size="sm" onClick={handleChangeEmail}>Send Verification</Button>
              <Button size="sm" variant="ghost" onClick={() => setShowEmail(false)}>Cancel</Button>
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <span>{user?.email}</span>
              <Button size="sm" variant="outline" onClick={() => setShowEmail(true)}><Mail className="h-4 w-4 mr-1" />Change Email</Button>
            </div>
          )}
        </section>
        {/* Password Management (for completeness) */}
        <section className="py-2">
          <PasswordManagement />
        </section>
        {success && (
          <div className="flex items-center gap-2 text-green-600 font-medium mt-2">
            Security settings updated successfully!
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default Security