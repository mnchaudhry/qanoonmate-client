"use client"

import { useState, ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AccountStatus, ReleaseChannel, UserRole } from "@/lib/enums"
import { enumToLabel } from "@/lib/utils"
import SearchBar from "@/components/SearchBar"

interface NotificationFiltersProps {
  onSearch: (query: string) => void
  onRoleFilter: (role: string) => void
  onStatusFilter: (status: string) => void
  onReleaseChannelFilter: (releaseChannel: string) => void
  onSortChange: (sort: string) => void
  onResetFilters: () => void
  searchValue?: string
  roleValue?: string
  statusValue?: string
  releaseChannelValue?: string
  sortValue?: string
}

export default function NotificationFilters({ onSearch, onRoleFilter, onStatusFilter, onReleaseChannelFilter, onSortChange, onResetFilters, searchValue, roleValue, statusValue, releaseChannelValue, sortValue }: NotificationFiltersProps) {

  ////////////////////////////////////////////////////////// STATES /////////////////////////////////////////////////////////////
  const [searchQuery, setSearchQuery] = useState(searchValue || "")

  if (typeof searchValue === 'string' && searchValue !== searchQuery) {
    setSearchQuery(searchValue)
  }

  ////////////////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////////////////

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    onSearch(e.target.value)
  }

  const handleResetFilters = () => {
    setSearchQuery("")
    onResetFilters()
  }

  ////////////////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////////////
  return (
    <div className="flex justify-between items-center gap-4">
      <SearchBar
        value={searchQuery}
        onChange={handleSearchChange}
        onBlur={handleResetFilters}
        placeholder="Name, email, username..."
        containerClassName="mx-0 mb-0 w-1/3"
      />

      <div className="flex gap-4">
        <Button variant="outline" size="sm" onClick={handleResetFilters} className="border-border">Reset</Button>
        <Select onValueChange={onRoleFilter} value={roleValue || undefined}>
          <SelectTrigger className="bg-background !border-border">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {Object.values(UserRole).map((role) => (
              <SelectItem key={role} value={role}>{enumToLabel(role)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={onStatusFilter} value={statusValue || undefined}>
          <SelectTrigger className="bg-background !border-border">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {Object.values(AccountStatus).map((status) => (
              <SelectItem key={status} value={status}>{enumToLabel(status)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={onReleaseChannelFilter} value={releaseChannelValue || undefined}>
          <SelectTrigger className="bg-background !border-border">
            <SelectValue placeholder="All Release Channels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Release Channels</SelectItem>
            {Object.values(ReleaseChannel).map((releaseChannel) => (
              <SelectItem key={releaseChannel} value={releaseChannel}>{enumToLabel(releaseChannel)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={onSortChange} value={sortValue || undefined}>
          <SelectTrigger className="bg-background !border-border">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="firstname">Name (A-Z)</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="role">Role</SelectItem>
            <SelectItem value="createdAt">Signup Date</SelectItem>
            <SelectItem value="updatedAt">Last Login</SelectItem>
          </SelectContent>
        </Select>
      </div>

    </div>
  )
}


