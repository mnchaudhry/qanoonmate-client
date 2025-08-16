"use client"

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'

const DashboardHeader = () => {
  // This would typically come from user context/auth
  const userFirstname = "John" // Replace with actual user data
  
  return (
    <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
      <CardContent className="p-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {userFirstname}!
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s an overview of your legal activity.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default DashboardHeader
