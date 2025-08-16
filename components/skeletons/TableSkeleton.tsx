import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface TableSkeletonProps {
  columns?: number
  rows?: number
  showHeader?: boolean
  showPagination?: boolean
  withAvatar?: boolean
  withActions?: boolean
}

const TableSkeleton = ({
  columns = 5,
  rows = 10,
  showHeader = true,
  showPagination = true,
  withAvatar = false,
  withActions = true
}: TableSkeletonProps) => {
  const headerCols = Array.from({ length: columns })
  const rowArray = Array.from({ length: rows })

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {showHeader && (
        <div className="border-b border-border p-4">
          <div className={`grid grid-cols-${columns} gap-4`}>
            {headerCols.map((_, i) => (
              <div key={i} className="h-4">
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="divide-y divide-border">
        {rowArray.map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className={`grid grid-cols-${columns} gap-4 items-center`}>
              {headerCols.map((__, colIndex) => (
                <div key={colIndex} className="flex items-center gap-3">
                  {withAvatar && colIndex === 0 ? (
                    <>
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </>
                  ) : withActions && colIndex === columns - 1 ? (
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded" />
                      <Skeleton className="h-8 w-8 rounded" />
                    </div>
                  ) : (
                    <Skeleton className="h-4 w-20" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showPagination && (
        <div className="border-t border-border p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TableSkeleton


