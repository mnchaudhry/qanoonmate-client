"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, Clock, Star, TrendingUp } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/store/store"
import { getDashboardStats } from "@/store/reducers/lawyerSlice"
import { useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function OverviewStats() {
  const dispatch = useAppDispatch();
  const { dashboardStats, statsLoading, statsError } = useAppSelector((state) => state.lawyer);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  if (statsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-5 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-32 mb-2" />
              <Skeleton className="h-3 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="col-span-full border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive text-center">
              Failed to load dashboard stats. Please try refreshing the page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!dashboardStats) {
    return null;
  }

  const stats = [
    {
      title: "Total Clients",
      value: dashboardStats.totalClients.toString(),
      description: `${dashboardStats.activeClients} active clients`,
      icon: Users,
      trend: `+${dashboardStats.newClientsThisWeek} this week`,
      iconColor: "text-primary"
    },
    {
      title: "This Month's Earnings",
      value: `PKR ${dashboardStats.monthlyEarnings.toLocaleString()}`,
      description: "Revenue earned",
      icon: DollarSign,
      trend: `${dashboardStats.earningsChange} from last month`,
      iconColor: "text-primary"
    },
    {
      title: "Pending Requests",
      value: dashboardStats.pendingRequests.toString(),
      description: "Consultation requests",
      icon: Clock,
      trend: `${dashboardStats.newRequestsToday} new today`,
      iconColor: "text-primary"
    },
    {
      title: "Avg. Rating",
      value: dashboardStats.averageRating.toFixed(1),
      description: "Client satisfaction",
      icon: Star,
      trend: `Based on ${dashboardStats.totalReviews} reviews`,
      iconColor: "text-primary"
    }
  ];

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
  );
}
