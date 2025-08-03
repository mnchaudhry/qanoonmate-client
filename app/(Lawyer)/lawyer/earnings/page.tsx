"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import EarningsStatsStrip from './_components/EarningsStatsStrip';
import EarningsChart from './_components/EarningsChart';
import EarningsBreakdownTable from './_components/EarningsBreakdownTable';
import WithdrawalRequestsTable from './_components/WithdrawalRequestsTable';
import PageHeader from '../_components/PageHeader';

export default function Earnings() {
  return (
    <div className="space-y-6 pb-8">

      <PageHeader
        title="Earnings Overview"
        description="Track your earnings, withdrawals, and financial activity at a glance."
      />

      <EarningsStatsStrip />

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Payment History</CardTitle>
          <CardDescription className="text-muted-foreground">Visualize your earnings trends and history. Switch chart type as needed.</CardDescription>
        </CardHeader>
        <CardContent>
          <EarningsChart />
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Earnings Breakdown</CardTitle>
          <CardDescription className="text-muted-foreground">Detailed view of your recent earnings and sessions.</CardDescription>
        </CardHeader>
        <CardContent>
          <EarningsBreakdownTable />
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Withdrawal Requests</CardTitle>
          <CardDescription className="text-muted-foreground">Manage your withdrawal requests and track their status.</CardDescription>
        </CardHeader>
        <CardContent>
          <WithdrawalRequestsTable />
        </CardContent>
      </Card>
    </div>
  );
}