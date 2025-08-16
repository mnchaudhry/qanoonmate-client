import { PageHeader } from '@/app/(Gated)/(Admin)/_components/PageHeader'
import React from 'react'

const AdminChats = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Chats"
        description="View and manage chats between users and lawyers."
      />
    </div>
  )
}

export default AdminChats