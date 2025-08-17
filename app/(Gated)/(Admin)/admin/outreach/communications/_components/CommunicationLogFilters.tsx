import SearchBar from '@/components/SearchBar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import React from 'react'

const CommunicationLogFilters = ({ search, setSearch, channel, setChannel, type, setType, status, setStatus }: { search: string, setSearch: (value: string) => void, channel: string, setChannel: (value: string) => void, type: string, setType: (value: string) => void, status: string, setStatus: (value: string) => void }) => {
    return (
        <div className="flex justify-between gap-4 items-center">
            <SearchBar
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Subject, email..."
                containerClassName='mx-0 mb-0 w-1/3'
            />
            <div className="flex gap-2 items-center">
                <Select value={channel || 'all'} onValueChange={(v) => setChannel(v === 'all' ? '' : v)}>
                    <SelectTrigger className='w-40'><SelectValue placeholder="All" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Channels</SelectItem>
                        <SelectItem value="EMAIL">Email</SelectItem>
                        <SelectItem value="NOTIFICATION">Notification</SelectItem>
                        <SelectItem value="NEWSLETTER">Newsletter</SelectItem>
                        <SelectItem value="WAITLIST">Waitlist</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={type || 'all'} onValueChange={(v) => setType(v === 'all' ? '' : v)}>
                    <SelectTrigger className='w-40'><SelectValue placeholder="All" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="SYSTEM">System</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="CAMPAIGN">Campaign</SelectItem>
                        <SelectItem value="TRANSACTIONAL">Transactional</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={status || 'all'} onValueChange={(v) => setStatus(v === 'all' ? '' : v)}>
                    <SelectTrigger className='w-40'><SelectValue placeholder="All" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="SENT">Sent</SelectItem>
                        <SelectItem value="FAILED">Failed</SelectItem>
                        <SelectItem value="READ">Read</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}

export default CommunicationLogFilters