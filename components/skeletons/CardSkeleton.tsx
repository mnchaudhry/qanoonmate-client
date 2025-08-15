import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface CardSkeletonProps {
  count?: number
  withIcon?: boolean
  lines?: number
}

const CardSkeleton = ({ count = 1, withIcon = true, lines = 3 }: CardSkeletonProps) => {
  const cards = Array.from({ length: count })
  const textLines = Array.from({ length: lines })
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${Math.min(count, 3)} gap-6`}>
      {cards.map((_, idx) => (
        <div key={idx} className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
            {withIcon && <Skeleton className="h-8 w-8 rounded" />}
          </div>
          <div className="mt-4 space-y-2">
            {textLines.map((__, i) => (
              <Skeleton key={i} className="h-3 w-28" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default CardSkeleton


