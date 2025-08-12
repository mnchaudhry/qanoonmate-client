'use client'
import { useState } from 'react'
import { Search, ChevronDown, RefreshCw } from 'lucide-react'

interface RejectedLawyersFilterActionBarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
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
  onSortChange,
  onResetFilters,
  onRefresh
}) => {
  const [showRejectionReasonDropdown, setShowRejectionReasonDropdown] = useState(false)
  const [showSortDropdown, setShowSortDropdown] = useState(false)

  const rejectionReasons = [
    { value: 'all', label: 'All Rejection Reasons' },
    { value: 'incomplete-credentials', label: 'Incomplete Credentials' },
    { value: 'invalid-documents', label: 'Invalid Documents' },
    { value: 'suspended-license', label: 'Suspended License' },
    { value: 'fraudulent-application', label: 'Fraudulent Application' },
    { value: 'duplicate-application', label: 'Duplicate Application' },
    { value: 'insufficient-experience', label: 'Insufficient Experience' },
    { value: 'failed-verification', label: 'Failed Verification' },
    { value: 'other', label: 'Other' }
  ]

  const sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'email', label: 'Email (A-Z)' },
    { value: 'email-desc', label: 'Email (Z-A)' },
    { value: 'applied-date', label: 'Applied Date (Latest)' },
    { value: 'applied-date-desc', label: 'Applied Date (Oldest)' },
    { value: 'rejected-date', label: 'Rejected Date (Latest)' },
    { value: 'rejected-date-desc', label: 'Rejected Date (Oldest)' },
    { value: 'rejection-reason', label: 'Rejection Reason' }
  ]

  return (
    <div className="bg-surface border !border-border rounded-lg p-6 mb-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border !border-border rounded-md leading-5 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
        {/* Rejection Reason Filter */}
        <div className="relative">
          <button
            onClick={() => setShowRejectionReasonDropdown(!showRejectionReasonDropdown)}
            className="inline-flex items-center px-4 py-2 border !border-border rounded-md bg-background text-foreground hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {rejectionReasons.find(r => r.value === selectedRejectionReason)?.label || 'Rejection Reason'}
            <ChevronDown className="h-4 w-4 ml-2" />
          </button>
          {showRejectionReasonDropdown && (
            <div className="absolute z-10 mt-1 w-64 bg-background border !border-border rounded-md shadow-lg">
              {rejectionReasons.map((reason) => (
                <button
                  key={reason.value}
                  onClick={() => {
                    onRejectionReasonChange(reason.value)
                    setShowRejectionReasonDropdown(false)
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted/50 first:rounded-t-md last:rounded-b-md"
                >
                  {reason.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort By Filter */}
        <div className="relative">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="inline-flex items-center px-4 py-2 border !border-border rounded-md bg-background text-foreground hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            Sort By
            <ChevronDown className="h-4 w-4 ml-2" />
          </button>
          {showSortDropdown && (
            <div className="absolute z-10 mt-1 w-56 bg-background border !border-border rounded-md shadow-lg">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onSortChange(option.value)
                    setShowSortDropdown(false)
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted/50 first:rounded-t-md last:rounded-b-md"
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reset Filters Button */}
        <button
          onClick={onResetFilters}
          className="inline-flex items-center px-4 py-2 border !border-border rounded-md bg-background text-foreground hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          Reset Filters
        </button>
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          className="inline-flex items-center px-4 py-2 border !border-border rounded-md bg-background text-foreground hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>
    </div>
  )
}

export default RejectedLawyersFilterActionBar
