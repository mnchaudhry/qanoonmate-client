"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownLeft, DollarSign, Filter } from 'lucide-react';
import { format } from 'date-fns';
import DashboardPageHeader from '@/components/DashboardPageHeader';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const TransactionHistoryPage = () => {
    // Mock data - replace with actual Redux state
    const transactions = [
        {
            id: '1',
            type: 'credit',
            description: 'Payment received from John Doe - Consultation',
            amount: 150.00,
            timestamp: new Date('2024-11-15T10:30:00'),
            status: 'completed',
            consultationId: 'C001'
        },
        {
            id: '2',
            type: 'debit',
            description: 'Platform fee deduction',
            amount: -15.00,
            timestamp: new Date('2024-11-15T10:30:00'),
            status: 'completed',
        },
        {
            id: '3',
            type: 'credit',
            description: 'Payment received from Sarah Ahmed - Legal Document Review',
            amount: 200.00,
            timestamp: new Date('2024-11-14T14:20:00'),
            status: 'completed',
            consultationId: 'C002'
        },
        {
            id: '4',
            type: 'debit',
            description: 'Withdrawal to bank account',
            amount: -500.00,
            timestamp: new Date('2024-11-13T09:15:00'),
            status: 'processing',
        },
        {
            id: '5',
            type: 'credit',
            description: 'Payment received from Ali Khan - Family Law Consultation',
            amount: 175.00,
            timestamp: new Date('2024-11-12T16:45:00'),
            status: 'completed',
            consultationId: 'C003'
        },
    ];

    const getTransactionIcon = (type: string) => {
        return type === 'credit'
            ? <ArrowDownLeft className="h-4 w-4 text-green-500" />
            : <ArrowUpRight className="h-4 w-4 text-red-500" />;
    };

    const getTransactionColor = (type: string) => {
        return type === 'credit' ? 'text-green-600' : 'text-red-600';
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { variant: "default" | "secondary" | "outline", label: string }> = {
            completed: { variant: "default", label: "Completed" },
            processing: { variant: "secondary", label: "Processing" },
            failed: { variant: "outline", label: "Failed" }
        };
        const config = variants[status] || variants.completed;
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

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
                                <p className="text-2xl font-bold text-green-600">$5,250.00</p>
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
                                <p className="text-2xl font-bold text-red-600">$2,100.00</p>
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
                                <p className="text-2xl font-bold text-primary">$3,150.00</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-primary" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">All Transactions</h2>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>All Transactions</DropdownMenuItem>
                        <DropdownMenuItem>Credits Only</DropdownMenuItem>
                        <DropdownMenuItem>Debits Only</DropdownMenuItem>
                        <DropdownMenuItem>Last 7 Days</DropdownMenuItem>
                        <DropdownMenuItem>Last 30 Days</DropdownMenuItem>
                        <DropdownMenuItem>Last 3 Months</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Transactions List */}
            <div className="space-y-3">
                {transactions.map((transaction) => (
                    <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                    {getTransactionIcon(transaction.type)}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-sm">{transaction.description}</p>
                                            {getStatusBadge(transaction.status)}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {format(transaction.timestamp, 'PPp')}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-semibold text-lg ${getTransactionColor(transaction.type)}`}>
                                        {transaction.type === 'credit' ? '+' : ''}{transaction.amount < 0 ? transaction.amount : `$${transaction.amount.toFixed(2)}`}
                                    </p>
                                    {transaction.consultationId && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            ID: {transaction.consultationId}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Load More */}
            <div className="flex justify-center pt-4">
                <Button variant="outline">Load More Transactions</Button>
            </div>
        </div>
    );
};

export default TransactionHistoryPage;
