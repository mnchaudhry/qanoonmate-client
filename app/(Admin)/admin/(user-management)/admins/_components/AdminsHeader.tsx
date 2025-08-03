'use client'

import { Card, CardHeader } from '@/components/ui/card'

const AdminsHeader = () => {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between p-6 pb-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Admins Management
          </h1>
          <p className="text-muted-foreground mt-1">
            View, add, or manage internal platform administrators and their privileges.
          </p>
        </div>
        <div className="text-muted-foreground">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </CardHeader>
    </Card>
  )
}

export default AdminsHeader
