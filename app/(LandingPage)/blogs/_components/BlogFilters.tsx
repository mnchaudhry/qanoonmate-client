'use client'

import React from 'react'
import { ChevronDown } from 'lucide-react'

const categories = [
  'all',
  'Employment Law',
  'Startup Law',
  'Personal Law',
  'Real Estate',
  'Freelance',
  'Business Law',
  'Tech Law',
  'Estate Planning',
  'Creative Rights',
  'Legal Tech',
  'Workplace Law',
  'Nonprofit',
  'Contract Law',
  'AI & Law',
  'Employee Law',
  'Legal Basics',
  'Internet Law',
  'Business Tools'
]

const sortOptions = ['Newest', 'Oldest', 'Most Popular', 'Most Liked']

interface BlogFiltersProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  selectedSort?: string
  onSortChange?: (sort: string) => void
}

const BlogFilters = ({ 
  selectedCategory, 
  onCategoryChange, 
  selectedSort = 'Newest',
  onSortChange 
}: BlogFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm text-muted-foreground mt-4 mb-6">
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-1.5 rounded-full border text-sm transition ${
              selectedCategory === category
                ? 'bg-green-600 text-white border-green-600'
                : 'border-gray-300 hover:bg-gray-100 hover:border-gray-400'
            }`}
          >
            {category === 'all' ? 'All Categories' : category}
          </button>
        ))}
      </div>

      {/* Sort Dropdown */}
      {onSortChange && (
        <div className="relative">
          <select
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="pl-3 pr-8 py-1.5 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 bg-white appearance-none"
          >
            {sortOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      )}
    </div>
  )
}

export default BlogFilters
