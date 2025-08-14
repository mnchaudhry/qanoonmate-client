import React from 'react';
import { Shield, Lock, CheckCircle } from 'lucide-react';

const PaymentSecurity: React.FC = () => {
  return (
    <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Shield className="w-6 h-6 text-primary-600" />
        <h2 className="text-lg font-semibold text-primary-900">Payment Security Notice</h2>
      </div>
      
      <div className="flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-primary-800">
          <p className="mb-2">
            All transactions are encrypted and processed securely via QanoonMate&apos;s verified payment gateways.
          </p>
          <div className="flex items-center gap-2 text-xs text-primary-700">
            <Lock className="w-3 h-3" />
            <span>256-bit SSL encryption • PCI DSS compliant • Fraud protection enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSecurity;
