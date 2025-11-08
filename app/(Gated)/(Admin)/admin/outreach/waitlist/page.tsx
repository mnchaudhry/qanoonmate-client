'use client'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PageHeader } from '../../../_components/PageHeader'
import { AppDispatch, RootState } from '@/store/store'
import { fetchWaitlistThunk } from '@/store/reducers/waitlistSlice'
import { Button } from '@/components/ui/button'
import { TableSkeleton } from '@/components/skeletons'
import { RefreshCw } from 'lucide-react'
import WaitlistFilters from './_components/WaitlistFilters'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from '@/hooks/useDebounce'
import WaitlistTable from './_components/WaitlistTable'

const PAGE_SIZE = 20

export default function AdminWaitlistPage() {

  //////////////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>()
  const pathname = usePathname();
  const router = useRouter()
  const { isLoading, meta } = useSelector((s: RootState) => s.waitlist)
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get('q') || ''
  const initialStatus = (() => { const s = searchParams.get('status') || ''; return s === 'all' ? '' : s })()
  const initialSortBy = searchParams.get('sortBy') || 'createdAt'
  const initialSortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'

  //////////////////////////////////////////////////////// STATES ////////////////////////////////////////////////////////////////
  const [search, setSearch] = useState(initialSearch)
  const [status, setStatus] = useState(initialStatus)
  const [sortBy, setSortBy] = useState(initialSortBy)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialSortOrder)

  const debouncedSearch = useDebounce(search, 400)

  //////////////////////////////////////////////////////// EFFECTS ////////////////////////////////////////////////////////////////
  useEffect(() => {
    const params: any = {
      page: meta.currentPage,
      limit: PAGE_SIZE,
      status: (!status || status == 'all') ? undefined : status,
      search: debouncedSearch || undefined,
      sortBy,
      sortOrder
    }
    dispatch(fetchWaitlistThunk(params))
  }, [dispatch, meta.currentPage, debouncedSearch, status, sortBy, sortOrder])

  //////////////////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////////////////////
  const handleRefresh = () => {
    const params: any = {
      page: meta.currentPage,
      limit: PAGE_SIZE,
      status: (!status || status == 'all') ? undefined : status,
      search: debouncedSearch || undefined,
      sortBy,
      sortOrder
    }
    dispatch(fetchWaitlistThunk(params))
  }

  const handleResetFilters = () => {
    setSearch('')
    setStatus('')
    setSortBy('createdAt')
    setSortOrder('desc')
  }

  const query = new URLSearchParams()
  if (debouncedSearch) query.set('q', debouncedSearch)
  if (status) query.set('status', status)
  if (sortBy) query.set('sortBy', sortBy)
  if (sortOrder) query.set('sortOrder', sortOrder)
  if (meta.currentPage && meta.currentPage !== 1) query.set('page', String(meta.currentPage))
  const qs = query.toString()

  if (typeof window !== 'undefined') {
    const target = qs ? `${pathname}?${qs}` : pathname
    // Avoid push storms by replacing only when different
    if (window.location.search !== (qs ? `?${qs}` : '')) {
      router.replace(target, { scroll: false })
    }
  }


  //////////////////////////////////////////////////////// RENDER ////////////////////////////////////////////////////////////////
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

      <WaitlistFilters
        onSearch={setSearch}
        onStatusFilter={setStatus}
        onSortByChange={setSortBy}
        onSortOrderChange={setSortOrder}
        onResetFilters={handleResetFilters}
        searchValue={search}
        statusValue={status}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="border !border-border rounded-lg overflow-hidden">
          <WaitlistTable />
        </div>
      )}
    </div>
  )
}


