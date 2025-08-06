'use client'
import { useState, useEffect } from 'react'
import { 
  AdminsHeader, 
  AdminsFilterActionBar, 
  AdminsTable, 
  AdminRolePermissionsModal 
} from './_components'
import { Admin } from './_components/AdminsTable'

// Mock data for demonstration
const mockAdmins: Admin[] = [
  {
    id: 1,
    name: 'Arham Khan',
    email: 'arham@qanoonmate.legal',
    role: 'SuperAdmin',
    status: 'active',
    createdDate: '2023-01-15',
    lastLogin: '2024-01-20 10:30 AM',
    permissions: [
      'can_add_users',
      'can_suspend_users',
      'can_manage_lawyers',
      'can_view_consultations',
      'can_edit_legal_data',
      'access_platform_settings'
    ]
  },
  {
    id: 2,
    name: 'Hina Shafi',
    email: 'hina@qanoonmate.legal',
    role: 'Moderator',
    status: 'active',
    createdDate: '2023-02-10',
    lastLogin: '2024-01-19 2:15 PM',
    permissions: [
      'can_add_users',
      'can_suspend_users',
      'can_manage_lawyers',
      'can_view_consultations'
    ]
  },
  {
    id: 3,
    name: 'Osama Zafar',
    email: 'osama@qanoonmate.legal',
    role: 'Support',
    status: 'suspended',
    createdDate: '2023-03-05',
    lastLogin: '2024-01-10 8:45 AM',
    permissions: [
      'can_add_users',
      'can_view_consultations'
    ]
  },
  {
    id: 4,
    name: 'Zara Ahmed',
    email: 'zara@qanoonmate.legal',
    role: 'Analyst',
    status: 'active',
    createdDate: '2023-04-20',
    lastLogin: '2024-01-20 4:20 PM',
    permissions: [
      'can_view_consultations'
    ]
  },
  {
    id: 5,
    name: 'Ahmed Hassan',
    email: 'ahmed@qanoonmate.legal',
    role: 'Moderator',
    status: 'active',
    createdDate: '2023-05-12',
    lastLogin: '2024-01-18 11:30 AM',
    permissions: [
      'can_add_users',
      'can_suspend_users',
      'can_manage_lawyers',
      'can_view_consultations'
    ]
  },
  {
    id: 6,
    name: 'Fatima Ali',
    email: 'fatima@qanoonmate.legal',
    role: 'Support',
    status: 'active',
    createdDate: '2023-06-08',
    lastLogin: '2024-01-19 9:20 AM',
    permissions: [
      'can_add_users',
      'can_view_consultations'
    ]
  }
]

const AdminsPage = () => {
  const [admins, setAdmins] = useState<Admin[]>(mockAdmins)
  const [filteredAdmins, setFilteredAdmins] = useState<Admin[]>(mockAdmins)
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  // Filter admins based on search and filters
  useEffect(() => {
    let filtered = admins

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(admin =>
        admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Role filter
    if (selectedRole) {
      filtered = filtered.filter(admin => admin.role.toLowerCase() === selectedRole.toLowerCase())
    }

    // Status filter
    if (selectedStatus) {
      filtered = filtered.filter(admin => admin.status.toLowerCase() === selectedStatus.toLowerCase())
    }

    setFilteredAdmins(filtered)
    setCurrentPage(1)
  }, [searchTerm, selectedRole, selectedStatus, admins])

  // Pagination
  const indexOfLastAdmin = currentPage * itemsPerPage
  const indexOfFirstAdmin = indexOfLastAdmin - itemsPerPage
  const currentAdmins = filteredAdmins.slice(indexOfFirstAdmin, indexOfLastAdmin)
  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage)

  // Handlers
  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleRoleFilter = (role: string) => {
    setSelectedRole(role)
  }

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status)
  }

  const handleSortChange = (sort: string) => {
    let sorted = [...filteredAdmins]
    switch (sort) {
      case 'name':
        sorted = sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'email':
        sorted = sorted.sort((a, b) => a.email.localeCompare(b.email))
        break
      case 'role':
        sorted = sorted.sort((a, b) => a.role.localeCompare(b.role))
        break
      case 'status':
        sorted = sorted.sort((a, b) => a.status.localeCompare(b.status))
        break
      case 'created':
        sorted = sorted.sort((a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime())
        break
      default:
        break
    }
    setFilteredAdmins(sorted)
  }

  const handleResetFilters = () => {
    setSearchTerm('')
    setSelectedRole('')
    setSelectedStatus('')
  }

  const handleEditAdmin = (admin: Admin) => {
    setSelectedAdmin(admin)
    setIsModalOpen(true)
  }

  const handleSuspendAdmin = (admin: Admin) => {
    if (confirm(`Are you sure you want to suspend ${admin.name}?`)) {
      setAdmins(prev => prev.map(a => 
        a.id === admin.id ? { ...a, status: 'suspended' } : a
      ))
    }
  }

  const handleReactivateAdmin = (admin: Admin) => {
    if (confirm(`Are you sure you want to reactivate ${admin.name}?`)) {
      setAdmins(prev => prev.map(a => 
        a.id === admin.id ? { ...a, status: 'active' } : a
      ))
    }
  }

  const handleUpdateRole = (adminId: number, newRole: string, permissions: string[]) => {
    setAdmins(prev => prev.map(a => 
      a.id === adminId ? { ...a, role: newRole, permissions } : a
    ))
  }

  const handleAddAdmin = () => {
    // TODO: Implement add admin functionality
    console.log('Add new admin')
  }

  const handleExportCSV = () => {
    // TODO: Implement export functionality
    console.log('Export admins')
  }

  const handleRefresh = () => {
    // TODO: Implement refresh functionality
    console.log('Refresh admins data')
  }

  return (
    <div className="p-6 space-y-6">
      <AdminsHeader />
      
      <AdminsFilterActionBar
        onSearch={handleSearch}
        onRoleFilter={handleRoleFilter}
        onStatusFilter={handleStatusFilter}
        onSortChange={handleSortChange}
        onResetFilters={handleResetFilters}
        onAddAdmin={handleAddAdmin}
        onExportCSV={handleExportCSV}
        onRefresh={handleRefresh}
      />

      <AdminsTable
        admins={currentAdmins}
        onEditAdmin={handleEditAdmin}
        onSuspendAdmin={handleSuspendAdmin}
        onReactivateAdmin={handleReactivateAdmin}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
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