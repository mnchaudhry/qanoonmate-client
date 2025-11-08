'use client'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PageHeader } from '../../../_components/PageHeader'
import { AppDispatch, RootState } from '@/store/store'
import { sendAdminEmail as sendAdminEmailThunk } from '@/store/reducers/emailSlice'
import EmailFilters from './_components/EmailFilters'
import { EmailComposer } from './_components/EmailComposer'
import { UsersPickTable } from './_components/UsersPickTable'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from '@/hooks/useDebounce'

export default function AdminEmailPage() {

  ////////////////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const pathname = usePathname()
  const { sending, lastResult } = useSelector((s: RootState) => s.email)
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get('q') || ''
  const initialRole = (() => { const r = searchParams.get('role') || ''; return r === 'all' ? '' : r })()
  const initialStatus = (() => { const s = searchParams.get('status') || ''; return s === 'all' ? '' : s })()
  const initialReleaseChannel = (() => { const r = searchParams.get('releaseChannel') || ''; return r === 'all' ? '' : r })()
  const initialSort = searchParams.get('sort') || ''

  ////////////////////////////////////////////////////////// STATES /////////////////////////////////////////////////////////////
  const [search, setSearch] = useState(initialSearch)
  const [role, setRole] = useState(initialRole)
  const [status, setStatus] = useState(initialStatus)
  const [releaseChannel, setReleaseChannel] = useState<string | undefined>(initialReleaseChannel || undefined)
  const [sort, setSort] = useState(initialSort)
  const [selectedEmails, setSelectedEmails] = useState<string[]>([])
  // local UI-only removed unused states

  const debouncedSearch = useDebounce(search, 400)

  ////////////////////////////////////////////////////////// FUNCTION /////////////////////////////////////////////////////////////
  type TemplateType = 'custom' | 'waitlist_invite' | 'waitlist_joined' | 'beta_invite'
  const handleSend = async (payload: { subject: string; template: TemplateType; html?: string; inviteLink?: string; to?: string[] }) => {
    const input = {
      subject: payload.subject,
      template: payload.template as any,
      html: payload.html || undefined,
      inviteLink: payload.inviteLink || undefined,
      to: (payload.to && payload.to.length ? payload.to : selectedEmails),
    }
    dispatch(sendAdminEmailThunk(input))
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
    // Avoid push storms by replacing only when different
    if (window.location.search !== (qs ? `?${qs}` : '')) {
      router.replace(target, { scroll: false })
    }
  }


  ////////////////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////////////
  return (
    <div className="space-y-6">
      <PageHeader title="Send Email" description="Broadcast emails to targeted recipients." />

      <EmailFilters
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
        <UsersPickTable search={debouncedSearch} role={role} status={status} releaseChannel={releaseChannel} sortBy={sort} onSelectionChange={setSelectedEmails} />
        <EmailComposer onSend={handleSend} sending={sending} />
        {lastResult && (
          <div className="bg-surface border !border-border rounded-lg p-4">
            <div className="font-medium mb-2">Last Result</div>
            <div className="text-sm text-muted-foreground">Sent {lastResult.totalSent} / {lastResult.totalRequested}</div>
          </div>
        )}
      </div>
    </div>
  )
}


