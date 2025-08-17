import React from 'react';
import { Download, CreditCard, FileText, User } from 'lucide-react';
import { PaymentTransaction } from '../page';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface InvoiceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: PaymentTransaction | null;
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
      case 'paid': return '✅';
      case 'pending': return '🕓';
      case 'failed': return '❌';
      default: return '⚪';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Paid';
      case 'pending': return 'Pending';
      case 'failed': return 'Failed';
      default: return status;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <DialogHeader className="border-b !border-border p-6 pb-4 flex flex-row items-center gap-3">
          <FileText className="w-6 h-6 text-primary" />
          <DialogTitle className="text-xl font-bold">Invoice #{transaction.invoiceNumber}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-6">
          {/* Lawyer Info */}
          <Card className="bg-muted rounded-lg p-4 mb-2">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium text-foreground">{transaction.lawyerName}</span>
            </div>
          </Card>
          {/* Service Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground border-b !border-border pb-2">Service Details</h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between"><span className="text-muted-foreground">Service:</span><span className="font-medium">{transaction.service}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Date:</span><span className="font-medium">{formatDate(transaction.date)}</span></div>
              {transaction.time && <div className="flex justify-between"><span className="text-muted-foreground">Time:</span><span className="font-medium">{transaction.time}</span></div>}
              {transaction.duration && <div className="flex justify-between"><span className="text-muted-foreground">Duration:</span><span className="font-medium">{transaction.duration}</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Status:</span><span className="font-medium flex items-center gap-1">{getStatusIcon(transaction.status)} {getStatusText(transaction.status)}</span></div>
              {transaction.paymentMethod && <div className="flex justify-between"><span className="text-muted-foreground">Payment Method:</span><span className="font-medium">{transaction.paymentMethod}</span></div>}
            </div>
          </div>
          {/* Amount Breakdown */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground border-b !border-border pb-2">Amount Breakdown</h3>
            <div className="space-y-3">
              {transaction.serviceFee && <div className="flex justify-between text-sm"><span className="text-muted-foreground">├ Service Fee:</span><span className="font-medium">{formatCurrency(transaction.serviceFee)}</span></div>}
              {transaction.platformCharges && <div className="flex justify-between text-sm"><span className="text-muted-foreground">├ Platform Charges:</span><span className="font-medium">{formatCurrency(transaction.platformCharges)}</span></div>}
              <div className="flex justify-between text-lg font-bold border-t !border-border pt-3"><span className="text-foreground">└ Total:</span><span className="text-primary">{formatCurrency(transaction.amount)}</span></div>
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
