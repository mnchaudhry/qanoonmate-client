import React from 'react'

interface AdminSkeletonProps {
  showFilters?: boolean
  showTable?: boolean
  showStats?: boolean
  showChart?: boolean
  tableRows?: number
  statsCount?: number
}

const AdminSkeleton = ({ 
  showFilters = true, 
  showTable = true, 
  showStats = false,
  showChart = false,
  tableRows = 5,
  statsCount = 4 
}: AdminSkeletonProps) => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page Header Skeleton */}
      <div className="mb-6">
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div>
              <div className="h-8 bg-muted rounded-md w-64 mb-2"></div>
              <div className="h-4 bg-muted rounded-md w-96"></div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 bg-muted rounded-md w-24"></div>
            <div className="h-10 bg-muted rounded-md w-24"></div>
          </div>
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      {showStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: statsCount }).map((_, index) => (
            <div key={index} className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-20"></div>
                  <div className="h-8 bg-muted rounded w-16"></div>
                </div>
                <div className="h-8 w-8 bg-muted rounded"></div>
              </div>
              <div className="mt-4">
                <div className="h-3 bg-muted rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chart Skeleton */}
      {showChart && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="h-6 bg-muted rounded w-32 mb-4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      )}

      {/* Filters and Actions Skeleton */}
      {showFilters && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 max-w-md">
                <div className="h-10 bg-muted rounded-lg"></div>
              </div>
              <div className="h-10 w-10 bg-muted rounded-lg"></div>
            </div>

            {/* Filter Options */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <div className="h-4 bg-muted rounded w-16"></div>
                <div className="h-10 bg-muted rounded w-32"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-4 bg-muted rounded w-12"></div>
                <div className="h-10 bg-muted rounded w-28"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-4 bg-muted rounded w-16"></div>
                <div className="h-10 bg-muted rounded w-32"></div>
              </div>
              <div className="h-10 bg-muted rounded w-24"></div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="h-10 bg-muted rounded w-24"></div>
              <div className="h-10 bg-muted rounded w-28"></div>
              <div className="h-10 bg-muted rounded w-20"></div>
            </div>
          </div>
        </div>
      )}

      {/* Table Skeleton */}
      {showTable && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="border-b border-border p-4">
            <div className="grid grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-4 bg-muted rounded"></div>
              ))}
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-border">
            {Array.from({ length: tableRows }).map((_, rowIndex) => (
              <div key={rowIndex} className="p-4">
                <div className="grid grid-cols-5 gap-4 items-center">
                  {Array.from({ length: 5 }).map((_, colIndex) => (
                    <div key={colIndex}>
                      {colIndex === 0 ? (
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-muted rounded-full"></div>
                          <div className="h-4 bg-muted rounded w-24"></div>
                        </div>
                      ) : colIndex === 4 ? (
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 bg-muted rounded"></div>
                          <div className="h-8 w-8 bg-muted rounded"></div>
                        </div>
                      ) : (
                        <div className="h-4 bg-muted rounded w-20"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="border-t border-border p-4">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-muted rounded w-32"></div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-muted rounded"></div>
                <div className="h-8 w-8 bg-muted rounded"></div>
                <div className="h-8 w-8 bg-muted rounded"></div>
                <div className="h-8 w-8 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="h-5 bg-muted rounded w-32 mb-4"></div>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-muted rounded-full"></div>
                  <div className="h-4 bg-muted rounded flex-1"></div>
                  <div className="h-4 bg-muted rounded w-12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Columns */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="h-5 bg-muted rounded w-40 mb-4"></div>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="p-4 bg-muted/20 rounded-lg">
                  <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                  <div className="h-6 bg-muted rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSkeleton