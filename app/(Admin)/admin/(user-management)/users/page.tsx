'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from '@/hooks/use-debounce'
import { useDispatch, useSelector } from 'react-redux'
import { PageHeader } from '../../../_components/PageHeader'
import { AppDispatch, RootState } from '@/store/store'
import { getUsers, setCurrentPage } from '@/store/reducers/userSlice'
import { User } from '@/store/types/user.types'
import { Plus, Upload, Download, RefreshCw } from "lucide-react"
import { Button } from '@/components/ui/button'
import FiltersActionBar from './_components/FiltersActionBar'
import UsersTable from './_components/UsersTable'
import UserDetailsModal from './_components/UserDetailsModal'
import { TableSkeleton } from '@/components/skeletons'


const PAGE_SIZE = 20

const AdminUsers = () => {

  ////////////////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>()
  const { users, meta } = useSelector((s: RootState) => s.user)
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get('q') || ''
  const initialRole = searchParams.get('role') || ''
  const initialStatus = searchParams.get('status') || ''
  const initialSort = searchParams.get('sort') || ''
  const currentPage = meta?.currentPage || 1

  ////////////////////////////////////////////////////////// STATES /////////////////////////////////////////////////////////////
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [selectedRole, setSelectedRole] = useState(initialRole)
  const [selectedStatus, setSelectedStatus] = useState(initialStatus)
  const [sortBy, setSortBy] = useState(initialSort)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
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
    dispatch(getUsers({ page: currentPage, limit: PAGE_SIZE, search: debouncedSearch || undefined, sortBy: sortBy || undefined, sortOrder: sortBy === 'createdAt' ? 'desc' : 'asc' }))
      .finally(() => setLoading(false))
  }, [dispatch, currentPage, debouncedSearch, sortBy])

  useEffect(() => {
    dispatch(setCurrentPage(1))
  }, [dispatch, debouncedSearch, selectedRole, selectedStatus, sortBy])

  useEffect(() => {
    const params = new URLSearchParams()
    if (debouncedSearch) params.set('q', debouncedSearch)
    if (selectedRole) params.set('role', selectedRole)
    if (selectedStatus) params.set('status', selectedStatus)
    if (sortBy) params.set('sort', sortBy)
    if (currentPage > 1) params.set('page', String(currentPage))
    const qs = params.toString()
    router.replace(qs ? `?${qs}` : '?', { scroll: false })
  }, [debouncedSearch, selectedRole, selectedStatus, sortBy, currentPage, router])

  ////////////////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////////////////
  const handleRefresh = () => {
    setLoading(true)
    dispatch(getUsers({ page: currentPage, limit: PAGE_SIZE, search: debouncedSearch || undefined, sortBy: sortBy || undefined, sortOrder: sortBy === 'createdAt' ? 'desc' : 'asc' }))
      .finally(() => setLoading(false))
  }
  const handleSortChange = (sort: string) => {
    setSortBy(sort)
  }
  const handleRoleFilter = (role: string) => {
    setSelectedRole(role)
  }
  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status)
  }
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedRole('');
    setSelectedStatus('');
    setSortBy('');
    dispatch(setCurrentPage(1))
  }
  const handleAddUser = () => {

  }
  const handleBulkUpload = () => {

  }
  const handleExportCSV = () => {

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
        onSortChange={handleSortChange}
        onResetFilters={handleResetFilters}
        searchValue={searchTerm}
        roleValue={selectedRole || undefined}
        statusValue={selectedStatus || undefined}
        sortValue={sortBy || undefined}
        onAddUser={handleAddUser}
        onBulkUpload={handleBulkUpload}
        onExportCSV={handleExportCSV}
        onRefresh={handleRefresh}
      />

      {
        loading ? (
          <TableSkeleton />
        ) : users.length === 0 ? (
          <div className="bg-surface border !border-border rounded-lg p-10 text-center text-muted-foreground">
            <div className="text-2xl mb-2">No users found</div>
            <div className="mb-6">Try adjusting your search or filters.</div>
            <Button variant="outline" size="sm" onClick={handleResetFilters} className="border-border">Reset filters</Button>
          </div>
        ) : (
          <UsersTable setIsModalOpen={setIsModalOpen} />
        )}

      <UserDetailsModal user={selectedUser} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

    </div>
  )
}

export default AdminUsers