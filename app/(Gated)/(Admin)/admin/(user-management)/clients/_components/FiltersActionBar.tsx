"use client"

import { ChangeEvent, useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import SearchBar from "@/components/SearchBar"
import { AccountStatus, LawCategory, PakistanProvinces } from "@/lib/enums"
import { enumToLabel } from "@/lib/utils"

interface FiltersActionBarProps {
  onSearch: (query: string) => void
  onStatusFilter: (status: string) => void
  onSpecializationFilter: (spec: string) => void
  onLocationFilter: (province: string, city: string) => void
  onSortChange: (sort: string) => void
  onResetFilters: () => void
  searchValue?: string
  statusValue?: string
  specializationValue?: string
  provinceValue?: string
  cityValue?: string
  sortValue?: string
}

export default function FiltersActionBar({ onSearch, onStatusFilter, onSpecializationFilter, onLocationFilter, onSortChange, onResetFilters, searchValue, statusValue, specializationValue, provinceValue, cityValue, sortValue }: FiltersActionBarProps) {

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
      <div className="flex items-center gap-4 flex-wrap">
        {(searchQuery || statusValue || sortValue) && (
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

        <Select onValueChange={onSpecializationFilter} value={specializationValue || undefined}>
          <SelectTrigger className="w-48 bg-background !border-border">
            <SelectValue placeholder="Specialization" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {
              Object.values(LawCategory).map((category) => (
                <SelectItem key={category} value={category}>{enumToLabel(category)}</SelectItem>
              ))
            }
          </SelectContent>
        </Select>

        <Select onValueChange={(v) => onLocationFilter(v || '', cityValue || '')} value={provinceValue || undefined}>
          <SelectTrigger className="w-40 bg-background !border-border">
            <SelectValue placeholder="Province" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {
              Object.values(PakistanProvinces).map((province) => (
                <SelectItem key={province} value={province}>{enumToLabel(province)}</SelectItem>
              ))
            }
          </SelectContent>
        </Select>

        {/* <Select onValueChange={(v) => onLocationFilter(provinceValue || '', v || '')} value={cityValue || undefined}>
          <SelectTrigger className="w-40 bg-background !border-border">
            <SelectValue placeholder="City" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {
              Object.values(LawyerCity).map((city) => (
                <SelectItem key={city} value={city}>{enumToLabel(city)}</SelectItem>
              ))
            }
          </SelectContent>
        </Select> */}

        <Select onValueChange={onSortChange} value={sortValue || undefined}>
          <SelectTrigger className="w-40 bg-background !border-border">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="firstname">Name (A-Z)</SelectItem>
            <SelectItem value="experience">Experience</SelectItem>
            <SelectItem value="createdAt">Join Date</SelectItem>
            <SelectItem value="updatedAt">Updated</SelectItem>
          </SelectContent>
        </Select>
      </div>

    </div>
  )
}
