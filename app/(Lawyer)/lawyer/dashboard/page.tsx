"use client"

import DashboardHeader from './_components/DashboardHeader'
import OverviewStats from './_components/OverviewStats'
import ConsultationRequests from './_components/ConsultationRequests'
import CalendarSchedule from './_components/CalendarSchedule'
import PendingActions from './_components/PendingActions'
import ActivityLog from './_components/ActivityLog'
import ClientFeedback from './_components/ClientFeedback'
import QuickActions from './_components/QuickActions'

export default function LawyerDashboard() {
  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <DashboardHeader />

      {/* Overview Stats */}
      <OverviewStats />

      {/* Main Content Grid */}
      <div className="flex flex-col gap-6">
        {/* Left Column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-6 w-full">
          <ConsultationRequests />
          <PendingActions />
        </div>

        {/* Right Column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 items-start gap-6 w-full">
          <ClientFeedback />
          <CalendarSchedule />
          <ActivityLog />
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  )
}
