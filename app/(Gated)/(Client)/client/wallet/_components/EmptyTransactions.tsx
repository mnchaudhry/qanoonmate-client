"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Coins } from 'lucide-react';

export const EmptyTransactions: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <Coins className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Your transaction history will appear here once you start using credits.
        </p>
      </CardContent>
    </Card>
  );
};
