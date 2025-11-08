"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchPayments, fetchPaymentStats, fetchPaymentMethods, fetchAvailableGateways } from '@/store/reducers/paymentSlice';
import PaymentStats from './_components/PaymentStats';
import PaymentFilters from './_components/PaymentFilters';
import PaymentTable from './_components/PaymentTable';
import InvoiceDrawer from './_components/InvoiceDrawer';
import PaymentSecurity from './_components/PaymentSecurity';
import PageHeader from '../_components/PageHeader';
import { Payment } from '@/store/types/payments.types';

const PaymentPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { payments, paymentStats, paymentMethods, loading, pagination } = useSelector((state: RootState) => state.payments);

  //////////////////////////////////////////////// STATE /////////////////////////////////////////////////
  const [selectedTransaction, setSelectedTransaction] = useState<Payment | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<PaymentFilters>({ 
    dateFrom: undefined,
    dateTo: undefined,
    status: undefined,
    paymentMethod: undefined,
    search: '',
    page: 1,
    limit: 10
  });

  //////////////////////////////////////////////// EFFECTS /////////////////////////////////////////////////
  useEffect(() => {
    dispatch(fetchPayments(filters));
    dispatch(fetchPaymentStats({}));
    dispatch(fetchPaymentMethods());
    dispatch(fetchAvailableGateways());
  }, [dispatch, filters]);

  //////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////
  const handleTransactionClick = (transaction: Payment) => {
    setSelectedTransaction(transaction);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedTransaction(null);
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

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
        paymentStats={paymentStats}
        loading={loading.stats}
      />

      <PaymentFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        paymentMethods={paymentMethods}
        loading={loading.paymentMethods}
      />

      <PaymentTable
        payments={payments}
        onTransactionClick={handleTransactionClick}
        loading={loading.payments}
        pagination={pagination}
        onPageChange={handlePageChange}
      />

      <PaymentSecurity />

    </div>
  );
};

export default PaymentPage;