"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownLeft, Gift, Coins } from 'lucide-react';
import { format } from 'date-fns';
import { IQCTransaction } from '@/store/types/credits.types';

interface TransactionItemProps {
  transaction: IQCTransaction;
  formatAmount: (amount: number) => string;
}

const getTransactionIcon = (type: string) => {
  switch (type) {
    case 'purchase':
      return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    case 'deduction':
      return <ArrowDownLeft className="h-4 w-4 text-red-500" />;
    case 'refund':
      return <ArrowUpRight className="h-4 w-4 text-blue-500" />;
    case 'bonus':
      return <Gift className="h-4 w-4 text-purple-500" />;
    default:
      return <Coins className="h-4 w-4 text-muted-foreground" />;
  }
};

const getTransactionColor = (type: string) => {
  switch (type) {
    case 'purchase':
    case 'bonus':
      return 'text-green-600';
    case 'deduction':
      return 'text-red-600';
    case 'refund':
      return 'text-blue-600';
    default:
      return 'text-muted-foreground';
  }
};

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, formatAmount }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getTransactionIcon(transaction.type)}
            <div>
              <p className="font-medium text-sm">{transaction.description}</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(transaction.timestamp), 'PPp')}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className={`font-semibold text-sm ${getTransactionColor(transaction.type)}`}>
              {transaction.qcAmount > 0 ? '+' : ''}{formatAmount(transaction.qcAmount)} QC
            </p>
            <Badge variant="outline" className="text-xs mt-1">
              {transaction.type}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
