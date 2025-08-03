'use client'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface PendingLawyersFilterActionBarProps {
  onSearch: (query: string) => void
  onJurisdictionFilter: (jurisdiction: string) => void
  onDateFilter: (dateRange: string) => void
  onSortChange: (sort: string) => void
  onResetFilters: () => void
  onExportList: () => void
  onRefresh: () => void
}

const PendingLawyersFilterActionBar: React.FC<PendingLawyersFilterActionBarProps> = ({ onSearch, onResetFilters, onExportList, onRefresh }) => {

  const [searchTerm, setSearchTerm] = useState('')

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value)
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
              className="w-full pl-10 pr-4 py-2 border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
        {/* Filters Row */}
        <div className="flex flex-wrap gap-4 items-center mb-6">
          {/* Jurisdiction Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="inline-flex items-center px-4 py-2">
                Jurisdiction
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              {/* Map jurisdiction options here */}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Date Range Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="inline-flex items-center px-4 py-2">
                Date Range
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              {/* Map date range options here */}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Sort By Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="inline-flex items-center px-4 py-2">
                Sort By
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {/* Map sort options here */}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Reset Filters Button */}
          <Button
            variant="outline"
            onClick={onResetFilters}
            className="inline-flex items-center px-4 py-2"
          >
            Reset Filters
          </Button>
        </div>
        {/* Action Buttons Row */}
        <div className="flex flex-wrap gap-4 items-center">
          <Button
            variant="outline"
            onClick={onExportList}
            className="inline-flex items-center px-4 py-2"
          >
            Export List
          </Button>
          <Button
            variant="outline"
            onClick={onRefresh}
            className="inline-flex items-center px-4 py-2"
          >
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default PendingLawyersFilterActionBar
