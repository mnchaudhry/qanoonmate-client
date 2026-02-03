"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardStats } from "@/store/types/admin.types"
import { BookOpen, FileText, Gavel, Scale, TrendingUp, UserCheck, Users } from "lucide-react"

export default function PlatformStatistics({ stats }: { stats: DashboardStats | null }) {
  const iconMap = {
    Users,
    UserCheck,
    Scale,
    FileText,
    BookOpen,
    Gavel
  }

  const statsData = [
    {
      title: "Total Users",
      value: stats?.users?.total.toLocaleString() ?? "...",
      icon: "Users",
      trend: stats?.users?.trend ?? "..."
    },
    {
      title: "Verified Users",
      value: stats?.users?.verified.toLocaleString() ?? "...",
      icon: "UserCheck",
      trend: "ID Verified"
    },
    {
      title: "Lawyers",
      value: stats?.lawyers?.total.toLocaleString() ?? "...",
      icon: "Scale",
      trend: stats?.lawyers?.trend ?? "..."
    },
    {
      title: "Consultations",
      value: stats?.consultations?.total.toLocaleString() ?? "...",
      icon: "FileText",
      trend: stats?.consultations?.trend ?? "..."
    },
    {
      title: "Legal Acts",
      value: stats?.knowledgeBase?.acts.toLocaleString() ?? "...",
      icon: "BookOpen",
      trend: "Active Acts"
    },
    {
      title: "Case Laws",
      value: stats?.knowledgeBase?.caseLaws.toLocaleString() ?? "...",
      icon: "Gavel",
      trend: "Indexed Cases"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {statsData.map((stat, index) => (
        <Card key={index} className="border-border hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            {(() => {
              const IconComponent = iconMap[stat.icon as keyof typeof iconMap];
              return <IconComponent className="h-5 w-5 text-muted-foreground" />;
            })()}
          </CardHeader>
          <CardContent>
            {stats ? (
              <>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-3 w-3 text-primary mr-1" />
                  <span className="text-xs text-primary">{stat.trend}</span>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-3 w-30" />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
