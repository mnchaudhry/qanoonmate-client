"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownLeft, DollarSign, Filter, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import DashboardPageHeader from '@/components/DashboardPageHeader';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { getPayments, getPaymentStats } from '@/store/reducers/paymentSlice';
import { PaymentType, PaymentStatus } from '@/lib/enums';

const TransactionHistoryPage = () => {

    //////////////////////////////////////////////// VARIABLES //////////////////////////////////////////////// 
    const dispatch = useDispatch<AppDispatch>();
    const { payments, paymentStats, pagination } = useSelector((state: RootState) => state.payments);
    const { user } = useSelector((state: RootState) => state.auth);

    //////////////////////////////////////////////// STATES ///////////////////////////////////////////////////
    const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>('all');
    const [dateFilter, setDateFilter] = useState<'all' | '7days' | '30days' | '3months'>('all');
    const [loading, setLoading] = useState({ payments: false });

    //////////////////////////////////////////////// EFFECTS //////////////////////////////////////////////////
    useEffect(() => {
        if (user?._id) {
            // Fetch payments
            setLoading(pre => ({ ...pre, payments: true }))
            dispatch(getPayments({
                filters: {
                    userId: user._id,
                    ...(filterType !== 'all' && {
                        paymentType: filterType === 'credit'
                            ? [PaymentType.CONSULTATION, PaymentType.SUBSCRIPTION]
                            : [PaymentType.REFUND]
                    })
                },
                page: 1,
                limit: 10
            }))
                .finally(() => {
                    setLoading(pre => ({ ...pre, payments: false }))
                })

            // Fetch payment stats
            dispatch(getPaymentStats({
                userId: user._id,
                ...(dateFilter !== 'all' && {
                    dateRange: getDateRange(dateFilter)
                })
            }));
        }
    }, [dispatch, user, filterType, dateFilter]);

    //////////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////
    const getDateRange = (filter: string) => {
        const end = new Date();
        const start = new Date();

        switch (filter) {
            case '7days':
                start.setDate(end.getDate() - 7);
                break;
            case '30days':
                start.setDate(end.getDate() - 30);
                break;
            case '3months':
                start.setMonth(end.getMonth() - 3);
                break;
            default:
                return undefined;
        }

        return { start, end };
    };

    const getTransactionIcon = (type: PaymentType) => {
        return type === PaymentType.CONSULTATION || type === PaymentType.SUBSCRIPTION
            ? <ArrowDownLeft className="h-4 w-4 text-green-500" />
            : <ArrowUpRight className="h-4 w-4 text-red-500" />;
    };

    const getTransactionColor = (type: PaymentType) => {
        return type === PaymentType.CONSULTATION || type === PaymentType.SUBSCRIPTION
            ? 'text-green-600'
            : 'text-red-600';
    };

    const getStatusBadge = (status: PaymentStatus) => {
        const variants: Record<PaymentStatus, { variant: "default" | "secondary" | "outline" | "destructive", label: string }> = {
            [PaymentStatus.COMPLETED]: { variant: "default", label: "Completed" },
            [PaymentStatus.PENDING]: { variant: "secondary", label: "Pending" },
            [PaymentStatus.PROCESSING]: { variant: "secondary", label: "Processing" },
            [PaymentStatus.FAILED]: { variant: "destructive", label: "Failed" },
            [PaymentStatus.CANCELLED]: { variant: "outline", label: "Cancelled" },
            [PaymentStatus.REFUNDED]: { variant: "outline", label: "Refunded" },
            [PaymentStatus.PARTIAL_REFUND]: { variant: "outline", label: "Partial Refund" },
            [PaymentStatus.EXPIRED]: { variant: "outline", label: "Expired" }
        };
        const config = variants[status] || variants[PaymentStatus.PENDING];
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    const handleFilterChange = (type: 'all' | 'credit' | 'debit') => {
        setFilterType(type);
    };

    const handleDateFilterChange = (filter: 'all' | '7days' | '30days' | '3months') => {
        setDateFilter(filter);
    };

    const handleLoadMore = () => {
        if (user?._id && pagination.currentPage < pagination.totalPages) {
            dispatch(getPayments({
                filters: {
                    userId: user._id,
                    ...(filterType !== 'all' && {
                        paymentType: filterType === 'credit'
                            ? [PaymentType.CONSULTATION, PaymentType.SUBSCRIPTION]
                            : [PaymentType.REFUND]
                    })
                },
                page: pagination.currentPage + 1,
                limit: 10
            }));
        }
    };

    const isCredit = (type: PaymentType) => {
        return type === PaymentType.CONSULTATION || type === PaymentType.SUBSCRIPTION;
    };

    const formatAmount = (amount: number, type: PaymentType) => {
        const isPositive = isCredit(type);
        const sign = isPositive ? '+' : '-';
        return `${sign}$${Math.abs(amount).toFixed(2)}`;
    };

    //////////////////////////////////////////////// RENDER //////////////////////////////////////////////// 
    return (
        <div className="space-y-6">
            <DashboardPageHeader
                title="Transaction History"
                description="View all your financial transactions and payment history."
            />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Received</p>
                                <p className="text-2xl font-bold text-green-600">
                                    ${paymentStats?.completedAmount?.toFixed(2) || '0.00'}
                                </p>
                            </div>
                            <ArrowDownLeft className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Withdrawn</p>
                                <p className="text-2xl font-bold text-red-600">
                                    ${paymentStats?.refundedAmount?.toFixed(2) || '0.00'}
                                </p>
                            </div>
                            <ArrowUpRight className="h-8 w-8 text-red-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Current Balance</p>
                                <p className="text-2xl font-bold text-primary">
                                    ${((paymentStats?.completedAmount || 0) - (paymentStats?.refundedAmount || 0)).toFixed(2)}
                                </p>
                            </div>
                            <DollarSign className="h-8 w-8 text-primary" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                    {filterType === 'all' ? 'All Transactions' : filterType === 'credit' ? 'Credits Only' : 'Debits Only'}
                </h2>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleFilterChange('all')}>
                            All Transactions
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleFilterChange('credit')}>
                            Credits Only
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleFilterChange('debit')}>
                            Debits Only
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDateFilterChange('all')}>
                            All Time
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDateFilterChange('7days')}>
                            Last 7 Days
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDateFilterChange('30days')}>
                            Last 30 Days
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDateFilterChange('3months')}>
                            Last 3 Months
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Loading State */}
            {loading.payments && (
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}

            {/* Transactions List */}
            {!loading.payments && payments.length > 0 && (
                <div className="space-y-3">
                    {payments.map((payment) => (
                        <Card key={payment.paymentId} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                        {getTransactionIcon(payment.paymentType)}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-sm">
                                                    {payment.description || payment.paymentType}
                                                </p>
                                                {getStatusBadge(payment.status)}
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {payment.createdAt && format(new Date(payment.createdAt), 'PPp')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-semibold text-lg ${getTransactionColor(payment.paymentType)}`}>
                                            {formatAmount(payment.amount, payment.paymentType)}
                                        </p>
                                        {payment.consultationId && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                ID: {payment.consultationId}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading.payments && payments.length === 0 && (
                <Card>
                    <CardContent className="p-12 text-center">
                        <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-lg font-medium mb-2">No transactions found</p>
                        <p className="text-sm text-muted-foreground">
                            {filterType !== 'all' || dateFilter !== 'all'
                                ? 'Try adjusting your filters to see more results.'
                                : 'Your transaction history will appear here once you start earning.'}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Load More */}
            {!loading.payments && payments.length > 0 && pagination && pagination.currentPage < pagination.totalPages && (
                <div className="flex justify-center pt-4">
                    <Button
                        variant="outline"
                        onClick={handleLoadMore}
                        disabled={loading.payments}
                    >
                        {loading.payments ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            'Load More Transactions'
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default TransactionHistoryPage;
