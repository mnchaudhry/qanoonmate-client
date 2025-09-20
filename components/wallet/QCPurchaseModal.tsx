'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, CreditCard, User, MapPin, Phone, Mail, AlertCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { purchaseQC } from '@/store/reducers/credits';
import { QCPackage } from '@/store/types/credits.types';
import { PaymentMethod } from '@/lib/enums';
import { toast } from 'react-hot-toast';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import SignInModal from '@/components/auth/SignInModal';

interface QCPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  package: QCPackage | null;
}

interface BillingDetails {
  name: string;
  email: string;
  phone: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export const QCPurchaseModal: React.FC<QCPurchaseModalProps> = ({
  isOpen,
  onClose,
  package: pkg
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, balance } = useSelector((state: RootState) => state.credits);
  const { user } = useSelector((state: RootState) => state.auth);
  const { requireAuth, showSignInModal, modalConfig, handleSignInSuccess, handleSignInCancel } = useAuthGuard();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.STRIPE);
  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
    name: '',
    email: '',
    phone: '',
    address: { line1: '', line2: '', city: '', state: '', postalCode: '', country: 'Pakistan' }
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      const fullName = `${user.firstname || ''} ${user.lastname || ''}`.trim();
      setBillingDetails(prev => ({ ...prev, name: fullName || '', email: user.email || '', phone: user.phone || '' }));
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!billingDetails.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!billingDetails.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(billingDetails.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!billingDetails.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!billingDetails.address.line1.trim()) {
      newErrors.line1 = 'Address is required';
    }
    if (!billingDetails.address.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!billingDetails.address.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!billingDetails.address.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePurchase = async () => {
    if (!pkg || !validateForm()) {
      return;
    }

    // Require authentication before proceeding with purchase
    requireAuth(async () => {
      try {
        const result = await dispatch(purchaseQC({
          qcAmount: pkg.qcAmount,
          paymentMethod,
          billingDetails: {
            name: billingDetails.name,
            email: billingDetails.email,
            phone: billingDetails.phone,
            address: billingDetails.address
          }
        })).unwrap();

        toast.success('Payment initiated successfully!');
        
        // If there's a payment URL, redirect to it
        if (result.paymentUrl) {
          window.location.href = result.paymentUrl;
        } else {
          // Refresh balance and close modal
          dispatch({ type: 'credits/fetchBalance' });
          onClose();
        }
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
    }).format(amount);
  };

  if (!pkg) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Coins className="h-5 w-5 text-yellow-500" />
            <span>Purchase Qanoon Credits</span>
          </DialogTitle>
          <DialogDescription>
            Complete your purchase to add {pkg.qcAmount} QC to your wallet
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Package Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{pkg.name}</span>
                {pkg.popular && (
                  <Badge className="bg-blue-500">Most Popular</Badge>
                )}
              </CardTitle>
              <CardDescription>{pkg.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {pkg.qcAmount} QC
                  </div>
                  <div className="text-sm text-gray-600">Credits</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    ${pkg.price}
                  </div>
                  <div className="text-sm text-gray-600">One-time payment</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label htmlFor="paymentMethod" className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>Payment Method</span>
            </Label>
            <Select value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PaymentMethod.STRIPE}>Credit/Debit Card (Stripe)</SelectItem>
                <SelectItem value={PaymentMethod.JAZZCASH}>JazzCash</SelectItem>
                <SelectItem value={PaymentMethod.EASYPAISA}>EasyPaisa</SelectItem>
                <SelectItem value={PaymentMethod.BANK_TRANSFER}>Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Billing Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Billing Information</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={billingDetails.name}
                  onChange={(e) => setBillingDetails(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center space-x-1">
                  <Mail className="h-3 w-3" />
                  <span>Email *</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={billingDetails.email}
                  onChange={(e) => setBillingDetails(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center space-x-1">
                  <Phone className="h-3 w-3" />
                  <span>Phone Number *</span>
                </Label>
                <Input
                  id="phone"
                  value={billingDetails.phone}
                  onChange={(e) => setBillingDetails(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.phone}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select
                  value={billingDetails.address.country}
                  onValueChange={(value) => setBillingDetails(prev => ({
                    ...prev,
                    address: { ...prev.address, country: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pakistan">Pakistan</SelectItem>
                    <SelectItem value="India">India</SelectItem>
                    <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-md font-medium flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Address</span>
              </h4>

              <div className="space-y-2">
                <Label htmlFor="line1">Address Line 1 *</Label>
                <Input
                  id="line1"
                  value={billingDetails.address.line1}
                  onChange={(e) => setBillingDetails(prev => ({
                    ...prev,
                    address: { ...prev.address, line1: e.target.value }
                  }))}
                  placeholder="Street address, P.O. box, company name"
                />
                {errors.line1 && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.line1}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="line2">Address Line 2</Label>
                <Input
                  id="line2"
                  value={billingDetails.address.line2}
                  onChange={(e) => setBillingDetails(prev => ({
                    ...prev,
                    address: { ...prev.address, line2: e.target.value }
                  }))}
                  placeholder="Apartment, suite, unit, building, floor, etc."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={billingDetails.address.city}
                    onChange={(e) => setBillingDetails(prev => ({
                      ...prev,
                      address: { ...prev.address, city: e.target.value }
                    }))}
                    placeholder="City"
                  />
                  {errors.city && (
                    <p className="text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.city}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State/Province *</Label>
                  <Input
                    id="state"
                    value={billingDetails.address.state}
                    onChange={(e) => setBillingDetails(prev => ({
                      ...prev,
                      address: { ...prev.address, state: e.target.value }
                    }))}
                    placeholder="State"
                  />
                  {errors.state && (
                    <p className="text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.state}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code *</Label>
                  <Input
                    id="postalCode"
                    value={billingDetails.address.postalCode}
                    onChange={(e) => setBillingDetails(prev => ({
                      ...prev,
                      address: { ...prev.address, postalCode: e.target.value }
                    }))}
                    placeholder="Postal code"
                  />
                  {errors.postalCode && (
                    <p className="text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.postalCode}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Current Balance */}
          {balance && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Current Balance:</span>
                <span className="font-semibold text-blue-600">
                  {formatAmount(balance.balance)} QC
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm text-gray-600">After Purchase:</span>
                <span className="font-semibold text-green-600">
                  {formatAmount(balance.balance + pkg.qcAmount)} QC
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row space-y-2 sm:space-y-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading.purchase}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            onClick={handlePurchase}
            disabled={loading.purchase}
            className="w-full sm:w-auto"
          >
            {loading.purchase ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Pay ${pkg.price}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Sign In Modal */}
      <SignInModal
        isOpen={showSignInModal}
        onClose={handleSignInCancel}
        onSuccess={handleSignInSuccess}
        title={modalConfig.title}
        description={modalConfig.description}
        showBenefits={modalConfig.showBenefits}
      />
    </Dialog>
  );
};

export default QCPurchaseModal;
