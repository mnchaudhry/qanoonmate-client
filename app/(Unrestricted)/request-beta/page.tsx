'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { UserRole } from '@/lib/enums'
import { submitBetaRequest } from '@/store/reducers/betaRequestSlice'
import Link from 'next/link'

export default function RequestBetaPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { loading, success } = useSelector((s: RootState) => s.betaRequest)
  const [form, setForm] = useState({ name: '', email: '', intendedRole: UserRole.CLIENT as UserRole, message: '' })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await dispatch(submitBetaRequest({ ...form })).unwrap().catch(() => { })
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <Card className="w-full max-w-2xl bg-surface border border-border">
        <CardContent className="p-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">Request Beta Access</h1>
          <p className="text-muted-foreground mb-8">Fill in your details to request early access to QanoonMate beta.</p>
          {success ? (
            <div className="text-center text-foreground">
              <div className="text-xl mb-2">Thank you!</div>
              <div className="text-muted-foreground mb-2">We have received your request. We will reach out via email.</div>
              <Link href='/' className='text-primary underline'>Go to Home</Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-foreground">Name</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-background border-border text-foreground" required />
                </div>
                <div>
                  <Label className="text-foreground">Email</Label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-background border-border text-foreground" required />
                </div>
              </div>
              <div>
                <Label className="text-foreground">Intended Role</Label>
                <select value={form.intendedRole} onChange={(e) => setForm({ ...form, intendedRole: e.target.value as UserRole })} className="w-full h-10 rounded-md bg-background border border-border text-foreground px-3">
                  <option value={UserRole.CLIENT}>Client</option>
                  <option value={UserRole.LAWYER}>Lawyer</option>
                  <option value={UserRole.ADMIN}>Admin</option>
                </select>
              </div>
              <div>
                <Label className="text-foreground">Why do you want beta access? (optional)</Label>
                <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="bg-background border-border text-foreground" rows={5} placeholder="Tell us a bit about your use case" />
              </div>
              <div className="flex justify-end">
                <Button type="submit" className="bg-primary" disabled={loading}>{loading ? 'Submitting...' : 'Submit Request'}</Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


