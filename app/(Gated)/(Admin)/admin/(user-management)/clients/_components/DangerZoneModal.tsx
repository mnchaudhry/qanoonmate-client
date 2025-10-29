'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { blockUser, deleteUser, updateUser } from '@/store/reducers/userSlice'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { AccountStatus } from '@/lib/enums'
import { ScrollArea } from '@/components/ui/scroll-area'

interface DangerZoneModalProps {
  open: boolean
  onOpenChange: (v: boolean) => void
}

export default function DangerZoneModal({ open, onOpenChange }: DangerZoneModalProps) {

  ////////////////////////////////////////////////////////// VARIABLES ///////////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>()
  const { currentUser } = useSelector((s: RootState) => s.user)

  ////////////////////////////////////////////////////////// STATES /////////////////////////////////////////////////////////////
  const [loading, setLoading] = useState<string | null>(null)

  ////////////////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////////////////
  const onSuspend = async () => {
    if (!currentUser?._id) return
    setLoading('suspend')
    try {
      await dispatch(updateUser({ id: currentUser._id, update: { accountStatus: AccountStatus.SUSPENDED } })).unwrap()
      onOpenChange(false)
    } finally { setLoading(null) }
  }

  const onBlock = async () => {
    if (!currentUser?._id) return
    setLoading('block')
    try {
      await dispatch(blockUser({ id: currentUser._id, block: true })).unwrap()
      onOpenChange(false)
    } finally { setLoading(null) }
  }

  const onDelete = async () => {
    if (!currentUser?._id) return
    setLoading('delete')
    try {
      await dispatch(deleteUser(currentUser._id)).unwrap()
      onOpenChange(false)
    } finally { setLoading(null) }
  }

  const onActivate = async () => {
    if (!currentUser?._id) return
    setLoading('activate')
    try {
      await dispatch(updateUser({ id: currentUser._id, update: { accountStatus: AccountStatus.ACTIVE } })).unwrap()
      onOpenChange(false)
    } finally { setLoading(null) }
  }

  ////////////////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////////////
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface border border-border max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-destructive">Danger Zone</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-2">

          <div className="space-y-4">

            {
              currentUser?.accountStatus !== AccountStatus.ACTIVE &&
              <div className="border border-border rounded-lg p-4 bg-background">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-medium text-foreground">Activate User</h4>
                    <p className="text-sm text-muted-foreground">Activate the account. They can sign in now.</p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="secondary" className="bg-secondary" disabled={loading !== null && loading !== 'activate'}>Activate</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm activation</AlertDialogTitle>
                        <AlertDialogDescription>This will set the user&apos;s status to active.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={onActivate} disabled={loading === 'activate'}>Activate</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            }
            {
              currentUser?.accountStatus !== AccountStatus.SUSPENDED &&
              <div className="border border-border rounded-lg p-4 bg-background">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-medium text-foreground">Suspend User</h4>
                    <p className="text-sm text-muted-foreground">Temporarily disable the account. They cannot sign in until reactivated.</p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="secondary" className="bg-secondary" disabled={loading !== null && loading !== 'suspend'}>Suspend</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm suspension</AlertDialogTitle>
                        <AlertDialogDescription>This will set the user&apos;s status to suspended.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={onSuspend} disabled={loading === 'suspend'}>Suspend</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            }
            {
              currentUser?.accountStatus !== AccountStatus.BLOCKED &&
              <div className="border border-border rounded-lg p-4 bg-background">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-medium text-foreground">Block User</h4>
                    <p className="text-sm text-muted-foreground">Permanently disable the account. This is more severe than suspension.</p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" disabled={loading !== null && loading !== 'block'}>Block</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm blocking</AlertDialogTitle>
                        <AlertDialogDescription>This will set the user&apos;s status to blocked.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={onBlock} disabled={loading === 'block'}>Block</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            }

            <div className="border border-border rounded-lg p-4 bg-background">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-medium text-destructive">Delete User</h4>
                  <p className="text-sm text-muted-foreground">This action is irreversible. All data may be removed.</p>
                  <Badge variant="destructive" className="mt-2">Irreversible</Badge>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={loading !== null && loading !== 'delete'}>Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this user?</AlertDialogTitle>
                      <AlertDialogDescription>This cannot be undone. Are you sure?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={onDelete} disabled={loading === 'delete'}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {/* Reset Password and View Logs moved to their own modals */}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}


