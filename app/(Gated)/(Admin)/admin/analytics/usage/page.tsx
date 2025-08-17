"use client";
import { PageHeader } from '@/app/(Gated)/(Admin)/_components/PageHeader';
import React, { useEffect, useState } from 'react';
import { APIClient } from '@/store/api/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const PlatformUsageAnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ byType: { type: string; count: number }[]; byRoute: { routePath: string; count: number; avgLatency: number; errors: number }[] } | null>(null);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const res = await APIClient.get('/analytics/usage');
        setData(res.data?.data);
      } catch (e) {
        console.log(e)
        // noop
      } finally {
        setLoading(false);
      }
    };
    fetchUsage();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Platform Usage Analytics" description="View the usage analytics of the platform." />

      <div className="grid md:grid-cols-3 gap-4">
        {loading ? (
          <Skeleton className="col-span-3" />
        ) : (
          data && data.byType.map((m) => (
            <Card key={m.type} className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground text-base">{m.type}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{m.count}</div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Top API Routes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton />
          ) : (
            <div className="space-y-3">
              {data?.byRoute?.map((r) => (
                <div key={r.routePath} className="flex items-center justify-between border-b border-border pb-2">
                  <div className="text-foreground text-sm">{r.routePath}</div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-foreground">{r.count} calls</span>
                    <span className="text-muted-foreground">avg {Math.round(r.avgLatency)} ms</span>
                    <span className="text-muted-foreground">{r.errors} errors</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default PlatformUsageAnalyticsPage; 