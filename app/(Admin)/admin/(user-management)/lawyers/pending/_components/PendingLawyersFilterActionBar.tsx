'use client'
import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SearchBar from '@/components/SearchBar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface PendingLawyersFilterActionBarProps {
  onSearch: (query: string) => void
  onResetFilters: () => void
}

const PendingLawyersFilterActionBar: React.FC<PendingLawyersFilterActionBarProps> = ({ onSearch, onResetFilters }) => {

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPracticeArea, setSelectedPracticeArea] = useState('all')
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [sortBy, setSortBy] = useState('latest')

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value)
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 mt-6">
    
      <SearchBar
        value={searchTerm}
        onChange={handleSearchChange}
        containerClassName="mb-0 mx-0 w-1/3"
      />

      <div className="flex gap-2 items-center flex-wrap">
        <Select value={selectedPracticeArea} onValueChange={setSelectedPracticeArea}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Specialization" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specializations</SelectItem>
            <SelectItem value="Criminal Law">Criminal Law</SelectItem>
            <SelectItem value="Civil Law">Civil Law</SelectItem>
            <SelectItem value="Family Law">Family Law</SelectItem>
            <SelectItem value="Corporate Law">Corporate Law</SelectItem>
            <SelectItem value="Property Law">Property Law</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedJurisdiction} onValueChange={setSelectedJurisdiction}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Verification" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="unverified">Unverified</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
            <SelectItem value="experience">Experience</SelectItem>
            <SelectItem value="fee">Fee (Low to High)</SelectItem>
          </SelectContent>
        </Select>

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

export default PendingLawyersFilterActionBar
