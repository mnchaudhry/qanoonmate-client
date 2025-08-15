'use client'

import { X } from 'lucide-react'
import SearchBar from '@/components/SearchBar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

interface RejectedLawyersFilterActionBarProps {
  searchTerm: string
  onSearchChange: (query: string) => void
  selectedRejectionReason: string
  onRejectionReasonChange: (value: string) => void
  sortBy: string
  onSortChange: (value: string) => void
  onResetFilters: () => void
  onRefresh: () => void
}

const RejectedLawyersFilterActionBar: React.FC<RejectedLawyersFilterActionBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedRejectionReason,
  onRejectionReasonChange,
  sortBy,
  onSortChange,
  onResetFilters,
  onRefresh,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 mt-6">
      <SearchBar
        value={searchTerm}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
        containerClassName="mb-0 mx-0 w-1/3"
      />

      <div className="flex gap-2 items-center flex-wrap">
        <Select value={selectedRejectionReason} onValueChange={onRejectionReasonChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Rejection Reason" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reasons</SelectItem>
            <SelectItem value="failed-verification">Failed Verification</SelectItem>
            <SelectItem value="incomplete-documents">Incomplete Documents</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name (A-Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            <SelectItem value="email">Email (A-Z)</SelectItem>
            <SelectItem value="email-desc">Email (Z-A)</SelectItem>
            <SelectItem value="applied-date">Applied (Newest)</SelectItem>
            <SelectItem value="applied-date-desc">Applied (Oldest)</SelectItem>
            <SelectItem value="rejected-date">Rejected (Newest)</SelectItem>
            <SelectItem value="rejected-date-desc">Rejected (Oldest)</SelectItem>
            <SelectItem value="rejection-reason">Rejection Reason</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          className="border-border hover:bg-primary/5"
        >
          Refresh
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onResetFilters}
          className="border-border hover:bg-primary/5"
        >
          <X className="h-4 w-4 mr-2" />
          Reset Filters
        </Button>
      </div>
    </div>
  )
}

export default RejectedLawyersFilterActionBar
