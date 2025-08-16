import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface FormSkeletonProps {
  fields?: number
  withActions?: boolean
}

const FormSkeleton = ({ fields = 4, withActions = true }: FormSkeletonProps) => {
  const arr = Array.from({ length: fields })
  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      {arr.map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      {withActions && (
        <div className="flex items-center gap-3 pt-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      )}
    </div>
  )
}

export default FormSkeleton


