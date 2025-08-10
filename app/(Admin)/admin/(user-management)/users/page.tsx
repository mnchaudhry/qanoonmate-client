'use client'
import { useState, useEffect } from 'react'
import { 
  FiltersActionBar, 
  UsersTable, 
  UserDetailsModal 
} from './_components'
import { PageHeader } from '../../../_components/PageHeader'
import { Users } from 'lucide-react'

// Mock data for demonstration
const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    role: 'lawyer',
    status: 'active',
    isVerified: true,
    signupDate: '2024-01-15',
    lastLogin: '2024-01-20 10:30 AM',
    consultations: 15,
    flags: 0,
    totalCases: 15,
    casesWon: 12,
    activeCases: 3,
    notes: 'Experienced lawyer with excellent track record.'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1 (555) 987-6543',
    location: 'Los Angeles, CA',
    role: 'user',
    status: 'pending',
    isVerified: false,
    signupDate: '2024-01-18',
    lastLogin: '2024-01-19 2:15 PM',
    consultations: 2,
    flags: 1,
    totalCases: 2,
    casesWon: 0,
    activeCases: 2,
    notes: 'New user, requires verification.'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    phone: '+1 (555) 456-7890',
    location: 'Chicago, IL',
    role: 'lawyer',
    status: 'suspended',
    isVerified: true,
    signupDate: '2023-12-10',
    lastLogin: '2024-01-10 8:45 AM',
    consultations: 8,
    flags: 2,
    totalCases: 8,
    casesWon: 5,
    activeCases: 0,
    notes: 'Suspended due to policy violation.'
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    phone: '+1 (555) 321-0987',
    location: 'Houston, TX',
    role: 'user',
    status: 'active',
    isVerified: true,
    signupDate: '2024-01-12',
    lastLogin: '2024-01-20 4:20 PM',
    consultations: 5,
    flags: 0,
    totalCases: 5,
    casesWon: 3,
    activeCases: 2,
    notes: 'Regular user with good engagement.'
  },
  {
    id: 5,
    name: 'David Brown',
    email: 'david@example.com',
    phone: '+1 (555) 654-3210',
    location: 'Phoenix, AZ',
    role: 'lawyer',
    status: 'active',
    isVerified: true,
    signupDate: '2023-11-20',
    lastLogin: '2024-01-20 9:10 AM',
    consultations: 22,
    flags: 0,
    totalCases: 22,
    casesWon: 18,
    activeCases: 4,
    notes: 'Top performing lawyer.'
  }
]

const AdminUsers = () => {
  const [users, setUsers] = useState(mockUsers)
  const [filteredUsers, setFilteredUsers] = useState(mockUsers)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = users

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Role filter
    if (selectedRole) {
      filtered = filtered.filter(user => user.role === selectedRole)
    }

    // Status filter
    if (selectedStatus) {
      filtered = filtered.filter(user => user.status === selectedStatus)
    }

    setFilteredUsers(filtered)
    setCurrentPage(1)
  }, [searchTerm, selectedRole, selectedStatus, users])

  // Pagination
  const indexOfLastUser = currentPage * itemsPerPage
  const indexOfFirstUser = indexOfLastUser - itemsPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)

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

  const handleViewUser = (user: any) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleEditUser = (user: any) => {
    // TODO: Implement edit functionality
    console.log('Edit user:', user)
  }

  const handleApproveUser = (user: any) => {
    setUsers(prev => prev.map(u => 
      u.id === user.id ? { ...u, status: 'active' } : u
    ))
  }

  const handleSuspendUser = (user: any) => {
    setUsers(prev => prev.map(u => 
      u.id === user.id ? { ...u, status: 'suspended' } : u
    ))
  }

  const handleDeleteUser = (user: any) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(u => u.id !== user.id))
    }
  }

  const handleAddUser = () => {
    // TODO: Implement add user functionality
    console.log('Add new user')
  }

  const handleBulkUpload = () => {
    // TODO: Implement bulk upload functionality
    console.log('Bulk upload users')
  }

  const handleExportCSV = () => {
    // TODO: Implement export functionality
    console.log('Export users')
  }

  const handleSortChange = (sort: string) => {
    // TODO: Implement sort functionality
    console.log('Sort by:', sort)
  }

  const handleResetFilters = () => {
    setSearchTerm('')
    setSelectedRole('')
    setSelectedStatus('')
  }

  const handleResetPassword = (user: any) => {
    // TODO: Implement reset password functionality
    console.log('Reset password for:', user)
  }

  const handleViewLogs = (user: any) => {
    // TODO: Implement view logs functionality
    console.log('View logs for:', user)
  }

  const handleRefresh = () => {
    // TODO: Implement refresh functionality
    console.log('Refresh users data')
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Users Management"
        description="Manage platform users, their accounts, and permissions."
      />
      
      <FiltersActionBar
        onSearch={handleSearch}
        onRoleFilter={handleRoleFilter}
        onStatusFilter={handleStatusFilter}
        onSortChange={handleSortChange}
        onResetFilters={handleResetFilters}
        onAddUser={handleAddUser}
        onBulkUpload={handleBulkUpload}
        onExportCSV={handleExportCSV}
        onRefresh={handleRefresh}
      />

      <UsersTable
        users={currentUsers}
        onViewUser={handleViewUser}
        onEditUser={handleEditUser}
        onApproveUser={handleApproveUser}
        onSuspendUser={handleSuspendUser}
        onResetPassword={handleResetPassword}
        onDeleteUser={handleDeleteUser}
        onViewLogs={handleViewLogs}
      />

      <UserDetailsModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default AdminUsers