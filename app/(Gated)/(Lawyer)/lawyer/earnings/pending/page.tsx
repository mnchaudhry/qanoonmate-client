"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, DollarSign, Calendar, FileText, Send } from 'lucide-react';
import { format } from 'date-fns';
import DashboardPageHeader from '@/components/DashboardPageHeader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const PendingPaymentsPage = () => {
    // Mock data - replace with actual Redux state
    const pendingPayments = [
        {
            id: '1',
            clientName: 'John Doe',
            clientAvatar: '',
            consultationType: 'Legal Consultation',
            amount: 150.00,
            scheduledDate: new Date('2024-11-10T10:00:00'),
            completedDate: new Date('2024-11-10T11:30:00'),
            daysOverdue: 5,
            status: 'overdue',
            consultationId: 'C001'
        },
        {
            id: '2',
            clientName: 'Sarah Ahmed',
            clientAvatar: '',
            consultationType: 'Document Review',
            amount: 200.00,
            scheduledDate: new Date('2024-11-12T14:00:00'),
            completedDate: new Date('2024-11-12T15:00:00'),
            daysOverdue: 3,
            status: 'overdue',
            consultationId: 'C002'
        },
        {
            id: '3',
            clientName: 'Ali Khan',
            clientAvatar: '',
            consultationType: 'Contract Review',
            amount: 175.00,
            scheduledDate: new Date('2024-11-14T09:00:00'),
            completedDate: new Date('2024-11-14T10:30:00'),
            daysOverdue: 1,
            status: 'pending',
            consultationId: 'C003'
        },
        {
            id: '4',
            clientName: 'Fatima Malik',
            clientAvatar: '',
            consultationType: 'Family Law Consultation',
            amount: 180.00,
            scheduledDate: new Date('2024-11-15T11:00:00'),
            completedDate: new Date('2024-11-15T12:00:00'),
            daysOverdue: 0,
            status: 'pending',
            consultationId: 'C004'
        },
    ];

    const totalPending = pendingPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const overduePayments = pendingPayments.filter(p => p.status === 'overdue');

    const handleSendReminder = (paymentId: string) => {
        // TODO: Implement send reminder functionality
        console.log('Sending reminder for payment:', paymentId);
    };

    const getStatusBadge = (status: string) => {
        return status === 'overdue'
            ? <Badge variant="destructive">Overdue</Badge>
            : <Badge variant="secondary">Pending</Badge>;
    };

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
                                <p className="text-2xl font-bold text-primary">${totalPending.toFixed(2)}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {pendingPayments.length} consultations
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
                                    ${overduePayments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {overduePayments.length} payments
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
                                    ${(totalPending / pendingPayments.length).toFixed(2)}
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
                <div className="space-y-3">
                    {pendingPayments.map((payment) => (
                        <Card key={payment.id} className={`hover:shadow-md transition-shadow ${payment.status === 'overdue' ? 'border-destructive' : ''}`}>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between gap-4">
                                    {/* Client Info */}
                                    <div className="flex items-center gap-3 flex-1">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={payment.clientAvatar} />
                                            <AvatarFallback className="bg-primary/10 text-primary">
                                                {payment.clientName.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-semibold">{payment.clientName}</p>
                                                {getStatusBadge(payment.status)}
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-1">
                                                {payment.consultationType}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    Completed: {format(payment.completedDate, 'MMM dd, yyyy')}
                                                </span>
                                                {payment.daysOverdue > 0 && (
                                                    <span className="text-destructive font-medium">
                                                        {payment.daysOverdue} days overdue
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
                                            <p className="text-xs text-muted-foreground">
                                                ID: {payment.consultationId}
                                            </p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleSendReminder(payment.id)}
                                        >
                                            <Send className="h-4 w-4 mr-2" />
                                            Remind
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Empty State */}
            {pendingPayments.length === 0 && (
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
    );
};

export default PendingPaymentsPage;
