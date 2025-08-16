'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { resetUserPassword } from '@/store/reducers/userSlice'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface ResetPasswordModalProps {
  open: boolean
  onOpenChange: (v: boolean) => void
}

export default function ResetPasswordModal({ open, onOpenChange }: ResetPasswordModalProps) {

  ////////////////////////////////////////////////////////// VARIABLES ///////////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>()
  const { currentUser } = useSelector((s: RootState) => s.user)

  ////////////////////////////////////////////////////////// STATES /////////////////////////////////////////////////////////////
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  ////////////////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////////////////
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser?._id) return
    setSubmitting(true)
    try {
      await dispatch(resetUserPassword({ id: currentUser._id, password: password || undefined })).unwrap()
      onOpenChange(false)
      setPassword('')
    } finally { setSubmitting(false) }
  }

  ////////////////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////////////
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface border border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Reset Password</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label className="text-foreground">New password (optional)</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Leave blank to auto-generate" className="bg-background border-border text-foreground" />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" className="border-border" onClick={() => onOpenChange(false)} disabled={submitting}>Cancel</Button>
            <Button type="submit" disabled={submitting}>Reset</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}


