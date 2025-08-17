'use client'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useDebounce } from '@/hooks/use-debounce'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { AppDispatch, RootState } from '@/store/store'
import { fetchCommunications } from '@/store/reducers/communicationSlice'
import { PageHeader } from '../../../_components/PageHeader'
import CommunicationLogFilters from './_components/CommunicationLogFilters'
import CommunicationLogsTable from './_components/CommunicationLogsTable'
import { CommunicationChannel, CommunicationStatus, CommunicationType } from '@/store/types/communication.types'

export default function CommunicationsPage() {

    /////////////////////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////////////
    const dispatch = useDispatch<AppDispatch>()
    const { items } = useSelector((s: RootState) => s.communication)
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const initialSearch = searchParams.get('q') || ''
    const initialChannel = searchParams.get('channel') || ''
    const initialType = searchParams.get('type') || ''
    const initialStatus = searchParams.get('status') || ''

    /////////////////////////////////////////////////////////////// STATES /////////////////////////////////////////////////////////////
    const [search, setSearch] = useState(initialSearch)
    const [channel, setChannel] = useState(initialChannel)
    const [type, setType] = useState(initialType)
    const [status, setStatus] = useState(initialStatus)

    const debouncedSearch = useDebounce(search, 400)

    /////////////////////////////////////////////////////////////// EFFECTS /////////////////////////////////////////////////////////////
    useEffect(() => {
        dispatch(fetchCommunications({
            page: 1,
            limit: 20,
            search: debouncedSearch || undefined,
            channel: (!channel || channel === 'all' ? undefined : channel) as CommunicationChannel | undefined,
            type: (!type || type === 'all' ? undefined : type) as CommunicationType | undefined,
            status: (!status || status === 'all' ? undefined : status) as CommunicationStatus | undefined,
        }))
    }, [dispatch, debouncedSearch, channel, type, status])

    // URL persistence
    useEffect(() => {
        const q = new URLSearchParams()
        if (debouncedSearch) q.set('q', debouncedSearch)
        if (channel) q.set('channel', channel)
        if (type) q.set('type', type)
        if (status) q.set('status', status)
        const qs = q.toString()
        const target = qs ? `${pathname}?${qs}` : pathname
        if (typeof window !== 'undefined' && window.location.search !== (qs ? `?${qs}` : '')) {
            router.replace(target, { scroll: false })
        }
    }, [debouncedSearch, channel, type, status, pathname, router])

    /////////////////////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////////////
    return (
        <div className="space-y-6">
            <PageHeader title="Communication Logs" description="Audit of emails and notifications sent via the system." />

            <CommunicationLogFilters search={search} setSearch={setSearch} channel={channel} setChannel={setChannel} type={type} setType={setType} status={status} setStatus={setStatus} />

            <CommunicationLogsTable items={items} />

        </div>
    )
}


