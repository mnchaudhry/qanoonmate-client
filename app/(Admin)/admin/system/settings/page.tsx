'use client'

import AdminSkeleton from '@/app/(Admin)/_components/AdminSkeleton';
import { PageHeader } from '@/app/(Admin)/_components/PageHeader';
import React, { useState, useEffect } from 'react';

const PlatformSettingsPage = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <AdminSkeleton showTable={false} showChart={true} />
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        title="Platform Settings"
        description="View and manage platform settings."
      />
      
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Configuration Panel</h2>
        <p className="text-muted-foreground">Platform settings will be implemented here.</p>
      </div>
    </div>
  )
};

export default PlatformSettingsPage; 