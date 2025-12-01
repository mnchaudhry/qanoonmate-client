"use client";

import dynamic from 'next/dynamic';
const ReceiptComponent = dynamic(() => import('@/components/Receipt'), { ssr: false });

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { XCircle } from 'lucide-react';
import LandingPageNavbar from '../../(LandingPage)/_components/LandingPageNavbar';

const PaymentFailedPage = () => {

    ///////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////
    const router = useRouter();
    const searchParams = useSearchParams();

    ///////////////////////////////////////////// STATES /////////////////////////////////////////////////
    const [errorDetails, setErrorDetails] = useState<any>(null);

    ///////////////////////////////////////////// EFFECTS /////////////////////////////////////////////////
    useEffect(() => {
        const tracker = searchParams.get('tracker');
        const orderId = searchParams.get('order_id');
        const reason = searchParams.get('reason');

        setErrorDetails({
            tracker: tracker || 'N/A',
            orderId: orderId || 'N/A',
            reason: reason || 'Payment was not completed. Please try again.'
        });
    }, [searchParams]);

    ///////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////
    const handleRetryPayment = () => {
        // Redirect to payments or checkout page — adjust to your app flow
        router.push('/client/payments');
    };

    const handleViewTransactions = () => router.push('/client/payments');
    const handleContactSupport = () => router.push('/support');

    ///////////////////////////////////////////// RENDER /////////////////////////////////////////////////
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
                            <CardTitle className="text-2xl text-destructive">Payment Failed</CardTitle>
                            <CardDescription className="text-base mt-2">We couldn&apos;t process your payment.</CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div id="receipt-failed-printable">
                            <ReceiptComponent
                                paymentDetails={{
                                    orderId: errorDetails?.orderId,
                                    tracker: errorDetails?.tracker,
                                    amount: 'Payment Failed',
                                    timestamp: new Date().toLocaleString(),
                                    payerName: 'You',
                                }} />
                            <div className="mt-2 text-sm text-destructive">Reason: {errorDetails?.reason}</div>
                        </div>

                        <Alert variant="destructive">
                            <AlertDescription>
                                Please check your payment method and try again. If the issue persists, contact support with the transaction details shown above.
                            </AlertDescription>
                        </Alert>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button onClick={handleRetryPayment} className="flex-1">Retry Payment</Button>
                            <Button variant="outline" onClick={handleViewTransactions} className="flex-1">View Transactions</Button>
                            <Button variant="ghost" onClick={handleContactSupport} className="flex-1">Contact Support</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PaymentFailedPage;
