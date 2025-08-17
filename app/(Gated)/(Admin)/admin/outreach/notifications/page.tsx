'use client'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { PageHeader } from '../../../_components/PageHeader'
import { AppDispatch } from '@/store/store'
import { createNotification } from '@/store/reducers/notificationSlice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function AdminNotificationsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const [recipient, setRecipient] = useState('')
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [type, setType] = useState('GENERAL')

  const handleSend = () => {
    if (!recipient || !title || !message) return
    dispatch(createNotification({ recipient, type: type as any, title, message }))
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Send Notification" description="Send in-app notifications to a user." />
      <div className="bg-surface border !border-border rounded-lg p-4 grid gap-4 max-w-2xl">
        <div className="grid gap-2">
          <label className="text-sm">Recipient (User ID)</label>
          <Input value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="Mongo ObjectId" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">Type</label>
          <select className="border rounded-md h-9 px-3 bg-background" value={type} onChange={e => setType(e.target.value)}>
            <option value="GENERAL">GENERAL</option>
            <option value="SYSTEM">SYSTEM</option>
            <option value="CONSULTATION">CONSULTATION</option>
          </select>
        </div>
        <div className="grid gap-2">
          <label className="text-sm">Title</label>
          <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">Message</label>
          <Textarea rows={6} value={message} onChange={e => setMessage(e.target.value)} placeholder="Notification message" />
        </div>
        <div>
          <Button onClick={handleSend} disabled={!recipient || !title || !message}>Send</Button>
        </div>
      </div>
    </div>
  )
}


