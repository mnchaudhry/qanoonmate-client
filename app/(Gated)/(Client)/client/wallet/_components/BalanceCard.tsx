"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet } from 'lucide-react';

interface BalanceCardProps {
  balance: number;
  formatAmount: (amount: number) => string;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ balance, formatAmount }) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          Current Balance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-4xl font-bold text-primary mb-1">
              {formatAmount(balance)} QC
            </div>
            <p className="text-sm text-muted-foreground">
              Qanoon Credits available
            </p>
          </div>
          <Badge variant={balance > 10 ? "default" : "secondary"} className="text-sm">
            {balance > 10 ? "Active" : "Low Balance"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
