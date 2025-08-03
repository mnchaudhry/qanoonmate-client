"use client"

import {
  OverviewHeader,
  PlatformStatistics,
  QuickActions,
  RecentActivityFeed,
  ModerationStatus,
  UsageAnalytics,
  CalendarLogsPanel,
  AIInsights
} from './_components'

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Overview Header */}
      <OverviewHeader />

      {/* Platform Statistics */}
      <PlatformStatistics />

      {/* Quick Actions */}
      <QuickActions />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Activity Feed */}
        <div className="lg:col-span-1">
          <RecentActivityFeed />
        </div>

        {/* Right Column - Moderation & Analytics */}
        <div className="lg:col-span-2 space-y-6">
          <ModerationStatus />
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