"use client";

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { XCircle, RefreshCcw, Home, HelpCircle } from 'lucide-react';
import LandingPageNavbar from '../../(LandingPage)/_components/LandingPageNavbar';

const PaymentCancelPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const tracker = searchParams.get('tracker');

  //////////////////////////////////////////////// EFFECTS /////////////////////////////////////////////////
  useEffect(() => {
    // Log the cancellation for analytics
    console.log('Payment cancelled:', { orderId, tracker });
  }, [orderId, tracker]);

  //////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////
  const handleRetryPayment = () => {
    // Redirect to wallet or payment page to retry
    router.push('/client/wallet');
  };

  const handleGoToDashboard = () => {
    router.push('/client/dashboard');
  };

  const handleContactSupport = () => {
    router.push('/support');
  };

  //////////////////////////////////////////////// RENDER /////////////////////////////////////////////////
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <LandingPageNavbar />
      <div className="flex-1 flex items-center justify-center p-4 mt-8">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
              <XCircle className="w-10 h-10 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-2xl text-destructive">Payment Cancelled</CardTitle>
              <CardDescription className="text-base mt-2">
                Your payment transaction was not completed
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Cancellation Details */}
            {(orderId || tracker) && (
              <div className="bg-muted rounded-lg p-6 space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground">Transaction Reference</h3>
                {orderId && (
                  <div>
                    <p className="text-xs text-muted-foreground">Order ID</p>
                    <p className="font-mono text-sm font-medium">{orderId}</p>
                  </div>
                )}
                {tracker && (
                  <div>
                    <p className="text-xs text-muted-foreground">Tracker ID</p>
                    <p className="font-mono text-sm font-medium break-all">{tracker}</p>
                  </div>
                )}
              </div>
            )}

            {/* Info Alert */}
            <Alert className="bg-muted border-border">
              <AlertDescription className="text-sm">
                <strong>What happened?</strong>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>You cancelled the payment process</li>
                  <li>The payment window was closed</li>
                  <li>The transaction timed out</li>
                </ul>
              </AlertDescription>
            </Alert>

            {/* Helpful Information */}
            <div className="bg-primary/5 rounded-lg p-5 border border-primary/20">
              <div className="flex gap-3">
                <HelpCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">No charges were made</h4>
                  <p className="text-sm text-muted-foreground">
                    Don&apos;t worry! Your payment method was not charged. You can try again
                    whenever you&apos;re ready or contact support if you encountered any issues.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleRetryPayment}
                className="flex-1 gap-2"
                variant="default"
              >
                <RefreshCcw className="w-4 h-4" />
                Try Again
              </Button>
              <Button
                onClick={handleGoToDashboard}
                className="flex-1 gap-2"
                variant="outline"
              >
                <Home className="w-4 h-4" />
                Go to Dashboard
              </Button>
            </div>

            {/* Support Link */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Encountered an issue?{' '}
                <button
                  onClick={handleContactSupport}
                  className="text-primary hover:underline font-medium"
                >
                  Contact Support
                </button>
              </p>
            </div>

            {/* Common Reasons */}
            <div className="bg-surface rounded-lg p-5 border border-border">
              <h4 className="font-semibold text-sm mb-3">Common reasons for cancellation:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Payment method details were incorrect</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Insufficient funds in the account</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Session timeout during payment</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Browser or connectivity issues</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
