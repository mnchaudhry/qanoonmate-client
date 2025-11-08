'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from '@/hooks/useDebounce'
import { useDispatch, useSelector } from 'react-redux'
import { PageHeader } from '../../../_components/PageHeader'
import { AppDispatch, RootState } from '@/store/store'
import { getUsers, setCurrentPage, exportUsersCsv, bulkUploadUsers } from '@/store/reducers/userSlice'
import { Plus, Upload, Download, RefreshCw } from "lucide-react"
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import FiltersActionBar from './_components/FiltersActionBar'
import UsersTable from './_components/UsersTable'
import UserDetailsModal from './_components/UserDetailsModal'
import { TableSkeleton } from '@/components/skeletons'
import AddUserModal from './_components/AddUserModal'
import { ReleaseChannel, UserRole } from '@/lib/enums'


const PAGE_SIZE = 20

const AdminUsers = () => {

  ////////////////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>()
  const { users, meta } = useSelector((s: RootState) => s.user)
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get('q') || ''
  const initialRole = (() => { const r = searchParams.get('role') || ''; return r === 'all' ? '' : r })()
  const initialStatus = (() => { const s = searchParams.get('status') || ''; return s === 'all' ? '' : s })()
  const initialReleaseChannel = (() => { const r = searchParams.get('releaseChannel') || ''; return r === 'all' ? '' : r })()
  const initialSort = searchParams.get('sort') || ''
  const currentPage = meta?.currentPage || 1

  ////////////////////////////////////////////////////////// STATES /////////////////////////////////////////////////////////////
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [selectedRole, setSelectedRole] = useState(initialRole)
  const [selectedStatus, setSelectedStatus] = useState(initialStatus)
  const [selectedReleaseChannel, setSelectedReleaseChannel] = useState(initialReleaseChannel)
  const [sortBy, setSortBy] = useState(initialSort)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

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
    dispatch(getUsers({
      page: currentPage,
      limit: PAGE_SIZE,
      search: debouncedSearch || undefined,
      role: (!selectedRole || selectedRole === 'all') ? undefined : selectedRole,
      accountStatus: (!selectedStatus || selectedStatus === 'all') ? undefined : selectedStatus,
      releaseChannel: (!selectedReleaseChannel || selectedReleaseChannel === 'all') ? undefined : selectedReleaseChannel,
      sortBy: sortBy || undefined,
      sortOrder: sortBy === 'createdAt' ? 'desc' : 'asc'
    }))
      .finally(() => setLoading(false))
  }, [dispatch, currentPage, debouncedSearch, selectedRole, selectedStatus, selectedReleaseChannel, sortBy])

  useEffect(() => {
    dispatch(setCurrentPage(1))
  }, [dispatch, debouncedSearch, selectedRole, selectedStatus, selectedReleaseChannel, sortBy])

  useEffect(() => {
    const params = new URLSearchParams()
    if (debouncedSearch) params.set('q', debouncedSearch)
    if (selectedRole) params.set('role', selectedRole)
    if (selectedStatus) params.set('status', selectedStatus)
    if (selectedReleaseChannel) params.set('releaseChannel', selectedReleaseChannel)
    if (sortBy) params.set('sort', sortBy)
    if (currentPage > 1) params.set('page', String(currentPage))
    const qs = params.toString()
    router.replace(qs ? `?${qs}` : '?', { scroll: false })
  }, [debouncedSearch, selectedRole, selectedStatus, selectedReleaseChannel, sortBy, currentPage, router])

  ////////////////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////////////////
  const handleRefresh = () => {
    setLoading(true)
    dispatch(getUsers({
      page: currentPage,
      limit: PAGE_SIZE,
      search: debouncedSearch || undefined,
      role: (!selectedRole || selectedRole === 'all') ? undefined : selectedRole,
      accountStatus: (!selectedStatus || selectedStatus === 'all') ? undefined : selectedStatus,
      releaseChannel: (!selectedReleaseChannel || selectedReleaseChannel === 'all') ? undefined : selectedReleaseChannel,
      sortBy: sortBy || undefined,
      sortOrder: sortBy === 'createdAt' ? 'desc' : 'asc'
    }))
      .finally(() => setLoading(false))
  }
  const handleSortChange = (sort: string) => {
    setSortBy(sort)
  }
  const handleRoleFilter = (role: string) => {
    setSelectedRole(role === 'all' ? '' : role)
  }
  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status === 'all' ? '' : status)
  }
  const handleReleaseChannelFilter = (releaseChannel: string) => {
    setSelectedReleaseChannel(releaseChannel === 'all' ? '' : releaseChannel)
  }
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedRole('');
    setSelectedStatus('');
    setSelectedReleaseChannel('');
    setSortBy('');
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
      // Split lines, filter out empty lines and lines that are just empty CSV fields (e.g. ",,,,,,,")
      const lines = text
        .split(/\r?\n/)
        .filter(l => {
          // Remove lines that are empty or only contain commas/whitespace
          if (!l.trim()) return false;
          // Remove lines where all fields are empty after splitting by comma
          const fields = l.split(',').map(f => f.trim());
          // If at least one field is non-empty, keep the line
          return fields.some(f => f.length > 0);
        });

      if (lines.length < 2) {
        toast.error('CSV must include header and at least one data row');
        return;
      }
      const header = lines[0].split(',').map(h => h.trim());
      console.log('lines', lines);
      console.log('header', header);
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
      const roleIdx = header.indexOf('role')
      const releaseChannelIdx = header.indexOf('releaseChannel')
      const errors: string[] = []
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const allowedRoles = Object.values(UserRole)
      const allowedReleaseChannels = Object.values(ReleaseChannel)
      for (let i = 1; i < lines.length && i <= 1000; i++) {
        const parts = lines[i].split(',')
        const email = parts[emailIdx]?.trim() || ''
        const phone = parts[phoneIdx]?.trim() || ''
        const username = parts[usernameIdx]?.trim() || ''
        const pwd = parts[pwdIdx]?.trim() || ''
        const role = roleIdx >= 0 ? (parts[roleIdx]?.trim()?.toLowerCase() || '') : UserRole.CLIENT
        const releaseChannel = releaseChannelIdx >= 0 ? (parts[releaseChannelIdx]?.trim()?.toLowerCase() || '') : ReleaseChannel.PUBLIC
        if (!emailRegex.test(email)) errors.push(`Row ${i + 1}: invalid email`)
        if (!username) errors.push(`Row ${i + 1}: username is required`)
        if (phone.length < 6) errors.push(`Row ${i + 1}: phone too short`)
        if (pwd.length < 6) errors.push(`Row ${i + 1}: password too short`)
        if (!allowedRoles.includes(role as UserRole)) errors.push(`Row ${i + 1}: invalid role '${role}'`)
        if (!allowedReleaseChannels.includes(releaseChannel as ReleaseChannel)) errors.push(`Row ${i + 1}: invalid release channel '${releaseChannel}'`)
      }
      console.log('errors', errors)
      if (errors.length) {
        toast.error(`CSV has ${errors.length} issue(s). Fix and retry. First: ${errors[0]}`)
        return
      }
      setLoading(true)
      try {
        await dispatch(bulkUploadUsers(file)).unwrap()
        await dispatch(getUsers({
          page: currentPage,
          limit: PAGE_SIZE,
          search: debouncedSearch || undefined,
          role: (!selectedRole || selectedRole === 'all') ? undefined : selectedRole,
          accountStatus: (!selectedStatus || selectedStatus === 'all') ? undefined : selectedStatus,
          releaseChannel: (!selectedReleaseChannel || selectedReleaseChannel === 'all') ? undefined : selectedReleaseChannel,
          sortBy: sortBy || undefined,
          sortOrder: sortBy === 'createdAt' ? 'desc' : 'asc'
        }))
      } finally { setLoading(false) }
    }
    input.click()
  }
  const handleExportCSV = async () => {
    const { payload } = await dispatch(exportUsersCsv({ search: debouncedSearch || undefined, role: (!selectedRole || selectedRole === 'all') ? undefined : selectedRole, accountStatus: (!selectedStatus || selectedStatus === 'all') ? undefined : selectedStatus, releaseChannel: (!selectedReleaseChannel || selectedReleaseChannel === 'all') ? undefined : selectedReleaseChannel, sortBy: sortBy || undefined, sortOrder: sortBy === 'createdAt' ? 'desc' : 'asc', limit: 100000 }))
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
        title="Users Management"
        description="Manage platform users, their accounts, and permissions."
        actions={<>
          <div className="flex items-center gap-4">
            <Button
              onClick={handleAddUser}
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add User
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
        onRoleFilter={handleRoleFilter}
        onStatusFilter={handleStatusFilter}
        onReleaseChannelFilter={handleReleaseChannelFilter}
        onSortChange={handleSortChange}
        onResetFilters={handleResetFilters}
        searchValue={searchTerm}
        roleValue={selectedRole || undefined}
        statusValue={selectedStatus || undefined}
        releaseChannelValue={selectedReleaseChannel || undefined}
        sortValue={sortBy || undefined}
      />

      {
        loading ? (
          <TableSkeleton />
        ) :
          users.length === 0
            ? (
              <div className="bg-surface border !border-border rounded-lg p-10 text-center text-muted-foreground">
                <div className="text-2xl mb-2">No users found</div>
                <div className="mb-6">Try adjusting your search or filters.</div>
                <Button variant="outline" size="sm" onClick={handleResetFilters} className="border-border">Reset filters</Button>
              </div>
            )
            : (
              <UsersTable setIsModalOpen={setIsModalOpen} />
            )}

      <UserDetailsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <AddUserModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />

    </div>
  )
}

export default AdminUsers