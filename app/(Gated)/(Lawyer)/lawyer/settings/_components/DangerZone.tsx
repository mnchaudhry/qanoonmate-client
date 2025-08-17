"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Trash2, RefreshCw, Download } from 'lucide-react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { deactivate } from '@/store/reducers/authSlice'
import { updateLawyerSettings, resetLawyerSettingsState } from '@/store/reducers/lawyerSettingsSlice';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const DangerZone = () => {
  //////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>()

  //////////////////////////////////////////////// STATE /////////////////////////////////////////////////
  const [isDeactivating, setIsDeactivating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [password, setPassword] = useState('')
  const [twofa, setTwofa] = useState('')

  //////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////
  const handleDeactivateAccount = async () => {
    setIsDeactivating(true)
    try {
      await dispatch(deactivate()).unwrap();
      toast.success('Account deactivated. You can reactivate anytime.');
    } catch (error) {
      console.log('error', error);
      toast.error('Error deactivating account.');
    } finally {
      setIsDeactivating(false)
    }
  }
  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    setTimeout(() => {
      setIsDeleting(false)
      toast.success('Account deleted (mock)')
    }, 1500)
  }
  const handleResetSettings = async () => {
    setIsResetting(true)
    try {
      await dispatch(updateLawyerSettings({ preferences: {}, consultation: {}, security: {}, billing: {} })).unwrap();
      dispatch(resetLawyerSettingsState());
      toast.success('Settings reset to default!');
    } catch (error) {
      toast.error('Error resetting settings.');
      console.log('error', error);
    } finally {
      setIsResetting(false)
    }
  }
  const handleExportData = async () => {
    setIsExporting(true)
    setTimeout(() => {
      setIsExporting(false)
      toast.success('Data export requested (mock)')
    }, 1000)
  }

  //////////////////////////////////////////////// RENDER /////////////////////////////////////////////////
  return (
    <Card className="relative border border-accent/30 bg-background/80 shadow-xl overflow-hidden">
      {/* Top-level warning banner */}
      <div className="absolute top-0 left-0 w-full z-10">
        <div className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-yellow-200/80 via-orange-100/80 to-transparent border-b border-accent/30 animate-pulse">
          <AlertTriangle className="h-5 w-5 text-yellow-500 animate-bounce" />
          <span className="font-semibold text-yellow-700 tracking-wide">Caution: These actions are irreversible or disruptive. Proceed thoughtfully.</span>
        </div>
      </div>
      <CardHeader className="pt-16 pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold text-foreground">
          <motion.span animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
            <AlertTriangle className="h-5 w-5 text-destructive drop-shadow-lg" />
          </motion.span>
          <span className="text-destructive">Danger Zone</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-10">
        {/* Delete Account */}
        <motion.section whileHover={{ scale: 1.025, boxShadow: '0 4px 32px 0 rgba(255,0,0,0.08)' }} className="relative p-4 rounded-xl border border-accent/20 bg-gradient-to-br from-red-50/60 to-muted/60 hover:shadow-2xl transition-all group overflow-hidden">
          <motion.div className="absolute right-4 top-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none" animate={{ rotate: [0, 20, -20, 0] }} transition={{ repeat: Infinity, duration: 6 }}>
            <Trash2 className="h-16 w-16 text-destructive" />
          </motion.div>
          <div className="flex items-start gap-3">
            <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
              <Trash2 className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
            </motion.span>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Delete Account</p>
              <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data. This cannot be undone.</p>
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10 font-semibold tracking-wide" disabled={isDeleting}>
                  {isDeleting ? <span className="flex items-center gap-2"><span>Deleting...</span><span className="animate-spin h-4 w-4 border-2 border-destructive border-t-transparent rounded-full" /></span> : 'Delete Account'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-gradient-to-br from-red-50/80 to-background/90 border-destructive/30">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                    <Trash2 className="h-5 w-5 animate-pulse" />
                    Confirm Account Deletion
                  </AlertDialogTitle>
                  <AlertDialogDescription className="space-y-2">
                    <p>Are you absolutely sure? This action is irreversible.</p>
                    <div className="space-y-2">
                      <Input type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} />
                      <Input type="text" placeholder="Enter 2FA code (if enabled)" value={twofa} onChange={e => setTwofa(e.target.value)} />
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90 font-semibold">
                    Yes, Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </motion.section>
        {/* Deactivate Account */}
        <motion.section whileHover={{ scale: 1.025, boxShadow: '0 4px 32px 0 rgba(255,180,0,0.08)' }} className="relative p-4 rounded-xl border border-accent/20 bg-gradient-to-br from-yellow-50/60 to-muted/60 hover:shadow-2xl transition-all group overflow-hidden">
          <motion.div className="absolute right-4 top-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none" animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 8 }}>
            <AlertTriangle className="h-16 w-16 text-yellow-400" />
          </motion.div>
          <div className="flex items-start gap-3">
            <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2.5 }}>
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            </motion.span>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Account Deactivation</p>
              <p className="text-sm text-muted-foreground">Temporarily disable your account. You won&apos;t be able to book consultations or access messages.</p>
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-accent/10 font-semibold tracking-wide" disabled={isDeactivating}>
                  {isDeactivating ? <span className="flex items-center gap-2"><span>Deactivating...</span><span className="animate-spin h-4 w-4 border-2 border-accent border-t-transparent rounded-full" /></span> : 'Deactivate Account'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-gradient-to-br from-yellow-50/80 to-background/90 border-accent/30">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2 text-accent">
                    <AlertTriangle className="h-5 w-5 animate-bounce" />
                    Confirm Account Deactivation
                  </AlertDialogTitle>
                  <AlertDialogDescription className="space-y-2">
                    <p>Are you sure you want to deactivate your account?</p>
                    <p className="text-sm text-muted-foreground">This action will:</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Prevent you from booking new consultations</li>
                      <li>Disable access to messages and chat</li>
                      <li>Hide your profile from the platform</li>
                      <li>Require reactivation to use services again</li>
                    </ul>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeactivateAccount} className="bg-accent text-foreground hover:bg-accent/80 font-semibold">
                    Yes, Deactivate Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </motion.section>
        {/* Reset Account Settings */}
        <motion.section whileHover={{ scale: 1.025, boxShadow: '0 4px 32px 0 rgba(0,120,255,0.08)' }} className="relative p-4 rounded-xl border border-accent/20 bg-gradient-to-br from-blue-50/60 to-muted/60 hover:shadow-2xl transition-all group overflow-hidden">
          <motion.div className="absolute right-4 top-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none" animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 7 }}>
            <RefreshCw className="h-16 w-16 text-primary" />
          </motion.div>
          <div className="flex items-start gap-3">
            <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2.5 }}>
              <RefreshCw className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            </motion.span>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Reset Account Settings</p>
              <p className="text-sm text-muted-foreground">Reset all your settings (preferences, availability, etc.) to default. Your consultations and documents will not be affected.</p>
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 font-semibold tracking-wide" disabled={isResetting}>
                  {isResetting ? <span className="flex items-center gap-2"><span>Resetting...</span><span className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" /></span> : 'Reset Settings'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-gradient-to-br from-blue-50/80 to-background/90 border-primary/30">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2 text-primary">
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Confirm Reset Settings
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will wipe all your custom settings and restore defaults. Data like consultations and documents will remain intact.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleResetSettings} className="bg-primary text-foreground hover:bg-primary/80 font-semibold">
                    Yes, Reset Settings
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </motion.section>
        {/* Request Data Export */}
        <motion.section whileHover={{ scale: 1.025, boxShadow: '0 4px 32px 0 rgba(0,180,120,0.08)' }} className="relative p-4 rounded-xl border border-accent/20 bg-gradient-to-br from-green-50/60 to-muted/60 hover:shadow-2xl transition-all group overflow-hidden">
          <motion.div className="absolute right-4 top-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none" animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 9 }}>
            <Download className="h-16 w-16 text-foreground" />
          </motion.div>
          <div className="flex items-start gap-3">
            <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2.5 }}>
              <Download className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
            </motion.span>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Request Data Export</p>
              <p className="text-sm text-muted-foreground">Request a full export of your data for compliance or personal records. You will receive a download link via email.</p>
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <Button variant="outline" className="border-foreground text-foreground hover:bg-secondary/10 font-semibold tracking-wide" disabled={isExporting} onClick={handleExportData}>
              {isExporting ? <span className="flex items-center gap-2"><span>Requesting...</span><span className="animate-spin h-4 w-4 border-2 border-secondary border-t-transparent rounded-full" /></span> : 'Request Data Export'}
            </Button>
          </div>
        </motion.section>
      </CardContent>
    </Card>
  )
}

export default DangerZone
