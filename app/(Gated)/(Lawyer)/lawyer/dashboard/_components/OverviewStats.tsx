"use client"

import { Users, DollarSign, Clock, Star, TrendingUp } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/store/store"
import { getDashboardStats } from "@/store/reducers/lawyerSlice"
import { useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { StatCardEnhanced } from "@/components/StatCard"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

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

  // Calculate earnings change percentage if lastMonthEarnings is available
  const calculateEarningsTrend = () => {
    if (dashboardStats.lastMonthEarnings && dashboardStats.lastMonthEarnings > 0) {
      const change = dashboardStats.monthlyEarnings - dashboardStats.lastMonthEarnings;
      const percentageChange = ((change / dashboardStats.lastMonthEarnings) * 100).toFixed(1);
      const prefix = change >= 0 ? '+' : '';
      return `${prefix}${percentageChange}% from last month`;
    }
    return dashboardStats.earningsChange || 'No previous data';
  };

  const stats = [
    {
      title: "Pending Requests",
      value: dashboardStats.pendingRequests?.toString() || '0',
      description: "Consultation requests",
      icon: Clock,
      trend: `${dashboardStats.newRequestsToday || 0} new today`,
      iconColor: "text-primary"
    },
    {
      title: "Total Clients",
      value: dashboardStats.totalClients?.toString() || '0',
      description: `${dashboardStats.activeClients || 0} active clients`,
      icon: Users,
      trend: `+${dashboardStats.newClientsThisWeek || 0} this week`,
      iconColor: "text-primary"
    },
    {
      title: "This Month's Earnings",
      value: `PKR ${(dashboardStats.monthlyEarnings || 0).toLocaleString()}`,
      description: "Revenue earned",
      icon: DollarSign,
      trend: calculateEarningsTrend(),
      iconColor: "text-primary"
    },
    {
      title: "Avg. Rating",
      value: (dashboardStats.averageRating || 0).toFixed(1),
      description: "Client satisfaction",
      icon: Star,
      trend: `Based on ${dashboardStats.totalReviews || 0} reviews`,
      iconColor: "text-primary"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <StatCardEnhanced
          key={stat.title}
          title={stat.title}
          value={stat.value}
          description={stat.description}
          trend={stat.trend}
          icon={stat.icon}
          trendIcon={TrendingUp}
          iconColor={stat.iconColor}
        />
      ))}
    </div>
  );
}
