"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getAnalyticsPlatformUsage, getAnalyticsSearchTrends } from "@/store/api"
import { ChevronRight, Search } from "lucide-react"
import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function UsageAnalytics() {
  const [usageData, setUsageData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [topSearch, setTopSearch] = useState<string>("...");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usageRes, searchRes] = await Promise.all([
          getAnalyticsPlatformUsage({}),
          getAnalyticsSearchTrends({})
        ]);

        const types = usageRes.data.data.byType || [];
        setUsageData(types.map((t: any) => ({ name: t.type.replace('_', ' '), count: t.count })));

        const searches = searchRes.data.data.topSearches || [];
        if (searches.length > 0) {
          setTopSearch(`${searches[0].term} (${searches[0].count})`);
        } else {
          setTopSearch("No data");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const metrics = [
    {
      title: "Top Searched Term",
      value: topSearch,
      icon: Search,
      color: "text-primary"
    },
    // Keep other mocks for now or remove if irrelevant
  ]

  return (
    <Card className="border-border mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">
            System Usage
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5">
            View Details
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Chart Area */}
        <div className="h-64 bg-surface rounded-lg border border-border p-4 mb-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Skeleton className="h-full w-full" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
                <Bar dataKey="count" fill="currentColor" className="fill-primary" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-surface rounded-lg">
              <div className={`w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center`}>
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
              </div>
              <div>
                <h4 className="font-medium text-foreground text-sm">{metric.title}</h4>
                <p className="text-lg font-bold text-foreground">{metric.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
