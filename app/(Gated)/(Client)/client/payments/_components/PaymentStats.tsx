import React from 'react';
import { PaymentStats as PaymentStatsType } from '@/store/types/payments.types';
import { Skeleton } from '@/components/ui/skeleton';

interface PaymentStatsProps {
  paymentStats: PaymentStatsType | null;
  loading: boolean;
}

const PaymentStats: React.FC<PaymentStatsProps> = ({ paymentStats, loading }) => {

  //////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////
  const formatCurrency = (amount: number) => {
    return `PKR ${amount.toLocaleString()}`;
  };

  //////////////////////////////////////////////// RENDER /////////////////////////////////////////////////
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-8 w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (!paymentStats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span className="text-sm font-medium text-gray-600">No Data Available</span>
          </div>
          <p className="text-2xl font-bold text-gray-500">--</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Spent */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
          <span className="text-sm font-medium text-primary-800">Total Spent</span>
        </div>
        <p className="text-2xl font-bold text-primary-900">{formatCurrency(paymentStats.completedAmount)}</p>
      </div>

      {/* Completed Payments */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-green-600 rounded-full"></div>
          <span className="text-sm font-medium text-green-800">Completed</span>
        </div>
        <p className="text-2xl font-bold text-green-900">{paymentStats.completed}</p>
      </div>

      {/* Pending Amount */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
          <span className="text-sm font-medium text-orange-800">Pending</span>
        </div>
        <p className="text-2xl font-bold text-orange-900">{paymentStats.pending}</p>
      </div>
    </div>
  );
};

export default PaymentStats;
