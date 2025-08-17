'use client'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PageHeader } from '../../../_components/PageHeader'
import { AppDispatch, RootState } from '@/store/store'
import { createNotification } from '@/store/reducers/notificationSlice'
import NotificationFilters from './_components/NotificationFilters'
import { UsersPickTable } from '../email/_components/UsersPickTable'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from '@/hooks/use-debounce'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { NotificationDeliveryChannel, NotificationType } from '@/lib/enums'

export default function AdminNotificationsPage() {
  ////////////////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([])

  ////////////////////////////////////////////////////////// STATES /////////////////////////////////////////////////////////////
  const initialSearch = searchParams.get('q') || ''
  const initialRole = (() => { const r = searchParams.get('role') || ''; return r === 'all' ? '' : r })()
  const initialStatus = (() => { const s = searchParams.get('status') || ''; return s === 'all' ? '' : s })()
  const initialReleaseChannel = (() => { const r = searchParams.get('releaseChannel') || ''; return r === 'all' ? '' : r })()
  const initialSort = searchParams.get('sort') || ''

  const [search, setSearch] = useState(initialSearch)
  const [role, setRole] = useState(initialRole)
  const [status, setStatus] = useState(initialStatus)
  const [releaseChannel, setReleaseChannel] = useState<string | undefined>(initialReleaseChannel || undefined)
  const [sort, setSort] = useState(initialSort)

  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [type, setType] = useState<NotificationType>(NotificationType.SYSTEM)
  const [channels, setChannels] = useState<NotificationDeliveryChannel[]>([NotificationDeliveryChannel.IN_APP])

  const debouncedSearch = useDebounce(search, 400)

  ////////////////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////////////////
  const handleSend = async () => {
    if (selectedRecipients.length === 0 || !title || !message) return
    // For parity with email page, send one notification per recipient
    selectedRecipients.forEach(recipient => {
      dispatch(createNotification({ recipient, type, title, message, deliveryChannels: channels }))
    })
  }

  const handleResetFilters = () => {
    setSearch('')
    setRole('')
    setStatus('')
    setReleaseChannel(undefined)
    setSort('')
  }

  // Update URL when filters change
  const query = new URLSearchParams()
  if (debouncedSearch) query.set('q', debouncedSearch)
  if (role) query.set('role', role)
  if (status) query.set('status', status)
  if (releaseChannel) query.set('releaseChannel', releaseChannel)
  if (sort) query.set('sort', sort)
  const qs = query.toString()

  if (typeof window !== 'undefined') {
    const target = qs ? `${pathname}?${qs}` : pathname
    if (window.location.search !== (qs ? `?${qs}` : '')) {
      router.replace(target, { scroll: false })
    }
  }

  ////////////////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////////////
  return (
    <div className="space-y-6">
      <PageHeader title="Send Notifications" description="Broadcast notifications to targeted recipients." />

      <NotificationFilters
        onSearch={setSearch}
        onRoleFilter={setRole}
        onStatusFilter={setStatus}
        onReleaseChannelFilter={setReleaseChannel}
        onSortChange={setSort}
        onResetFilters={handleResetFilters}
        searchValue={search}
        roleValue={role}
        statusValue={status}
        releaseChannelValue={releaseChannel}
        sortValue={sort}
      />

      <div className="grid gap-6">
        <UsersPickTable search={debouncedSearch} role={role} status={status} releaseChannel={releaseChannel} sortBy={sort} onSelectionChange={setSelectedRecipients} />

        <Card className="bg-surface border !border-border">
          <CardContent className="p-4 space-y-4">
            <div className="grid gap-2">
              <label className="text-sm">Type</label>
              <select className="border rounded-md h-9 px-3 bg-background" value={type} onChange={e => setType(e.target.value as NotificationType)}>
                <option value={NotificationType.SYSTEM}>SYSTEM</option>
                <option value={NotificationType.CONSULTATION}>CONSULTATION</option>
                <option value={NotificationType.CHAT}>CHAT</option>
                <option value={NotificationType.PAYMENT}>PAYMENT</option>
                <option value={NotificationType.REMINDER}>REMINDER</option>
                <option value={NotificationType.CUSTOM}>CUSTOM</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm">Delivery Channels</label>
              <div className="flex gap-3 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={channels.includes(NotificationDeliveryChannel.IN_APP)} onChange={e => setChannels(prev => e.target.checked ? Array.from(new Set([...prev, NotificationDeliveryChannel.IN_APP])) : prev.filter(c => c !== NotificationDeliveryChannel.IN_APP))} />
                  In-app
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={channels.includes(NotificationDeliveryChannel.PUSH)} onChange={e => setChannels(prev => e.target.checked ? Array.from(new Set([...prev, NotificationDeliveryChannel.PUSH])) : prev.filter(c => c !== NotificationDeliveryChannel.PUSH))} />
                  Push
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={channels.includes(NotificationDeliveryChannel.EMAIL)} onChange={e => setChannels(prev => e.target.checked ? Array.from(new Set([...prev, NotificationDeliveryChannel.EMAIL])) : prev.filter(c => c !== NotificationDeliveryChannel.EMAIL))} />
                  Email
                </label>
              </div>
            </div>
            <div className="grid gap-2">
              <label className="text-sm">Title</label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm">Message</label>
              <Textarea rows={6} value={message} onChange={e => setMessage(e.target.value)} placeholder="Notification message" />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSend} disabled={selectedRecipients.length === 0 || !title || !message}>Send</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


