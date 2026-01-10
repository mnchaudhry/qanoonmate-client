'use client'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useDebounce } from '@/hooks/useDebounce'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { AppDispatch, RootState } from '@/store/store'
import { fetchCommunications, setCurrentPage } from '@/store/reducers/communicationSlice'
import { PageHeader } from '../../../_components/PageHeader'
import CommunicationLogFilters from './_components/CommunicationLogFilters'
import CommunicationLogsTable from './_components/CommunicationLogsTable'
import { CommunicationChannel, CommunicationStatus, CommunicationType } from '@/store/types/communication.types'

export default function CommunicationsPage() {

    /////////////////////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////////////
    const dispatch = useDispatch<AppDispatch>()
    const { items, meta } = useSelector((s: RootState) => s.communication)
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const initialSearch = searchParams.get('q') || ''
    const initialChannel = searchParams.get('channel') || ''
    const initialType = searchParams.get('type') || ''
    const initialStatus = searchParams.get('status') || ''
    const initialPage = Number(searchParams.get('page') || '1')

    /////////////////////////////////////////////////////////////// STATES /////////////////////////////////////////////////////////////
    const [search, setSearch] = useState(initialSearch)
    const [channel, setChannel] = useState(initialChannel)
    const [type, setType] = useState(initialType)
    const [status, setStatus] = useState(initialStatus)

    const debouncedSearch = useDebounce(search, 400)
    // Sync initial page from URL
    useEffect(() => {
        if (initialPage && initialPage !== meta.currentPage) {
            dispatch(setCurrentPage(initialPage))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    /////////////////////////////////////////////////////////////// EFFECTS /////////////////////////////////////////////////////////////
    useEffect(() => {
        dispatch(fetchCommunications({
            page: meta.currentPage,
            limit: 20,
            search: debouncedSearch || undefined,
            channel: (!channel || channel === 'all' ? undefined : channel) as CommunicationChannel | undefined,
            type: (!type || type === 'all' ? undefined : type) as CommunicationType | undefined,
            status: (!status || status === 'all' ? undefined : status) as CommunicationStatus | undefined,
        }))
    }, [dispatch, debouncedSearch, channel, type, status, meta.currentPage])

    // URL persistence (with page)
    useEffect(() => {
        const q = new URLSearchParams()
        if (debouncedSearch) q.set('q', debouncedSearch)
        if (channel) q.set('channel', channel)
        if (type) q.set('type', type)
        if (status) q.set('status', status)
        if (meta.currentPage > 1) q.set('page', String(meta.currentPage))
        const qs = q.toString()
        const target = qs ? `${pathname}?${qs}` : pathname
        if (typeof window !== 'undefined' && window.location.search !== (qs ? `?${qs}` : '')) {
            router.replace(target, { scroll: false })
        }
    }, [debouncedSearch, channel, type, status, meta.currentPage, pathname, router])

    /////////////////////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////////////
    return (
        <div className="space-y-6">
        
            <PageHeader title="Communication Logs" description="Audit of emails and notifications sent via the system." />

            <CommunicationLogFilters search={search} setSearch={setSearch} channel={channel} setChannel={setChannel} type={type} setType={setType} status={status} setStatus={setStatus} />

            <CommunicationLogsTable items={items} />

        </div>
    )
}


