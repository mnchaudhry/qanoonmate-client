"use client"

import { useState, ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import SearchBar from "@/components/SearchBar"

interface FiltersActionBarProps {
  onSearch: (query: string) => void
  onStatusFilter: (status: string) => void
  onSortByChange: (sortBy: string) => void
  onSortOrderChange: (order: 'asc' | 'desc') => void
  onResetFilters: () => void
  searchValue?: string
  statusValue?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export default function WaitlistFilters({ onSearch, onStatusFilter, onSortByChange, onSortOrderChange, onResetFilters, searchValue, statusValue, sortBy, sortOrder }: FiltersActionBarProps) {

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
        placeholder="Name or email..."
        containerClassName="mx-0 mb-0 w-1/3"
      />

      <div className="flex gap-3 items-center">
        <Button variant="outline" size="sm" onClick={handleResetFilters} className="border-border">Reset</Button>

        <Select onValueChange={onStatusFilter} value={statusValue || undefined}>
          <SelectTrigger className="bg-background !border-border min-w-[160px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="invited">Invited</SelectItem>
            <SelectItem value="joined">Joined</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={onSortByChange} value={sortBy || undefined}>
          <SelectTrigger className="bg-background !border-border min-w-[160px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Created</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="email">Email</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(v) => onSortOrderChange(v as 'asc' | 'desc')} value={sortOrder || undefined}>
          <SelectTrigger className="bg-background !border-border min-w-[120px]">
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Desc</SelectItem>
            <SelectItem value="asc">Asc</SelectItem>
          </SelectContent>
        </Select>
      </div>

    </div>
  )
}
