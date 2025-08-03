"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from '@/components/ui/alert-dialog'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { deleteClientSettings } from '@/store/reducers/clientSettingsSlice'

const DangerZone = () => {

  //////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>()

  //////////////////////////////////////////////// STATE /////////////////////////////////////////////////
  const [isDeactivating, setIsDeactivating] = useState(false)

  //////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////
  const handleDeleteSettings = () => {
    setIsDeactivating(true)
    dispatch(deleteClientSettings())
      .finally(() => setIsDeactivating(false))
  }

  //////////////////////////////////////////////// RENDER /////////////////////////////////////////////////
  return (
    <Card className="border-destructive/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-destructive">
          <AlertTriangle className="h-5 w-5" />
          Danger Zone
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-destructive">
                Delete All Settings
              </p>
              <p className="text-sm text-muted-foreground">
                ❗ This will permanently delete all your settings and preferences. This action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="bg-destructive hover:bg-destructive/90"
                disabled={isDeactivating}
              >
                {isDeactivating ? 'Deleting...' : 'Delete All Settings'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Confirm Settings Deletion
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-2">
                  <p>Are you sure you want to delete all your settings?</p>
                  <p className="text-sm text-muted-foreground">
                    This action will:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Delete all your preferences</li>
                    <li>Reset your security settings</li>
                    <li>Remove your notification preferences</li>
                    <li>Clear your billing information</li>
                    <li>Reset your verification status</li>
                  </ul>
                  <p className="text-sm font-medium text-destructive">
                    This action cannot be undone!
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteSettings}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Yes, Delete All Settings
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}

export default DangerZone
