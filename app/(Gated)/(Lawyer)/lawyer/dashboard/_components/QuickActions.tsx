"use client"

import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Calendar, FileText, Users, DollarSign, Settings } from "lucide-react"

const quickActions = [
  {
    title: "Messages",
    description: "3 unread",
    icon: MessageSquare,
    iconColor: "text-primary",
    bgColor: "bg-primary/10",
    href: "/lawyer/messages"
  },
  {
    title: "Schedule",
    description: "Today: 3 meetings",
    icon: Calendar,
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
    href: "/lawyer/calendar"
  },
  {
    title: "Templates",
    description: "12 available",
    icon: FileText,
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50",
    href: "/lawyer/uploads"
  },
  {
    title: "Clients",
    description: "24 active",
    icon: Users,
    iconColor: "text-amber-600",
    bgColor: "bg-amber-50",
    href: "/lawyer/clients"
  },
  {
    title: "Earnings",
    description: "This month: PKR 85K",
    icon: DollarSign,
    iconColor: "text-green-600",
    bgColor: "bg-green-50",
    href: "/lawyer/earnings"
  },
  {
    title: "Settings",
    description: "Profile & preferences",
    icon: Settings,
    iconColor: "text-gray-600",
    bgColor: "bg-gray-50",
    href: "/lawyer/settings"
  }
]

export default function QuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {quickActions.map((action) => (
        <Card key={action.title} className="border-border hover:shadow-md transition-shadow cursor-pointer group">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${action.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <action.icon className={`h-5 w-5 ${action.iconColor}`} />
              </div>
              <div>
                <h4 className="font-medium text-foreground">{action.title}</h4>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
