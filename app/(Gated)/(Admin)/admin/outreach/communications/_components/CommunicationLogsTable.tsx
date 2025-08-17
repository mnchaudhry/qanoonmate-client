import { Badge } from '@/components/ui/badge'
import { Pagination } from '@/components/ui/pagination'
import { TableCell, TableBody, TableHead, TableRow, TableHeader, Table } from '@/components/ui/table'
import { setCurrentPage } from '@/store/reducers/communicationSlice'
import { RootState } from '@/store/store'
import { CommunicationDoc } from '@/store/types/communication.types'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

const CommunicationLogsTable = ({ items }: { items: CommunicationDoc[] | any[] }) => {

    /////////////////////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////////////
    const { meta } = useSelector((s: RootState) => s.communication)

    const dispatch = useDispatch()

    /////////////////////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////////////
    return (
        <div className="bg-surface border !border-border rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Channel</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Recipient</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Sent At</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((c) => (
                        <TableRow key={c._id}>
                            <TableCell><Badge variant="outline">{c.channel}</Badge></TableCell>
                            <TableCell>{c.type}</TableCell>
                            <TableCell>{c.recipientEmail || c.userId || '-'}</TableCell>
                            <TableCell>{c.subject || '-'}</TableCell>
                            <TableCell><Badge variant="outline">{c.status}</Badge></TableCell>
                            <TableCell>{c.sentAt ? new Date(c.sentAt).toLocaleString() : '-'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {meta && meta.totalPages > 1 &&
                <Pagination
                    currentPage={meta.currentPage}
                    totalPages={meta.totalPages}
                    onPageChange={(page) => {
                        dispatch(setCurrentPage(page))
                    }}
                />
            }

        </div>
    )
}

export default CommunicationLogsTable