'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { getQCBalance, getQCPackages, getQCTransactionHistory, purchaseQC } from '@/store/reducers/creditSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wallet, Coins, TrendingUp, Clock, CheckCircle, Plus, ArrowUpRight, ArrowDownLeft, Gift } from 'lucide-react';
import { IQCPackage } from '@/store/types/credits.types';
import { format } from 'date-fns';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import SignInModal from '../auth/SignInModal';
import { toast } from 'sonner';

export const WalletPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { balance, packages, transactionHistory, loading } = useSelector((state: RootState) => state.credits);
  const { requireAuth, showSignInModal, modalConfig, handleSignInSuccess, handleSignInCancel } = useAuthGuard();

  useEffect(() => {
    dispatch(getQCBalance());
    dispatch(getQCPackages());
    dispatch(getQCTransactionHistory({ limit: 20 }));
  }, [dispatch]);

  const handlePurchase = async (pkg: IQCPackage) => {
    requireAuth(async () => {
      try {
        const result = await dispatch(purchaseQC({ planId: pkg.id })).unwrap();
        
        toast.success('Payment initiated successfully!');
        
        // Redirect to payment gateway
        if (result?.data?.paymentUrl) {
          window.location.href = result.data.paymentUrl;
        }
      } catch (error: any) {
        toast.error(error || 'Failed to initiate payment');
      }
    }, {
      customMessage: 'Please sign in to purchase Qanoon Credits',
      showBenefits: true
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case 'deduction':
        return <ArrowDownLeft className="h-4 w-4 text-red-500" />;
      case 'refund':
        return <ArrowUpRight className="h-4 w-4 text-blue-500" />;
      case 'bonus':
        return <Gift className="h-4 w-4 text-purple-500" />;
      default:
        return <Coins className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'purchase':
      case 'bonus':
        return 'text-green-600';
      case 'deduction':
        return 'text-red-600';
      case 'refund':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Qanoon Credits Wallet</h1>
        <p className="text-gray-600">Manage your credits and purchase more to access premium features</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="purchase">Buy Credits</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Balance Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wallet className="h-5 w-5" />
                <span>Current Balance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-blue-600">
                    {balance ? formatAmount(balance.balance) : '0'} QC
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Last updated: {balance ? format(new Date(), 'PPp') : 'Never'}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant={balance && balance.balance > 10 ? "default" : "secondary"}>
                    {balance && balance.balance > 10 ? "Good Balance" : "Low Balance"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">Total Purchased</span>
                </div>
                <div className="text-xl font-semibold mt-1">
                  {transactionHistory?.transactions
                    .filter(t => t.type === 'purchase')
                    .reduce((sum, t) => sum + t.qcAmount, 0) || 0} QC
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <ArrowDownLeft className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-gray-600">Total Used</span>
                </div>
                <div className="text-xl font-semibold mt-1">
                  {Math.abs(transactionHistory?.transactions
                    .filter(t => t.type === 'deduction')
                    .reduce((sum, t) => sum + t.qcAmount, 0) || 0)} QC
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Transactions</span>
                </div>
                <div className="text-xl font-semibold mt-1">
                  {transactionHistory?.totalCount || 0}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="purchase" className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Choose a Credit Package</h2>
            <p className="text-gray-600 mb-6">
              Select a package that suits your needs. Credits never expire and can be used for all premium features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <Card
                key={pkg.id}
                className={`relative ${pkg.popular ? 'ring-2 ring-blue-500' : ''}`}
              >
                {pkg.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500">
                    Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-center">{pkg.name}</CardTitle>
                  <CardDescription className="text-center">
                    {pkg.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {pkg.qcAmount} QC
                  </div>
                  <div className="text-2xl font-semibold mb-4">
                    ${pkg.price}
                  </div>

                  <ul className="text-sm text-gray-600 space-y-1 mb-6">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    onClick={() => handlePurchase(pkg)}
                    disabled={loading.purchase}
                  >
                    {loading.purchase ? 'Processing...' : 'Buy Now'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>
            <p className="text-gray-600 mb-6">
              View all your credit transactions and usage history.
            </p>
          </div>

          {loading.transactions ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-16 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : transactionHistory?.transactions.length ? (
            <div className="space-y-4">
              {transactionHistory.transactions.map((transaction) => (
                <Card key={transaction.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getTransactionIcon(transaction.type)}
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(transaction.timestamp), 'PPp')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                          {transaction.qcAmount > 0 ? '+' : ''}{formatAmount(transaction.qcAmount)} QC
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {transaction.type}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Coins className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions yet</h3>
                <p className="text-gray-600 mb-4">
                  Your transaction history will appear here once you start using Qanoon Credits.
                </p>
                <Button onClick={() => dispatch(getQCPackages())}>
                  <Plus className="h-4 w-4 mr-2" />
                  Buy Your First Credits
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

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

export default WalletPage;
