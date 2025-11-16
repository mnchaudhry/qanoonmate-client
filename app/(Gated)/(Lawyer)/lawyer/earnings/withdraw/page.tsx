"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet, DollarSign, CheckCircle, Clock, XCircle, CreditCard, Building2 } from 'lucide-react';
import { format } from 'date-fns';
import DashboardPageHeader from '@/components/DashboardPageHeader';
import { toast } from 'sonner';

const WithdrawPaymentsPage = () => {
    const [withdrawAmount, setWithdrawAmount] = useState('');

    // Mock data - replace with actual Redux state
    const availableBalance = 3150.00;
    const minimumWithdrawal = 50.00;
    const platformFee = 2.5; // percentage

    const withdrawalHistory = [
        {
            id: '1',
            amount: 500.00,
            fee: 12.50,
            netAmount: 487.50,
            requestDate: new Date('2024-11-13T09:15:00'),
            processedDate: new Date('2024-11-14T14:30:00'),
            status: 'completed',
            method: 'bank_transfer',
            accountLast4: '4532'
        },
        {
            id: '2',
            amount: 750.00,
            fee: 18.75,
            netAmount: 731.25,
            requestDate: new Date('2024-11-08T11:20:00'),
            processedDate: null,
            status: 'processing',
            method: 'bank_transfer',
            accountLast4: '4532'
        },
        {
            id: '3',
            amount: 1000.00,
            fee: 25.00,
            netAmount: 975.00,
            requestDate: new Date('2024-10-28T15:45:00'),
            processedDate: new Date('2024-10-30T10:15:00'),
            status: 'completed',
            method: 'bank_transfer',
            accountLast4: '4532'
        },
    ];

    const handleWithdrawalRequest = () => {
        const amount = parseFloat(withdrawAmount);

        if (isNaN(amount) || amount < minimumWithdrawal) {
            toast.error(`Minimum withdrawal amount is $${minimumWithdrawal}`);
            return;
        }

        if (amount > availableBalance) {
            toast.error('Insufficient balance');
            return;
        }

        // TODO: Implement actual withdrawal request
        toast.success('Withdrawal request submitted successfully!');
        setWithdrawAmount('');
    };

    const calculateFee = (amount: number) => {
        return (amount * platformFee) / 100;
    };

    const calculateNetAmount = (amount: number) => {
        return amount - calculateFee(amount);
    };

    const getStatusBadge = (status: string) => {
        const configs: Record<string, { variant: "default" | "secondary" | "destructive", icon: any, label: string }> = {
            completed: { variant: "default", icon: CheckCircle, label: "Completed" },
            processing: { variant: "secondary", icon: Clock, label: "Processing" },
            failed: { variant: "destructive", icon: XCircle, label: "Failed" }
        };
        const config = configs[status] || configs.processing;
        const Icon = config.icon;
        return (
            <Badge variant={config.variant} className="gap-1">
                <Icon className="h-3 w-3" />
                {config.label}
            </Badge>
        );
    };

    return (
        <div className="space-y-6">
            <DashboardPageHeader
                title="Withdraw Payments"
                description="Request withdrawals and manage your payout history."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Withdrawal Request Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Available Balance Card */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
                                    <p className="text-4xl font-bold text-primary">${availableBalance.toFixed(2)}</p>
                                </div>
                                <Wallet className="h-12 w-12 text-primary" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* New Withdrawal Request */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Request Withdrawal</CardTitle>
                            <CardDescription>
                                Minimum withdrawal: ${minimumWithdrawal.toFixed(2)} • Platform fee: {platformFee}%
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="amount">Withdrawal Amount</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="amount"
                                        type="number"
                                        placeholder="0.00"
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        className="pl-9"
                                        min={minimumWithdrawal}
                                        max={availableBalance}
                                        step="0.01"
                                    />
                                </div>
                            </div>

                            {withdrawAmount && parseFloat(withdrawAmount) >= minimumWithdrawal && (
                                <div className="bg-muted p-4 rounded-lg space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Withdrawal Amount:</span>
                                        <span className="font-medium">${parseFloat(withdrawAmount).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Platform Fee ({platformFee}%):</span>
                                        <span className="font-medium text-destructive">
                                            -${calculateFee(parseFloat(withdrawAmount)).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="border-t border-border pt-2 flex justify-between">
                                        <span className="font-semibold">Net Amount:</span>
                                        <span className="font-bold text-primary text-lg">
                                            ${calculateNetAmount(parseFloat(withdrawAmount)).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <Button
                                onClick={handleWithdrawalRequest}
                                className="w-full"
                                disabled={!withdrawAmount || parseFloat(withdrawAmount) < minimumWithdrawal}
                            >
                                Request Withdrawal
                            </Button>

                            <p className="text-xs text-muted-foreground text-center">
                                Withdrawals are typically processed within 3-5 business days
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Payment Method Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Building2 className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm">Bank Transfer</p>
                                    <p className="text-xs text-muted-foreground">Account ending in 4532</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="w-full">
                                Update Payment Method
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Quick Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-xs text-muted-foreground">Total Withdrawn</p>
                                <p className="text-xl font-bold">$2,193.75</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Total Fees Paid</p>
                                <p className="text-xl font-bold text-muted-foreground">$56.25</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Withdrawal History */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Withdrawal History</h2>
                <div className="space-y-3">
                    {withdrawalHistory.map((withdrawal) => (
                        <Card key={withdrawal.id}>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-medium text-sm">Bank Transfer (****{withdrawal.accountLast4})</p>
                                                {getStatusBadge(withdrawal.status)}
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <span>Requested: {format(withdrawal.requestDate, 'MMM dd, yyyy')}</span>
                                                {withdrawal.processedDate && (
                                                    <span>Processed: {format(withdrawal.processedDate, 'MMM dd, yyyy')}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold">${withdrawal.amount.toFixed(2)}</p>
                                        <p className="text-xs text-muted-foreground">Fee: ${withdrawal.fee.toFixed(2)}</p>
                                        <p className="text-sm text-primary font-medium">Net: ${withdrawal.netAmount.toFixed(2)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WithdrawPaymentsPage;
