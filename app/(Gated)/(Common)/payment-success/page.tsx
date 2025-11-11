"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Loader2, Receipt } from 'lucide-react';

const PaymentSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [error, setError] = useState<string>('');

  //////////////////////////////////////////////// EFFECTS /////////////////////////////////////////////////
  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const tracker = searchParams.get('tracker');
        const orderId = searchParams.get('order_id');

        if (!tracker) {
          setError('Payment verification failed: Missing tracker token');
          setIsVerifying(false);
          return;
        }

        // Here you would call your backend to verify the payment
        // For now, we'll simulate a successful verification
        setTimeout(() => {
          setPaymentDetails({
            orderId: orderId || 'N/A',
            tracker,
            amount: 'PKR 5,000', // This should come from your backend
            timestamp: new Date().toLocaleString(),
          });
          setIsVerifying(false);
        }, 2000);

      } catch (err: any) {
        setError(err.message || 'Payment verification failed');
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  //////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////
  const handleDownloadReceipt = () => {
    // Implement receipt download logic
    console.log('Downloading receipt...');
  };

  const handleViewTransactions = () => {
    router.push('/client/payments');
  };

  const handleGoToDashboard = () => {
    router.push('/client/dashboard');
  };

  //////////////////////////////////////////////// RENDER /////////////////////////////////////////////////
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-muted-foreground text-center">
              Verifying your payment...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Payment Verification Failed</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Alert variant="destructive">
              <AlertDescription>
                If you believe this is an error, please contact support with your transaction reference.
              </AlertDescription>
            </Alert>
            <Button onClick={handleGoToDashboard} className="w-full">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl text-primary">Payment Successful!</CardTitle>
            <CardDescription className="text-base mt-2">
              Your payment has been processed successfully
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Payment Details */}
          <div className="bg-muted rounded-lg p-6 space-y-4">
            <h3 className="font-semibold text-lg">Transaction Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-mono text-sm font-medium">{paymentDetails?.orderId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Amount Paid</p>
                <p className="font-semibold text-lg text-primary">{paymentDetails?.amount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Transaction ID</p>
                <p className="font-mono text-sm font-medium break-all">{paymentDetails?.tracker}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date & Time</p>
                <p className="text-sm font-medium">{paymentDetails?.timestamp}</p>
              </div>
            </div>
          </div>

          {/* Success Message */}
          <Alert className="bg-primary/10 border-primary/20">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm">
              A confirmation email has been sent to your registered email address. 
              Your QC credits have been updated in your wallet.
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={handleDownloadReceipt}
              className="flex-1 gap-2"
            >
              <Receipt className="w-4 h-4" />
              Download Receipt
            </Button>
            <Button
              variant="outline"
              onClick={handleViewTransactions}
              className="flex-1 gap-2"
            >
              View Transactions
            </Button>
            <Button
              onClick={handleGoToDashboard}
              className="flex-1"
            >
              Go to Dashboard
            </Button>
          </div>

          {/* Additional Info */}
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Need help? Contact our{' '}
              <button
                onClick={() => router.push('/support')}
                className="text-primary hover:underline font-medium"
              >
                support team
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccessPage;
