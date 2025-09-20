import React from 'react';
import { Download, CreditCard, FileText, User, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Payment } from '@/store/types/payments.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface InvoiceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Payment | null;
}

const InvoiceDrawer: React.FC<InvoiceDrawerProps> = ({ isOpen, onClose, transaction }) => {
  if (!isOpen || !transaction) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatCurrency = (amount: number) => `PKR ${amount.toLocaleString()}`;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-orange-600" />;
      case 'processing': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4 text-gray-600" />;
      case 'refunded': return <CheckCircle className="w-4 h-4 text-purple-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'pending': return 'Pending';
      case 'processing': return 'Processing';
      case 'failed': return 'Failed';
      case 'cancelled': return 'Cancelled';
      case 'refunded': return 'Refunded';
      default: return status;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <DialogHeader className="border-b !border-border p-6 pb-4 flex flex-row items-center gap-3">
          <FileText className="w-6 h-6 text-primary" />
          <DialogTitle className="text-xl font-bold">Payment #{transaction.paymentId.slice(-8)}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-6">
          {/* Payment Info */}
          <Card className="bg-muted rounded-lg p-4 mb-2">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium text-foreground">{transaction.billingDetails.name}</span>
            </div>
            <div className="text-sm text-muted-foreground">{transaction.billingDetails.email}</div>
          </Card>
          
          {/* Payment Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground border-b !border-border pb-2">Payment Details</h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between"><span className="text-muted-foreground">Description:</span><span className="font-medium">{transaction.description}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Payment Type:</span><span className="font-medium">{transaction.paymentType}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Date:</span><span className="font-medium">{formatDate(transaction.createdAt)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Status:</span><span className="font-medium flex items-center gap-1">{getStatusIcon(transaction.status)} {getStatusText(transaction.status)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Payment Method:</span><span className="font-medium">{transaction.paymentMethod}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Gateway:</span><span className="font-medium">{transaction.gateway}</span></div>
            </div>
          </div>
          
          {/* Amount Breakdown */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground border-b !border-border pb-2">Amount Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-lg font-bold border-t !border-border pt-3"><span className="text-foreground">Total Amount:</span><span className="text-primary">{formatCurrency(transaction.amount)} {transaction.currency}</span></div>
            </div>
          </div>
        </div>
        <div className="p-6 border-t !border-border bg-muted flex gap-3">
          <Button variant="outline" className="flex-1"><Download className="w-4 h-4" />Download Invoice</Button>
          {transaction.status === 'pending' && (
            <Button variant="default" className="flex-1"><CreditCard className="w-4 h-4" />Pay Now</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDrawer;
