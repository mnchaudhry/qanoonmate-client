'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/store/store'
import { updateUser } from '@/store/reducers/userSlice'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AccountStatus, UserRole } from '@/lib/enums'

interface EditUserModalProps {
  open: boolean
  onOpenChange: (v: boolean) => void
}

export default function EditUserModal({ open, onOpenChange }: EditUserModalProps) {

  /////////////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>()
  const currentUser = useSelector((s: RootState) => s.user.currentUser)

  /////////////////////////////////////////////////////// STATES /////////////////////////////////////////////////////////////////
  const [form, setForm] = useState({ firstname: '', lastname: '', email: '', phone: '', role: UserRole.CLIENT as UserRole, accountStatus: AccountStatus.ACTIVE as AccountStatus })
  const [submitting, setSubmitting] = useState(false)

  /////////////////////////////////////////////////////// EFFECTS /////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (open && currentUser) {
      setForm({
        firstname: currentUser.firstname || '',
        lastname: currentUser.lastname || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        role: currentUser.role || UserRole.CLIENT,
        accountStatus: currentUser.accountStatus || AccountStatus.ACTIVE,
      })
    }
  }, [open, currentUser])

  /////////////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////////////////////
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser?._id) return
    setSubmitting(true)
    try {
      await dispatch(updateUser({ id: currentUser._id, update: { ...form } })).unwrap()
      onOpenChange(false)
    } finally {
      setSubmitting(false)
    }
  }

  /////////////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////////////////
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface border border-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit User</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-foreground">First name</Label>
              <Input value={form.firstname} onChange={(e) => setForm({ ...form, firstname: e.target.value })} className="bg-background border-border text-foreground" required />
            </div>
            <div>
              <Label className="text-foreground">Last name</Label>
              <Input value={form.lastname} onChange={(e) => setForm({ ...form, lastname: e.target.value })} className="bg-background border-border text-foreground" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-foreground">Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-background border-border text-foreground" required />
            </div>
            <div>
              <Label className="text-foreground">Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-background border-border text-foreground" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-foreground">Role</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as UserRole })}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.CLIENT}>Client</SelectItem>
                  <SelectItem value={UserRole.LAWYER}>Lawyer</SelectItem>
                  <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-foreground">Status</Label>
              <Select value={form.accountStatus} onValueChange={(v) => setForm({ ...form, accountStatus: v as AccountStatus })}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={AccountStatus.ACTIVE}>Active</SelectItem>
                  <SelectItem value={AccountStatus.SUSPENDED}>Suspended</SelectItem>
                  <SelectItem value={AccountStatus.BLOCKED}>Blocked</SelectItem>
                  <SelectItem value={AccountStatus.PENDING_ACTIVATION}>Pending</SelectItem>
                  <SelectItem value={AccountStatus.REJECTED}>Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" className="border-border" onClick={() => onOpenChange(false)} disabled={submitting}>Cancel</Button>
            <Button type="submit" className="bg-primary" disabled={submitting}>Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}


