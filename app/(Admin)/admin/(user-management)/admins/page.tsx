'use client'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AdminsFilterActionBar, AdminsTable, AdminRolePermissionsModal } from './_components'
import { Admin } from './_components/AdminsTable'
import { PageHeader } from '../../../_components/PageHeader'
import { AppDispatch } from '@/store/store'
import { getUsers, blockUser } from '@/store/reducers/userSlice'
import { User as StoreUser } from '@/store/types/user.types'
import { AccountStatus, UserRole } from '@/lib/enums'
import { Button } from '@/components/ui/button'
import { Download, Plus, RefreshCw } from 'lucide-react'

const PAGE_SIZE = 20

const AdminsPage = () => {

  ////////////////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>()
  const { users = [] } = useSelector((s: any) => s.user || {})

  ////////////////////////////////////////////////////////// STATES /////////////////////////////////////////////////////////////
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  const [page, setPage] = useState(1)
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  ////////////////////////////////////////////////////////// USE EFFECTS /////////////////////////////////////////////////////////////
  useEffect(() => {
    dispatch(getUsers({ page, limit: PAGE_SIZE, search: searchTerm || undefined }))
  }, [dispatch, page, searchTerm])

  useEffect(() => { setPage(1) }, [searchTerm, selectedRole, selectedStatus, sortBy])

  ////////////////////////////////////////////////////////// MEMOS /////////////////////////////////////////////////////////////
  const adminUsers: StoreUser[] = useMemo(() => {
    return (users || []).filter((u: StoreUser) => u.role === UserRole.ADMIN)
  }, [users])

  const filteredAdmins: Admin[] = useMemo(() => {
    const list = adminUsers.map((u, idx) => ({
      id: idx + 1,
      name: `${u.firstname || ''} ${u.lastname || ''}`.trim() || u.username || u.email,
      email: u.email,
      role: 'superadmin',
      status: u.accountStatus,
      createdDate: u.createdAt,
      lastLogin: u.updatedAt,
      permissions: [],
    }))
    const roleOk = (role: string) => selectedRole === 'all' || role.toLowerCase() === selectedRole.toLowerCase()
    const statusOk = (status: AccountStatus) => selectedStatus === 'all' || status.toLowerCase() === selectedStatus.toLowerCase()
    const searchOk = (name: string, email: string) => !searchTerm || name.toLowerCase().includes(searchTerm.toLowerCase()) || email.toLowerCase().includes(searchTerm.toLowerCase())
    const filtered = list.filter(a => roleOk(a.role) && statusOk(a.status) && searchOk(a.name, a.email))
    const sorted = [...filtered]
    switch (sortBy) {
      case 'name': sorted.sort((a, b) => a.name.localeCompare(b.name)); break
      case 'email': sorted.sort((a, b) => a.email.localeCompare(b.email)); break
      case 'role': sorted.sort((a, b) => a.role.localeCompare(b.role)); break
      case 'status': sorted.sort((a, b) => a.status.localeCompare(b.status)); break
      case 'created': sorted.sort((a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()); break
      default: break
    }
    return sorted
  }, [adminUsers, selectedRole, selectedStatus, searchTerm, sortBy])

  ////////////////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////////////////
  const getRealId = (id: number) => adminUsers[id - 1]?._id

  const handleSearch = (term: string) => setSearchTerm(term)
  const handleRoleFilter = (role: string) => setSelectedRole(role)
  const handleStatusFilter = (status: string) => setSelectedStatus(status)
  const handleSortChange = (sort: string) => setSortBy(sort)
  const handleResetFilters = () => { setSearchTerm(''); setSelectedRole('all'); setSelectedStatus('all'); setSortBy('default') }

  const handleEditAdmin = (admin: Admin) => { setSelectedAdmin(admin); setIsModalOpen(true) }
  const handleSuspendAdmin = async (admin: Admin) => { const uid = getRealId(admin.id); if (uid && confirm(`Suspend ${admin.name}?`)) await dispatch(blockUser({ id: uid, block: true })) }
  const handleReactivateAdmin = async (admin: Admin) => { const uid = getRealId(admin.id); if (uid && confirm(`Reactivate ${admin.name}?`)) await dispatch(blockUser({ id: uid, block: false })) }
  const handleUpdateRole = (_adminId: number, _newRole: string, _permissions: string[]) => {
    console.log('update role', _adminId, _newRole, _permissions)
  }
  const handleAddAdmin = () => { }
  const handleExportCSV = () => { }
  const handleRefresh = () => { dispatch(getUsers({ page, limit: PAGE_SIZE, search: searchTerm || undefined })) }

  ////////////////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////////////
  const itemsPerPage = 10
  const indexOfLast = page * itemsPerPage
  const indexOfFirst = indexOfLast - itemsPerPage
  const currentAdmins = filteredAdmins.slice(indexOfFirst, indexOfLast)
  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admins Management"
        description="View, add, or manage internal platform administrators and their privileges."
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              onClick={handleAddAdmin}
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Admin</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleExportCSV}
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleRefresh}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </Button>
          </div>
        }
      />

      <AdminsFilterActionBar
        onSearch={handleSearch}
        onRoleFilter={handleRoleFilter}
        onStatusFilter={handleStatusFilter}
        onSortChange={handleSortChange}
        onResetFilters={handleResetFilters}
      />

      <AdminsTable
        admins={currentAdmins}
        onEditAdmin={handleEditAdmin}
        onSuspendAdmin={handleSuspendAdmin}
        onReactivateAdmin={handleReactivateAdmin}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <AdminRolePermissionsModal
        admin={selectedAdmin}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdateRole={handleUpdateRole}
      />
    </div>
  )
}

export default AdminsPage 