'use client'

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { addUser, getUsers } from '@/store/reducers/userSlice'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AccountStatus, UserRole } from '@/lib/enums'
import { AddUserRequest } from '@/store/types/user.types'

interface AddUserModalProps {
  open: boolean
  onOpenChange: (v: boolean) => void
}

export default function AddUserModal({ open, onOpenChange }: AddUserModalProps) {
  const dispatch = useDispatch<AppDispatch>()
  const [form, setForm] = useState({ firstname: '', lastname: '', email: '', phone: '', password: '', role: UserRole.CLIENT as UserRole })
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {

      const input: AddUserRequest = {
        firstname: form.firstname,
        lastname: form.lastname,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: form.role,
        emailVerified: true,
        phoneVerified: true,
        identityVerified: true,
        accountStatus: AccountStatus.ACTIVE
      }
      await dispatch(addUser(input)).unwrap()
      await dispatch(getUsers(undefined))
      onOpenChange(false)
      setForm({ firstname: '', lastname: '', email: '', phone: '', password: '', role: UserRole.CLIENT })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface border border-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add User</DialogTitle>
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
              <Label className="text-foreground">Password</Label>
              <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="bg-background border-border text-foreground" required />
            </div>
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
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" className="border-border" onClick={() => onOpenChange(false)} disabled={submitting}>Cancel</Button>
            <Button type="submit" className="bg-primary" disabled={submitting}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}


