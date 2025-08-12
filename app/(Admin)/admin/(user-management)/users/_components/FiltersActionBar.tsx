"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Upload, Download, RefreshCw, X } from "lucide-react"

interface FiltersActionBarProps {
  onSearch: (query: string) => void
  onRoleFilter: (role: string) => void
  onStatusFilter: (status: string) => void
  onSortChange: (sort: string) => void
  onResetFilters: () => void
  onAddUser: () => void
  onBulkUpload: () => void
  onExportCSV: () => void
  onRefresh: () => void
}

export default function FiltersActionBar({
  onSearch,
  onRoleFilter,
  onStatusFilter,
  onSortChange,
  onResetFilters,
  onAddUser,
  onBulkUpload,
  onExportCSV,
  onRefresh
}: FiltersActionBarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    onSearch(value)
  }

  const handleResetFilters = () => {
    setSearchQuery("")
    onResetFilters()
  }

  return (
    <div className="bg-surface border !border-border rounded-lg p-6 mb-6">
      {/* Search Bar */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search users by name, email, or role..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 bg-background !border-border text-foreground placeholder-muted-foreground"
          />
        </div>
        <Button variant="outline" size="sm" className="border-border hover:bg-primary/5">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-4">
        <Select onValueChange={onRoleFilter}>
          <SelectTrigger className="w-40 bg-background !border-border">
            <SelectValue placeholder="User Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="member">Member</SelectItem>
            <SelectItem value="lawyer">Lawyer</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="pending">Pending Lawyer</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={onStatusFilter}>
          <SelectTrigger className="w-32 bg-background !border-border">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={onSortChange}>
          <SelectTrigger className="w-40 bg-background !border-border">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name (A-Z)</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="role">Role</SelectItem>
            <SelectItem value="date">Signup Date</SelectItem>
            <SelectItem value="last_login">Last Login</SelectItem>
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

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <Button 
          onClick={onAddUser}
          size="sm" 
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBulkUpload}
          className="border-border hover:bg-primary/5"
        >
          <Upload className="h-4 w-4 mr-2" />
          Bulk Upload
        </Button>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={onExportCSV}
          className="border-border hover:bg-primary/5"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          className="border-border hover:bg-primary/5"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    </div>
  )
}
