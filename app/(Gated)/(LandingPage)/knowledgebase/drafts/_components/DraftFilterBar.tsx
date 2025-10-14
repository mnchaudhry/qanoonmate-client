'use client'

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import ViewToggle from '@/components/ViewToggle'

interface DraftFilterBarProps {
  search: string
  setSearch: (value: string) => void
  category: string
  setCategory: (value: string) => void
  format: string
  setFormat: (value: string) => void
  isFree: string
  setIsFree: (value: string) => void
  sort: string
  setSort: (value: string) => void
  view: 'grid' | 'list'
  setView: (value: 'grid' | 'list') => void
  onResetFilters: () => void
}

const categories = [
  'Business', 'Personal', 'Real Estate', 'Family', 'Finance', 'Employment', 'Insurance', 'Legal'
]

const DraftFilterBar: React.FC<DraftFilterBarProps> = ({
  search,
  setSearch,
  category,
  setCategory,
  format,
  setFormat,
  isFree,
  setIsFree,
  sort,
  setSort,
  view,
  setView,
  onResetFilters
}) => {
  const [searchValue, setSearchValue] = useState(search)

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchValue)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchValue, setSearch])

  const hasActiveFilters = category !== 'all' || format !== 'all' || isFree !== 'all' || search

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search drafts..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Formats</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="docx">DOCX</SelectItem>
              </SelectContent>
            </Select>

            <Select value={isFree} onValueChange={setIsFree}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Access" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Access</SelectItem>
                <SelectItem value="true">Free</SelectItem>
                <SelectItem value="false">Premium</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="alphabetical">A-Z</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ViewToggle view={view} onViewChange={setView} />

          {/* Reset Filters */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Reset
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-4">
            {search && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearch('')}>
                Search: {search} <X className="h-3 w-3 ml-1" />
              </Badge>
            )}
            {category !== 'all' && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setCategory('all')}>
                Category: {category} <X className="h-3 w-3 ml-1" />
              </Badge>
            )}
            {format !== 'all' && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setFormat('all')}>
                Format: {format.toUpperCase()} <X className="h-3 w-3 ml-1" />
              </Badge>
            )}
            {isFree !== 'all' && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setIsFree('all')}>
                Access: {isFree === 'true' ? 'Free' : 'Premium'} <X className="h-3 w-3 ml-1" />
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default DraftFilterBar