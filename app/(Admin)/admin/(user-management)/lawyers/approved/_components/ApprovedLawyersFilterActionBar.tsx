'use client'
import { Search, Filter, Download, ChevronDown, RefreshCw, MoreVertical } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface ApprovedLawyersFilterActionBarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedJurisdiction: string
  onJurisdictionChange: (value: string) => void
  selectedPracticeArea: string
  onPracticeAreaChange: (value: string) => void
  sortBy: string
  onSortChange: (value: string) => void
  onResetFilters: () => void
  onExportCSV: () => void
  onRefresh: () => void
  onBulkAction: (action: string) => void
}

const ApprovedLawyersFilterActionBar: React.FC<ApprovedLawyersFilterActionBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedJurisdiction,
  onJurisdictionChange,
  selectedPracticeArea,
  onPracticeAreaChange,
  onSortChange,
  onResetFilters,
  onExportCSV,
  onRefresh,
  onBulkAction
}) => {

  const jurisdictions = [
    { value: 'all', label: 'All Jurisdictions' },
    { value: 'supreme-court', label: 'Supreme Court of Pakistan' },
    { value: 'lahore-hc', label: 'Lahore High Court' },
    { value: 'sindh-hc', label: 'Sindh High Court' },
    { value: 'peshawar-hc', label: 'Peshawar High Court' },
    { value: 'islamabad-hc', label: 'Islamabad High Court' },
    { value: 'balochistan-hc', label: 'Balochistan High Court' }
  ]

  const practiceAreas = [
    { value: 'all', label: 'All Practice Areas' },
    { value: 'criminal', label: 'Criminal Law' },
    { value: 'family', label: 'Family Law' },
    { value: 'corporate', label: 'Corporate Law' },
    { value: 'civil', label: 'Civil Law' },
    { value: 'constitutional', label: 'Constitutional Law' },
    { value: 'commercial', label: 'Commercial Law' },
    { value: 'immigration', label: 'Immigration Law' },
    { value: 'labor', label: 'Labor Law' },
    { value: 'tax', label: 'Tax Law' },
    { value: 'real-estate', label: 'Real Estate Law' }
  ]

  const sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'email', label: 'Email (A-Z)' },
    { value: 'email-desc', label: 'Email (Z-A)' },
    { value: 'jurisdiction', label: 'Jurisdiction' },
    { value: 'approved-date', label: 'Approved Date (Latest)' },
    { value: 'approved-date-desc', label: 'Approved Date (Oldest)' },
    { value: 'experience', label: 'Experience (Most)' },
    { value: 'experience-desc', label: 'Experience (Least)' }
  ]

  const bulkActions = [
    { value: 'suspend', label: 'Suspend Selected' },
    { value: 'export-selected', label: 'Export Selected' },
    { value: 'send-message', label: 'Send Message' },
    { value: 'reset-password', label: 'Reset Password' }
  ]

  return (
    <Card className="mb-6">
      <CardContent className="space-y-4 p-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <Input
              type="text"
              placeholder="Search Lawyer..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 !border-border rounded-md leading-5 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
        {/* Filters Row */}
        <div className="flex flex-wrap gap-4 items-center mb-6">
          {/* Jurisdiction Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="inline-flex items-center px-4 py-2">
                <Filter className="h-4 w-4 mr-2" />
                {jurisdictions.find(j => j.value === selectedJurisdiction)?.label || 'Jurisdiction'}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              {jurisdictions.map((jurisdiction) => (
                <DropdownMenuItem
                  key={jurisdiction.value}
                  onClick={() => onJurisdictionChange(jurisdiction.value)}
                >
                  {jurisdiction.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Practice Area Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="inline-flex items-center px-4 py-2">
                <Filter className="h-4 w-4 mr-2" />
                {practiceAreas.find(p => p.value === selectedPracticeArea)?.label || 'Practice Area'}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 max-h-64 overflow-y-auto">
              {practiceAreas.map((area) => (
                <DropdownMenuItem
                  key={area.value}
                  onClick={() => onPracticeAreaChange(area.value)}
                >
                  {area.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Sort By Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="inline-flex items-center px-4 py-2">
                Sort By
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onSortChange(option.value)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
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
            onClick={onExportCSV}
            className="inline-flex items-center px-4 py-2"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="inline-flex items-center px-4 py-2">
                <MoreVertical className="h-4 w-4 mr-2" />
                Bulk Actions
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {bulkActions.map((action) => (
                <DropdownMenuItem
                  key={action.value}
                  onClick={() => onBulkAction(action.value)}
                >
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            onClick={onRefresh}
            className="inline-flex items-center px-4 py-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ApprovedLawyersFilterActionBar
