"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, Clock, Star, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Total Clients",
    value: "24",
    description: "Active clients",
    icon: Users,
    trend: "+3 this week",
    iconColor: "text-primary"
  },
  {
    title: "This Month's Earnings",
    value: "PKR 85,000",
    description: "Revenue earned",
    icon: DollarSign,
    trend: "+12% from last month",
    iconColor: "text-primary"
  },
  {
    title: "Pending Requests",
    value: "8",
    description: "Consultation requests",
    icon: Clock,
    trend: "5 new today",
    iconColor: "text-primary"
  },
  {
    title: "Avg. Rating",
    value: "4.8",
    description: "Client satisfaction",
    icon: Star,
    trend: "Based on 47 reviews",
    iconColor: "text-primary"
  }
]

export default function OverviewStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-border hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-primary mr-1" />
              <span className="text-xs text-primary">{stat.trend}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
