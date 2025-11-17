"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { getQCBalance, getQCPackages, getQCTransactionHistory, purchaseQC } from '@/store/reducers/creditSlice';
import { Card, CardContent } from '@/components/ui/card';
import { IQCPackage } from '@/store/types/credits.types';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import SignInModal from '@/components/auth/SignInModal';
import { toast } from 'sonner';
import DashboardPageHeader from '@/components/DashboardPageHeader';
import { BalanceCard } from '@/app/(Gated)/(Client)/client/wallet/_components/BalanceCard';
import { QuickStats } from '@/app/(Gated)/(Client)/client/wallet/_components/QuickStats';
import { CreditPackageCard } from '@/app/(Gated)/(Client)/client/wallet/_components/CreditPackageCard';
import { TransactionItem } from '@/app/(Gated)/(Client)/client/wallet/_components/TransactionItem';
import { EmptyTransactions } from '@/app/(Gated)/(Client)/client/wallet/_components/EmptyTransactions';

const LawyerWalletPage = () => {

    //////////////////////////////////////////////// VARIABLES //////////////////////////////////////////////////
    const dispatch = useDispatch<AppDispatch>();
    const { balance, packages, transactionHistory } = useSelector((state: RootState) => state.credits);
    const { requireAuth, showSignInModal, modalConfig, handleSignInSuccess, handleSignInCancel } = useAuthGuard();

    //////////////////////////////////////////////// STATES //////////////////////////////////////////////
    const [loading, setLoading] = useState({ purchase: false, transactions: false });

    //////////////////////////////////////////////// EFFECTS //////////////////////////////////////////////////
    useEffect(() => {
        dispatch(getQCBalance());
        dispatch(getQCPackages());
        dispatch(getQCTransactionHistory({ limit: 10 }));
    }, [dispatch]);

    //////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////////
    const handlePurchase = async (pkg: IQCPackage) => {
        requireAuth(async () => {
            try {
                setLoading(prev => ({ ...prev, purchase: true }));
                await dispatch(purchaseQC({ planId: pkg.id })).unwrap()
                    .then((result) => {
                        toast.success('Payment initiated successfully!');
                        if (result?.data?.paymentUrl) {
                            window.location.href = result.data.paymentUrl;
                        }
                    })
                    .finally(() => setLoading(pre => ({ ...pre, purchase: false })))
            } catch (error: any) {
                toast.error(error || 'Failed to initiate payment');
            }
        }, {
            customMessage: 'Please sign in to purchase Qanoon Credits',
            showBenefits: true
        });
    };

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(Math.abs(amount));
    };

    const stats = useMemo(() => {
        const totalPurchased = transactionHistory?.transactions
            .filter(t => t.type === 'purchase')
            .reduce((sum, t) => sum + t.qcAmount, 0) || 0;

        const totalUsed = Math.abs(transactionHistory?.transactions
            .filter(t => t.type === 'deduction')
            .reduce((sum, t) => sum + t.qcAmount, 0) || 0);

        return { totalPurchased, totalUsed };
    }, [transactionHistory]);

    //////////////////////////////////////////////// RENDER //////////////////////////////////////////////////
    return (
        <div className="space-y-6">
            <DashboardPageHeader
                title="QC Wallet"
                description="Manage your Qanoon Credits to access premium AI features and legal research tools."
            />

            {/* Balance and Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <BalanceCard
                    balance={balance?.balance || 0}
                    formatAmount={formatAmount}
                />
                <QuickStats
                    totalPurchased={stats.totalPurchased}
                    totalUsed={stats.totalUsed}
                />
            </div>

            {/* Credit Packages */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Purchase Credits</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {packages.map((pkg) => (
                        <CreditPackageCard
                            key={pkg.id}
                            pkg={pkg}
                            onPurchase={handlePurchase}
                            loading={loading.purchase}
                        />
                    ))}
                </div>
            </div>

            {/* Recent Transactions */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Recent Credit Transactions</h2>
                {loading.transactions ? (
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <Card key={i} className="animate-pulse">
                                <CardContent className="p-4">
                                    <div className="h-12 bg-muted rounded"></div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : transactionHistory?.transactions.length ? (
                    <div className="space-y-3">
                        {transactionHistory.transactions.slice(0, 5).map((transaction) => (
                            <TransactionItem
                                key={transaction.id}
                                transaction={transaction}
                                formatAmount={formatAmount}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyTransactions />
                )}
            </div>

            {/* Sign In Modal */}
            <SignInModal
                isOpen={showSignInModal}
                onClose={handleSignInCancel}
                onSuccess={handleSignInSuccess}
                title={modalConfig.title}
                description={modalConfig.description}
                showBenefits={modalConfig.showBenefits}
            />
        </div>
    );
};

export default LawyerWalletPage;
