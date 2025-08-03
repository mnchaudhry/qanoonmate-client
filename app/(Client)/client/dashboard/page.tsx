"use client"

import React from 'react'
import DashboardHeader from './_components/DashboardHeader'
import UpcomingConsultations from './_components/UpcomingConsultations'
import RecentMessages from './_components/RecentMessages'
import QuickActions from './_components/QuickActions'
import LegalGuides from './_components/LegalGuides'
import ConsultationStats from './_components/ConsultationStats'
import Notifications from './_components/Notifications'

const DashboardPage = () => {
  return (
    <div className="space-y-6 pt-2 ">
      {/* Dashboard Header */}
      <DashboardHeader />
      
      {/* Top Row: Upcoming Consultations, Recent Messages, Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <UpcomingConsultations />
        </div>
        <div className="lg:col-span-1">
          <RecentMessages />
        </div>
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>
      
      {/* Legal Guides & Tools */}
      <LegalGuides />
      
      {/* Consultation Stats */}
      <ConsultationStats />
      
      {/* Notifications */}
      <Notifications />
    </div>
  )
}

export default DashboardPage
