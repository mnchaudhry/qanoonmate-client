"use client";
import { PageHeader } from '@/app/(Gated)/(Admin)/_components/PageHeader';
import React, { useEffect, useState } from 'react';
import { APIClient } from '@/store/api/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const SearchTrendsAnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ topSearches: { term: string; count: number }[] } | null>(null);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const res = await APIClient.get('/analytics/search-trends');
        setData(res.data?.data);
      } catch (e) {
        console.log(e)
        // noop
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Search Trends Analytics" description="View the search trends on the platform." />
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Top Search Terms</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton />
          ) : (
            <div className="space-y-3">
              {data?.topSearches?.map((s) => (
                <div key={s.term} className="flex items-center justify-between border-b border-border pb-2">
                  <div className="text-foreground text-sm">{s.term}</div>
                  <div className="text-muted-foreground text-sm">{s.count}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default SearchTrendsAnalyticsPage; 