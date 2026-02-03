"use client"

import { getAdminDashboardStats } from '@/store/api'
import { DashboardStats } from '@/store/types/admin.types'
import { useEffect, useState } from 'react'
import { PageHeader } from '../../_components/PageHeader'
import { AIInsights, CalendarLogsPanel, ModerationStatus, PlatformStatistics, QuickActions, RecentActivityFeed, UsageAnalytics } from './_components'

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    getAdminDashboardStats().then(res => {
      setStats(res.data.data!);
    }).catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-6">
      {/* Overview Header */}
      <PageHeader
        title="Platform Overview"
        description="Monitor platform performance, user activity, and system metrics at a glance."
      />

      {/* Platform Statistics */}
      <PlatformStatistics stats={stats} />

      {/* Quick Actions */}
      <QuickActions stats={stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Activity Feed */}
        <div className="lg:col-span-1">
          <RecentActivityFeed />
        </div>

        {/* Right Column - Moderation & Analytics */}
        <div className="lg:col-span-2 space-y-6">
          <ModerationStatus stats={stats} />
          <UsageAnalytics />
        </div>
      </div>

      {/* Calendar & Logs Panel */}
      <CalendarLogsPanel />

      {/* AI Insights */}
      <AIInsights />
    </div>
  )
}