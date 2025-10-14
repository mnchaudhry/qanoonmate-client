'use client';

import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, AlertTriangle, CheckCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface QCConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  service: string;
  cost: number;
  description: string;
  loading?: boolean;
}

export const QCConfirmationModal: React.FC<QCConfirmationModalProps> = ({ isOpen, onClose, onConfirm, service, cost, description, loading = false }) => {

  const { balance } = useSelector((state: RootState) => state.credits);

  const hasInsufficientBalance = balance && balance.balance < cost;
  const canProceed = !hasInsufficientBalance && !loading;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Coins className="h-5 w-5 text-yellow-500" />
            <span>Confirm QC Deduction</span>
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Service Info */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">{service}</p>
              <p className="text-sm text-gray-600">Service</p>
            </div>
            <Badge variant="outline">
              {formatAmount(cost)} QC
            </Badge>
          </div>

          {/* Current Balance */}
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div>
              <p className="font-medium">Current Balance</p>
              <p className="text-sm text-gray-600">Available Credits</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-blue-600">
                {balance ? formatAmount(balance.balance) : '0'} QC
              </p>
            </div>
          </div>

          {/* Remaining Balance */}
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div>
              <p className="font-medium">Remaining Balance</p>
              <p className="text-sm text-gray-600">After this transaction</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-green-600">
                {balance ? formatAmount(balance.balance - cost) : '0'} QC
              </p>
            </div>
          </div>

          {/* Insufficient Balance Warning */}
          {hasInsufficientBalance && (
            <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <p className="font-medium text-red-800">Insufficient Balance</p>
                <p className="text-sm text-red-600">
                  You need {formatAmount(cost - (balance?.balance || 0))} more QC to use this service.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row space-y-2 sm:space-y-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>

          {hasInsufficientBalance ? (
            <Button
              onClick={() => {
                onClose();
                // Navigate to wallet page
                window.location.href = '/wallet';
              }}
              className="w-full sm:w-auto"
            >
              <Coins className="h-4 w-4 mr-2" />
              Buy Credits
            </Button>
          ) : (
            <Button
              onClick={onConfirm}
              disabled={!canProceed}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm & Proceed
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QCConfirmationModal;
