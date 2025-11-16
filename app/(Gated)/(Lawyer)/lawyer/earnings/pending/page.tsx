"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, DollarSign, Calendar, FileText, Send, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import DashboardPageHeader from '@/components/DashboardPageHeader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { getPayments, getPaymentStats } from '@/store/reducers/paymentSlice';
import { PaymentStatus } from '@/lib/enums';

const PendingPaymentsPage = () => {

    //////////////////////////////////////////////// VARIABLES //////////////////////////////////////////////////
    const dispatch = useDispatch<AppDispatch>();
    const { payments } = useSelector((state: RootState) => state.payments);
    const { user } = useSelector((state: RootState) => state.auth);

    // Calculate stats from payments
    const stats = useMemo(() => {
        const totalPending = payments.reduce((sum, payment) => sum + payment.amount, 0);
        const overduePayments = payments.filter(p => {
            if (!p.createdAt) return false;
            const daysSinceCreation = Math.floor((Date.now() - new Date(p.createdAt).getTime()) / (1000 * 60 * 60 * 24));
            return daysSinceCreation > 7; // Consider overdue after 7 days
        });
        const overdueAmount = overduePayments.reduce((sum, p) => sum + p.amount, 0);
        const averagePayment = payments.length > 0 ? totalPending / payments.length : 0;

        return { totalPending, overduePayments, overdueAmount, averagePayment };
    }, [payments]);

    //////////////////////////////////////////////// STATES //////////////////////////////////////////////////
    const [loading, setLoading] = useState({ payments: false, stats: false });

    //////////////////////////////////////////////// EFFECTS //////////////////////////////////////////////////
    useEffect(() => {
        if (user?._id) {

            setLoading(pre => ({ ...pre, payments: true }))
            dispatch(getPayments({
                filters: { userId: user._id, status: [PaymentStatus.PENDING, PaymentStatus.PROCESSING] },
                page: 1,
                limit: 20
            }))
                .finally(() => { setLoading(pre => ({ ...pre, payments: false })) });

            setLoading(pre => ({ ...pre, stats: true }))
            dispatch(getPaymentStats({ userId: user._id }))
                .finally(() => { setLoading(pre => ({ ...pre, stats: false })) });
        }
    }, [dispatch, user?._id]);

    //////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////////
    const handleSendReminder = (paymentId: string) => {
        // TODO: Implement send reminder functionality
        console.log('Sending reminder for payment:', paymentId);
    };

    const getStatusBadge = (status: string) => {
        return status === 'overdue'
            ? <Badge variant="destructive">Overdue</Badge>
            : <Badge variant="secondary">Pending</Badge>;
    };

    //////////////////////////////////////////////// RENDER //////////////////////////////////////////////////
    return (
        <div className="space-y-6">
            <DashboardPageHeader
                title="Pending Payments"
                description="Track and manage payments awaiting from clients."
            />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Pending</p>
                                <p className="text-2xl font-bold text-primary">${stats.totalPending.toFixed(2)}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {payments.length} consultations
                                </p>
                            </div>
                            <DollarSign className="h-8 w-8 text-primary" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Overdue</p>
                                <p className="text-2xl font-bold text-destructive">
                                    ${stats.overdueAmount.toFixed(2)}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {stats.overduePayments.length} payments
                                </p>
                            </div>
                            <Clock className="h-8 w-8 text-destructive" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Average Payment</p>
                                <p className="text-2xl font-bold">
                                    ${stats.averagePayment.toFixed(2)}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    per consultation
                                </p>
                            </div>
                            <FileText className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Pending Payments List */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Awaiting Payments</h2>

                {/* Loading State */}
                {loading.payments && (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}

                {/* Payments List */}
                {!loading.payments && payments.length > 0 && (
                    <div className="space-y-3">
                        {payments.map((payment) => {
                            const daysSinceCreation = payment.createdAt
                                ? Math.floor((Date.now() - new Date(payment.createdAt).getTime()) / (1000 * 60 * 60 * 24))
                                : 0;
                            const isOverdue = daysSinceCreation > 7;

                            return (
                                <Card key={payment.paymentId} className={`hover:shadow-md transition-shadow ${isOverdue ? 'border-destructive' : ''}`}>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between gap-4">
                                            {/* Client Info */}
                                            <div className="flex items-center gap-3 flex-1">
                                                <Avatar className="h-12 w-12">
                                                    <AvatarImage src="" />
                                                    <AvatarFallback className="bg-primary/10 text-primary">
                                                        {payment.userId?.slice(0, 2).toUpperCase() || 'U'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className="font-semibold">Client</p>
                                                        {getStatusBadge(payment.status)}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mb-1">
                                                        {payment.description || payment.paymentType}
                                                    </p>
                                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                        {payment.createdAt && (
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="h-3 w-3" />
                                                                Created: {format(new Date(payment.createdAt), 'MMM dd, yyyy')}
                                                            </span>
                                                        )}
                                                        {isOverdue && (
                                                            <span className="text-destructive font-medium">
                                                                {daysSinceCreation} days pending
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Amount & Actions */}
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-primary">
                                                        ${payment.amount.toFixed(2)}
                                                    </p>
                                                    {payment.consultationId && (
                                                        <p className="text-xs text-muted-foreground">
                                                            ID: {payment.consultationId}
                                                        </p>
                                                    )}
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleSendReminder(payment.paymentId)}
                                                >
                                                    <Send className="h-4 w-4 mr-2" />
                                                    Remind
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* Empty State */}
                {!loading.payments && payments.length === 0 && (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                            <h3 className="text-lg font-semibold mb-2">No Pending Payments</h3>
                            <p className="text-sm text-muted-foreground">
                                All consultations have been paid. Great work!
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default PendingPaymentsPage;
