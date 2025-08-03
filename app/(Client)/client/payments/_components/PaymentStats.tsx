import React from 'react';

interface PaymentHeaderProps {
  totalSpent: number;
  lastPaymentDate?: string;
  pendingAmount: number;
}

const PaymentStats: React.FC<PaymentHeaderProps> = ({ totalSpent, lastPaymentDate, pendingAmount }) => {

  //////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No payments yet';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatCurrency = (amount: number) => {
    return `PKR ${amount.toLocaleString()}`;
  };

  //////////////////////////////////////////////// RENDER /////////////////////////////////////////////////
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Spent */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
          <span className="text-sm font-medium text-primary-800">Total Spent</span>
        </div>
        <p className="text-2xl font-bold text-primary-900">{formatCurrency(totalSpent)}</p>
      </div>

      {/* Last Payment */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-green-600 rounded-full"></div>
          <span className="text-sm font-medium text-green-800">Last Payment</span>
        </div>
        <p className="text-2xl font-bold text-green-900">{formatDate(lastPaymentDate)}</p>
      </div>

      {/* Pending Amount */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
          <span className="text-sm font-medium text-orange-800">Pending</span>
        </div>
        <p className="text-2xl font-bold text-orange-900">{formatCurrency(pendingAmount)}</p>
      </div>
    </div>
  );
};

export default PaymentStats;
