import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface ListSkeletonProps {
  items?: number
  withAvatar?: boolean
}

const ListSkeleton = ({ items = 5, withAvatar = false }: ListSkeletonProps) => {
  const arr = Array.from({ length: items })
  return (
    <div className="bg-card border border-border rounded-lg p-4 divide-y divide-border">
      {arr.map((_, i) => (
        <div key={i} className="py-3 flex items-center gap-3">
          {withAvatar && <Skeleton className="h-8 w-8 rounded-full" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      ))}
    </div>
  )
}

export default ListSkeleton


