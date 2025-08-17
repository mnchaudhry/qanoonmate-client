"use client"

import { ChangeEvent, useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import SearchBar from "@/components/SearchBar"
import { AccountStatus, ReleaseChannel, UserRole } from "@/lib/enums"
import { enumToLabel } from "@/lib/utils"

interface FiltersActionBarProps {
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

export default function FiltersActionBar({ onSearch, onRoleFilter, onStatusFilter, onReleaseChannelFilter, onSortChange, onResetFilters, searchValue, roleValue, statusValue, releaseChannelValue, sortValue }: FiltersActionBarProps) {

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
    <div className="mb-6 flex justify-between items-center">

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChange={handleSearchChange}
        containerClassName="mb-0 mx-0 w-1/3"
        className="w-full "
      />

      {/* Filters */}
      <div className="flex items-center gap-4">
        {(searchQuery || roleValue || statusValue || releaseChannelValue || sortValue) && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetFilters}
            className="border-border hover:bg-primary/5"
          >
            <X className="h-4 w-4 mr-2" />
            Reset Filters
          </Button>
        )}

        <Select onValueChange={onRoleFilter} value={roleValue || undefined}>
          <SelectTrigger className="w-40 bg-background !border-border">
            <SelectValue placeholder="User Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {
              Object.values(UserRole).map((role) => (
                <SelectItem key={role} value={role}>{enumToLabel(role)}</SelectItem>
              ))
            }
          </SelectContent>
        </Select>

        <Select onValueChange={onStatusFilter} value={statusValue || undefined}>
          <SelectTrigger className="w-32 bg-background !border-border">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {
              Object.values(AccountStatus).map((status) => (
                <SelectItem key={status} value={status}>{enumToLabel(status)}</SelectItem>
              ))
            }
          </SelectContent>
        </Select>

        <Select onValueChange={onReleaseChannelFilter} value={releaseChannelValue || undefined}>
          <SelectTrigger className="w-40 bg-background !border-border">
            <SelectValue placeholder="Release Channel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Release Channels</SelectItem>
            {
              Object.values(ReleaseChannel).map((releaseChannel) => (
                <SelectItem key={releaseChannel} value={releaseChannel}>{enumToLabel(releaseChannel)}</SelectItem>
              ))
            }
          </SelectContent>
        </Select>

        <Select onValueChange={onSortChange} value={sortValue || undefined}>
          <SelectTrigger className="w-40 bg-background !border-border">
            <SelectValue placeholder="Sort By" />
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
