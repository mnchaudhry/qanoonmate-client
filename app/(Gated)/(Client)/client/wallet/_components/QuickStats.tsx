"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, ArrowDownLeft } from 'lucide-react';

interface QuickStatsProps {
  totalPurchased: number;
  totalUsed: number;
}

export const QuickStats: React.FC<QuickStatsProps> = ({ totalPurchased, totalUsed }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm text-muted-foreground">Total Purchased</span>
          </div>
          <div className="text-2xl font-semibold">
            {totalPurchased} QC
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowDownLeft className="h-4 w-4 text-red-500" />
            <span className="text-sm text-muted-foreground">Total Used</span>
          </div>
          <div className="text-2xl font-semibold">
            {totalUsed} QC
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
