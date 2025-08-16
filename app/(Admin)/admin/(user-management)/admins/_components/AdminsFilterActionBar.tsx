'use client'
import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import SearchBar from '@/components/SearchBar'

interface AdminsFilterActionBarProps {
  onSearch: (query: string) => void
  onRoleFilter: (role: string) => void
  onStatusFilter: (status: string) => void
  onSortChange: (sort: string) => void
  onResetFilters: () => void
}

const AdminsFilterActionBar: React.FC<AdminsFilterActionBarProps> = ({
  onSearch,
  onRoleFilter,
  onStatusFilter,
  onSortChange,
  onResetFilters,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [sortBy, setSortBy] = useState('default')

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value)
  }

  const handleRoleChange = (value: string) => {
    setSelectedRole(value)
    onRoleFilter(value)
  }

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value)
    onStatusFilter(value)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    onSortChange(value)
  }

  const handleResetFilters = () => {
    setSearchTerm('')
    setSelectedRole('all')
    setSelectedStatus('all')
    setSortBy('default')
    onResetFilters()
  }

  return (
    <div className="mb-6 flex justify-between items-center">
      {/* Search Bar */}
      <SearchBar
        value={searchTerm}
        onChange={handleSearchChange}
        containerClassName="mb-0 mx-0 w-1/2"
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <Select value={selectedRole} onValueChange={handleRoleChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="superadmin">SuperAdmin</SelectItem>
            <SelectItem value="moderator">Moderator</SelectItem>
            <SelectItem value="support">Support</SelectItem>
            <SelectItem value="analyst">Analyst</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Default" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="role">Role</SelectItem>
            <SelectItem value="status">Status</SelectItem>
            <SelectItem value="created">Date Added</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={handleResetFilters}
          className="border-border hover:bg-primary/5"
        >
          <X className="h-4 w-4 mr-2" />
          Reset Filters
        </Button>
      </div>


    </div>
  )
}

export default AdminsFilterActionBar
