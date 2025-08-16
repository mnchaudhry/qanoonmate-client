import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface SectionHeaderSkeletonProps {
  withActions?: boolean
}

const SectionHeaderSkeleton = ({ withActions = true }: SectionHeaderSkeletonProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>
      {withActions && (
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      )}
    </div>
  )}

export default SectionHeaderSkeleton


