"use client"

import DashboardHeader from './_components/DashboardHeader'
import OverviewStats from './_components/OverviewStats'
import ConsultationRequests from './_components/ConsultationRequests'
import CalendarSchedule from './_components/CalendarSchedule'
import PendingActions from './_components/PendingActions'
import ActivityLog from './_components/ActivityLog'
import ClientFeedback from './_components/ClientFeedback'
import QuickActions from './_components/QuickActions'
import ProfileProgress from './_components/ProfileProgress'

export default function LawyerDashboard() {

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <DashboardHeader />

      {/* Overview Stats */}
      <OverviewStats />

      {/* Main Content Grid */}
      <div className="flex flex-col gap-6">
        {/* Top Row - Profile Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-4 items-start gap-6 w-full">
          <div className="lg:col-span-3 h-[535px] overflow-y-auto ">
            <ConsultationRequests />
          </div>
          <div className="lg:col-span-1 h-[35rem] overflow-y-auto">
            <ProfileProgress />
          </div>
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-6 w-full">
          <PendingActions />
          <ClientFeedback />
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-6 w-full">
          <CalendarSchedule />
          <ActivityLog />
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  )
}
