'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from '@/hooks/useDebounce'
import { useDispatch, useSelector } from 'react-redux'
import { PageHeader } from '../../../_components/PageHeader'
import { AppDispatch, RootState } from '@/store/store'
import { setCurrentPage, exportLawyersCsv } from '@/store/reducers/lawyerSlice'
import { Plus, Upload, Download, RefreshCw } from "lucide-react"
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import FiltersActionBar from './_components/FiltersActionBar'
import LawyersTable from './_components/LawyersTable'
import UserDetailsModal from './_components/UserDetailsModal'
import { TableSkeleton } from '@/components/skeletons'
import AddUserModal from './_components/AddUserModal'
import { getLawyers, bulkUploadLawyers } from '@/store/reducers/lawyerSlice'
import { ReleaseChannel } from '@/lib/enums'


const PAGE_SIZE = 42

const AdminLawyers = () => {

  ////////////////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>()
  const { lawyers, meta } = useSelector((s: RootState) => s.lawyer)
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get('q') || ''
  const initialStatus = (() => { const s = searchParams.get('status') || ''; return s === 'all' ? '' : s })()
  const initialSort = searchParams.get('sort') || ''
  const currentPage = meta?.currentPage || 1

  ////////////////////////////////////////////////////////// STATES /////////////////////////////////////////////////////////////
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [selectedStatus, setSelectedStatus] = useState(initialStatus)
  const [sortBy, setSortBy] = useState(initialSort)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [specialization, setSpecialization] = useState('all')
  const [province, setProvince] = useState('all')
  const [city, setCity] = useState('all')

  const debouncedSearch = useDebounce(searchTerm, 400)

  ////////////////////////////////////////////////////////// USE EFFECTS /////////////////////////////////////////////////////////////
  const initializedFromUrl = useRef(false)
  useEffect(() => {
    if (initializedFromUrl.current) return
    initializedFromUrl.current = true
    const pageParam = Number(searchParams.get('page') || '1')
    if (pageParam && pageParam !== currentPage) {
      dispatch(setCurrentPage(pageParam))
    }
  }, [dispatch, searchParams, currentPage])

  useEffect(() => {
    setLoading(true)
    const initialParams: any = {
      page: currentPage,
      limit: PAGE_SIZE,
      search: debouncedSearch || undefined,
      sort: sortBy || undefined,
      order: sortBy === 'createdAt' ? 'desc' : 'asc',
    }
    if (specialization && specialization !== 'all') initialParams.specialization = specialization
    if (province && province !== 'all') initialParams.province = province
    if (city && city !== 'all') initialParams.city = city
    if (selectedStatus && selectedStatus !== 'all') initialParams.accountStatus = selectedStatus

    dispatch(getLawyers(initialParams as any))
      .finally(() => setLoading(false))
  }, [dispatch, currentPage, debouncedSearch, selectedStatus, sortBy, specialization, province, city])

  useEffect(() => {
    dispatch(setCurrentPage(1))
  }, [dispatch, debouncedSearch, selectedStatus, sortBy, specialization, province, city])

  useEffect(() => {
    const params = new URLSearchParams()
    if (debouncedSearch) params.set('q', debouncedSearch)
    if (selectedStatus) params.set('status', selectedStatus)
    if (sortBy) params.set('sort', sortBy)
    if (specialization && specialization !== 'all') params.set('specialization', specialization)
    if (province && province !== 'all') params.set('province', province)
    if (city && city !== 'all') params.set('city', city)
    if (currentPage > 1) params.set('page', String(currentPage))
    const qs = params.toString()
    router.replace(qs ? `?${qs}` : '?', { scroll: false })
  }, [debouncedSearch, selectedStatus, sortBy, currentPage, router, city, specialization, province])

  ////////////////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////////////////
  const handleRefresh = () => {
    setLoading(true)
    dispatch(getLawyers({ page: currentPage, limit: PAGE_SIZE, search: debouncedSearch || undefined, sort: sortBy || undefined, order: sortBy === 'createdAt' ? 'desc' : 'asc' }))
      .finally(() => setLoading(false))
  }
  const handleSortChange = (sort: string) => {
    setSortBy(sort)
  }
  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status === 'all' ? '' : status)
  }
  const handleSpecializationFilter = (spec: string) => { setSpecialization(spec) }
  const handleLocationFilter = (prov: string, c: string) => { setProvince(prov); setCity(c) }
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('');
    setSortBy('');
    setSpecialization('all');
    setProvince('all');
    setCity('all');
    dispatch(setCurrentPage(1))
  }
  const handleAddUser = () => {
    setIsAddModalOpen(true)
  }
  const handleBulkUpload = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.csv,text/csv'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      // basic client-side validation before upload
      if (!file.name.toLowerCase().endsWith('.csv')) {
        toast.error('Please select a .csv file')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('CSV file is too large (max 5MB)')
        return
      }
      const text = await file.text()
      const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0)
      if (lines.length < 2) {
        toast.error('CSV must include header and at least one data row')
        return
      }
      const header = lines[0].split(',').map(h => h.trim().toLowerCase())

      const required = ['firstname', 'lastname', 'email', 'username', 'phone', 'password', 'releaseChannel']
      const missing = required.filter(c => !header.includes(c))
      if (missing.length) {
        toast.error(`Missing required columns: ${missing.join(', ')}`)
        return
      }
      // per-row checks (lightweight)
      const emailIdx = header.indexOf('email')
      const phoneIdx = header.indexOf('phone')
      const usernameIdx = header.indexOf('username')
      const pwdIdx = header.indexOf('password')
      const releaseChannelIdx = header.indexOf('releaseChannel')
      const errors: string[] = []
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const allowedReleaseChannels = Object.values(ReleaseChannel)
      for (let i = 1; i < lines.length && i <= 1000; i++) {
        const parts = lines[i].split(',')
        const email = parts[emailIdx]?.trim() || ''
        const phone = parts[phoneIdx]?.trim() || ''
        const username = parts[usernameIdx]?.trim() || ''
        const pwd = parts[pwdIdx]?.trim() || ''
        const releaseChannel = releaseChannelIdx >= 0 ? (parts[releaseChannelIdx]?.trim()?.toLowerCase() || '') : ReleaseChannel.PUBLIC
        if (!emailRegex.test(email)) errors.push(`Row ${i + 1}: invalid email`)
        if (!username) errors.push(`Row ${i + 1}: username is required`)
        if (phone.length < 6) errors.push(`Row ${i + 1}: phone too short`)
        if (pwd.length < 6) errors.push(`Row ${i + 1}: password too short`)
        if (!allowedReleaseChannels.includes(releaseChannel as ReleaseChannel)) errors.push(`Row ${i + 1}: invalid release channel '${releaseChannel}'`)
      }
      console.log('errors', errors)
      if (errors.length) {
        toast.error(`CSV has ${errors.length} issue(s). Fix and retry. First: ${errors[0]}`)
        return
      }
      setLoading(true)
      try {
        await dispatch(bulkUploadLawyers(file)).unwrap()
        await dispatch(getLawyers({
          page: currentPage,
          limit: PAGE_SIZE,
          search: debouncedSearch || undefined,
          sort: sortBy || undefined,
          order: sortBy === 'createdAt' ? 'desc' : 'asc',
          specialization: specialization === 'all' ? undefined : specialization,
          province: province === 'all' ? undefined : province,
          city: city === 'all' ? undefined : city,
        }))
      } finally { setLoading(false) }
    }
    input.click()
  }
  const handleExportCSV = async () => {
    const { payload } = await dispatch(exportLawyersCsv({ search: debouncedSearch || undefined, sort: sortBy || undefined, order: sortBy === 'createdAt' ? 'desc' : 'asc', limit: 100000 }))
    if (payload instanceof Blob) {
      const url = URL.createObjectURL(payload)
      const a = document.createElement('a')
      a.href = url
      a.download = 'users-export.csv'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    }
  }

  ////////////////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////////////
  return (
    <div className="space-y-6">

      <PageHeader
        title="Lawyers Management"
        description="Manage platform lawyers, their accounts, and permissions."
        actions={<>
          <div className="flex items-center gap-4">
            <Button
              onClick={handleAddUser}
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Lawyer
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkUpload}
              className="border-border hover:bg-primary/5"
            >
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="border-border hover:bg-primary/5"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="border-border hover:bg-primary/5"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </>}
      />

      <FiltersActionBar
        onSearch={setSearchTerm}
        onStatusFilter={handleStatusFilter}
        onSpecializationFilter={handleSpecializationFilter}
        onLocationFilter={handleLocationFilter}
        onSortChange={handleSortChange}
        onResetFilters={handleResetFilters}
        searchValue={searchTerm}
        statusValue={selectedStatus || undefined}
        sortValue={sortBy || undefined}
      />

      {
        loading ? (
          <TableSkeleton />
        ) : lawyers.length === 0 ? (
          <div className="bg-surface border !border-border rounded-lg p-10 text-center text-muted-foreground">
            <div className="text-2xl mb-2">No lawyers found</div>
            <div className="mb-6">Try adjusting your search or filters.</div>
            <Button variant="outline" size="sm" onClick={handleResetFilters} className="border-border">Reset filters</Button>
          </div>
        ) : (
          <LawyersTable setIsModalOpen={setIsModalOpen} />
        )}

      <UserDetailsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <AddUserModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />

    </div>
  )
}

export default AdminLawyers