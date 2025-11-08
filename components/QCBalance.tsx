'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { fetchBalance } from '@/store/reducers/creditSlice';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wallet, Plus, Coins } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface QCBalanceProps {
  className?: string;
  showBuyButton?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

export const QCBalance: React.FC<QCBalanceProps> = ({
  className,
  showBuyButton = true,
  variant = 'default'
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { balance, loading } = useSelector((state: RootState) => state.credits);

  useEffect(() => {
    dispatch(fetchBalance());
  }, [dispatch]);

  const handleBuyCredits = () => {
    router.push('/wallet');
  };

  if (loading.balance) {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
        {showBuyButton && (
          <div className="animate-pulse bg-gray-200 h-8 w-8 rounded"></div>
        )}
      </div>
    );
  }

  if (!balance) {
    return null;
  }

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getBalanceColor = (amount: number) => {
    if (amount === 0) return 'text-red-500';
    if (amount < 10) return 'text-yellow-500';
    return 'text-green-500';
  };

  if (variant === 'compact') {
    return (
      <div className={cn("flex items-center space-x-1", className)}>
        <Coins className="h-4 w-4 text-yellow-500" />
        <span className={cn("text-sm font-medium", getBalanceColor(balance.balance))}>
          {formatBalance(balance.balance)}
        </span>
        {showBuyButton && balance.balance < 5 && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleBuyCredits}
            className="h-6 px-2 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Buy
          </Button>
        )}
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={cn("flex items-center space-x-3 p-3 bg-gray-50 rounded-lg", className)}>
        <div className="flex items-center space-x-2">
          <Wallet className="h-5 w-5 text-blue-500" />
          <div>
            <p className="text-sm text-gray-600">Qanoon Credits</p>
            <p className={cn("text-lg font-bold", getBalanceColor(balance.balance))}>
              {formatBalance(balance.balance)} QC
            </p>
          </div>
        </div>
        {showBuyButton && (
          <Button onClick={handleBuyCredits} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Buy Credits
          </Button>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Badge 
        variant={balance.balance === 0 ? "destructive" : balance.balance < 10 ? "secondary" : "default"}
        className="flex items-center space-x-1"
      >
        <Coins className="h-3 w-3" />
        <span className="font-medium">
          {formatBalance(balance.balance)} QC
        </span>
      </Badge>
      
      {showBuyButton && (
        <Button
          size="sm"
          variant="outline"
          onClick={handleBuyCredits}
          className="h-7 px-2"
        >
          <Plus className="h-3 w-3 mr-1" />
          Buy
        </Button>
      )}
    </div>
  );
};

export default QCBalance;
