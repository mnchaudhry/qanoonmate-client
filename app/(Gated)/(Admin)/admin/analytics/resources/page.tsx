"use client";
import { PageHeader } from '@/app/(Gated)/(Admin)/_components/PageHeader';
import React, { useEffect, useState } from 'react';
import { APIClient } from '@/store/api/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const MostViewedResourcesAnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ topPages: { pagePath: string; count: number }[] } | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await APIClient.get('/analytics/resources');
        setData(res.data?.data);
      } catch (e) {
        // noop
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Most Viewed Resources Analytics" description="View the most viewed resources on the platform." />
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Top Pages</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton height={240} />
          ) : (
            <div className="space-y-3">
              {data?.topPages?.map((p) => (
                <div key={p.pagePath} className="flex items-center justify-between border-b border-border pb-2">
                  <div className="text-foreground text-sm">{p.pagePath}</div>
                  <div className="text-muted-foreground text-sm">{p.count}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default MostViewedResourcesAnalyticsPage; 