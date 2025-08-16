"use client";

import React, { useState } from 'react';
import PaymentStats from './_components/PaymentStats';
import PaymentFilters from './_components/PaymentFilters';
import PaymentTable from './_components/PaymentTable';
import InvoiceDrawer from './_components/InvoiceDrawer';
import PaymentSecurity from './_components/PaymentSecurity';
import PageHeader from '../_components/PageHeader';

export interface PaymentTransaction {
  id: string;
  invoiceNumber: string;
  lawyerName: string;
  service: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  paymentMethod?: string;
  duration?: string;
  time?: string;
  serviceFee?: number;
  platformCharges?: number;
}

const PaymentPage = () => {

  //////////////////////////////////////////////// STATE /////////////////////////////////////////////////
  const [selectedTransaction, setSelectedTransaction] = useState<PaymentTransaction | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({ dateRange: 'all', status: 'all', lawyer: 'any', search: '' });

  //////////////////////////////////////////////// DATA /////////////////////////////////////////////////
  const transactions: PaymentTransaction[] = [
    {
      id: '1',
      invoiceNumber: '001',
      lawyerName: 'Barrister Salman',
      service: 'Consultation (30 mins)',
      date: '2025-07-02',
      amount: 2000,
      status: 'paid',
      paymentMethod: 'Card (Visa)',
      duration: '30 minutes',
      time: '2:00 PM',
      serviceFee: 1800,
      platformCharges: 200
    },
    {
      id: '2',
      invoiceNumber: '002',
      lawyerName: 'Advocate Naureen',
      service: 'Document Review',
      date: '2025-07-05',
      amount: 3000,
      status: 'pending',
      paymentMethod: 'Card (Visa)',
      duration: '45 minutes',
      time: '4:00 PM',
      serviceFee: 2800,
      platformCharges: 200
    },
    {
      id: '3',
      invoiceNumber: '003',
      lawyerName: 'Barrister Salman',
      service: 'Consultation (60 mins)',
      date: '2025-06-28',
      amount: 4000,
      status: 'paid',
      paymentMethod: 'Card (Mastercard)',
      duration: '60 minutes',
      time: '10:00 AM',
      serviceFee: 3700,
      platformCharges: 300
    },
    {
      id: '4',
      invoiceNumber: '004',
      lawyerName: 'Advocate Zubair',
      service: 'Legal Drafting',
      date: '2025-06-20',
      amount: 6000,
      status: 'failed',
      paymentMethod: 'Card (Visa)',
      duration: '90 minutes',
      time: '11:00 AM',
      serviceFee: 5500,
      platformCharges: 500
    }
  ];

  //////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////
  const handleTransactionClick = (transaction: PaymentTransaction) => {
    setSelectedTransaction(transaction);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedTransaction(null);
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.lawyerName.toLowerCase().includes(filters.search.toLowerCase()) ||
      transaction.service.toLowerCase().includes(filters.search.toLowerCase()) ||
      transaction.invoiceNumber.toLowerCase().includes(filters.search.toLowerCase());

    const matchesStatus = filters.status === 'all' || transaction.status === filters.status;
    const matchesLawyer = filters.lawyer === 'any' || transaction.lawyerName === filters.lawyer;

    return matchesSearch && matchesStatus && matchesLawyer;
  });

  //////////////////////////////////////////////// CALCULATIONS /////////////////////////////////////////////////
  const totalSpent = transactions.filter(t => t.status === 'paid').reduce((sum, t) => sum + t.amount, 0);
  const pendingAmount = transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0);
  const lastPayment = transactions.filter(t => t.status === 'paid').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  //////////////////////////////////////////////// RENDER /////////////////////////////////////////////////
  return (
    <div className="w-full space-y-4">

      <InvoiceDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        transaction={selectedTransaction}
      />

      <PageHeader
        title="Payment Overview"
        description="View your payment history and statistics."
      />

      <PaymentStats
        totalSpent={totalSpent}
        lastPaymentDate={lastPayment?.date}
        pendingAmount={pendingAmount}
      />

      <PaymentFilters
        filters={filters}
        onFiltersChange={setFilters}
        lawyers={[...new Set(transactions.map(t => t.lawyerName))]}
      />

      <PaymentTable
        transactions={filteredTransactions}
        onTransactionClick={handleTransactionClick}
      />

      <PaymentSecurity />

    </div>
  );
};

export default PaymentPage;