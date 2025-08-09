'use client'
import { useState } from 'react'
import { Search, Plus, Download, RefreshCw, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface AdminsFilterActionBarProps {
  onSearch: (query: string) => void
  onRoleFilter: (role: string) => void
  onStatusFilter: (status: string) => void
  onSortChange: (sort: string) => void
  onResetFilters: () => void
  onAddAdmin: () => void
  onExportCSV: () => void
  onRefresh: () => void
}

const AdminsFilterActionBar: React.FC<AdminsFilterActionBarProps> = ({
  onSearch,
  onRoleFilter,
  onStatusFilter,
  onSortChange,
  onResetFilters,
  onAddAdmin,
  onExportCSV,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [sortBy, setSortBy] = useState('')

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
    setSelectedRole('')
    setSelectedStatus('')
    setSortBy('')
    onResetFilters()
  }

  return (
    <Card className="mb-6">
      <CardContent className="space-y-4 p-6">
        {/* Search Bar */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by Name or Email..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 !border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
          >
            <Search className="w-5 h-5" />
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Role Type:</label>
            <Select value={selectedRole} onValueChange={handleRoleChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Roles</SelectItem>
                <SelectItem value="superadmin">SuperAdmin</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="analyst">Analyst</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Status:</label>
            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Sort By:</label>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Default" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Default</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="role">Role</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="created">Date Added</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            variant="ghost"
            onClick={handleResetFilters}
            className="flex items-center space-x-2 px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Reset Filters</span>
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            onClick={onAddAdmin}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Admin</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onExportCSV}
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onRefresh}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default AdminsFilterActionBar
