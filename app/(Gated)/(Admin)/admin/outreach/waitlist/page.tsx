'use client'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PageHeader } from '../../../_components/PageHeader'
import { AppDispatch, RootState } from '@/store/store'
import { fetchWaitlistThunk, inviteWaitlistEntryThunk, deleteWaitlistEntryThunk, updateWaitlistEntryThunk } from '@/store/reducers/waitlistSlice'
import { Button } from '@/components/ui/button'
import { TableSkeleton } from '@/components/skeletons'
import { RefreshCw } from 'lucide-react'

const PAGE_SIZE = 20

export default function AdminWaitlistPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { list, isLoading, totalPages } = useSelector((s: RootState) => s.waitlist)
  const [page, setPage] = useState(1)

  useEffect(() => {
    dispatch(fetchWaitlistThunk({ page, limit: PAGE_SIZE }))
  }, [dispatch, page])

  const handleRefresh = () => {
    dispatch(fetchWaitlistThunk({ page, limit: PAGE_SIZE }))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Waitlist"
        description="Manage users who have joined the waitlist."
        actions={<>
          <Button variant="outline" size="sm" onClick={handleRefresh} className="border-border hover:bg-primary/5">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </>}
      />

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="bg-surface border !border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Created</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((e) => (
                <tr key={e._id} className="border-t border-border">
                  <td className="p-3">{e.name || '-'}</td>
                  <td className="p-3">{e.email}</td>
                  <td className="p-3 capitalize">{e.status || 'pending'}</td>
                  <td className="p-3">{new Date(e.createdAt as any).toLocaleString()}</td>
                  <td className="p-3 text-right space-x-2">
                    <Button size="sm" onClick={() => dispatch(inviteWaitlistEntryThunk(e._id))}>Invite</Button>
                    <Button variant="outline" size="sm" onClick={() => dispatch(updateWaitlistEntryThunk({ id: e._id, update: { status: 'joined' } }))}>Mark Joined</Button>
                    <Button variant="destructive" size="sm" onClick={() => dispatch(deleteWaitlistEntryThunk(e._id))}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between p-3 border-t border-border">
            <div className="text-sm text-muted-foreground">Page {page} of {totalPages}</div>
            <div className="space-x-2">
              <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</Button>
              <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


