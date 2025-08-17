import React, { useState } from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { PaymentTransaction } from '../page';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';

interface PaymentTableProps {
  transactions: PaymentTransaction[];
  onTransactionClick: (transaction: PaymentTransaction) => void;
}

const PaymentTable: React.FC<PaymentTableProps> = ({ transactions, onTransactionClick }) => {

  //////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////
  const itemsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  //////////////////////////////////////////////// STATE /////////////////////////////////////////////////
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  //////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatCurrency = (amount: number) => `PKR ${amount.toLocaleString()}`;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="text-green-700 font-medium">Paid</span>;
      case 'pending':
        return <span className="text-orange-700 font-medium">Pending</span>;
      case 'failed':
        return <span className="text-red-700 font-medium">Failed</span>;
      default:
        return status;
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  //////////////////////////////////////////////// RENDER /////////////////////////////////////////////////
  return (
    <>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">#</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Lawyer</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Service</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Date</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Amount</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTransactions.map((transaction) => (
              <TableRow
                key={transaction.id}
                onClick={() => onTransactionClick(transaction)}
                className="hover:bg-accent cursor-pointer transition-colors"
              >
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{transaction.invoiceNumber}</TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{transaction.lawyerName}</TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{transaction.service}</TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{formatDate(transaction.date)}</TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{formatCurrency(transaction.amount)}</TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(transaction.status)}
                    {getStatusText(transaction.status)}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

    </>
  );
};

export default PaymentTable;
