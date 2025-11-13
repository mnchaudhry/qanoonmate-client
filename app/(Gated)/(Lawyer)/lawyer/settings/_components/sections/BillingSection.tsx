"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Plus, Trash2, Download, Calendar, DollarSign, Eye, EyeOff } from "lucide-react";
import { LawyerProfile, ProfileCompletionData } from "@/lib/types/profile.types";
import { SubsectionHeader } from "./SubsectionHeader";

interface BillingSectionProps {
  profile: LawyerProfile;
  completion: ProfileCompletionData;
  onUpdate: (updatedProfile: Partial<LawyerProfile>) => void;
}

const PAYMENT_METHODS = [
  { id: '1', type: 'visa', last4: '4242', expiry: '12/25', isDefault: true },
  { id: '2', type: 'mastercard', last4: '5555', expiry: '08/26', isDefault: false },
];

const BILLING_HISTORY = [
  { id: '1', date: '2024-01-15', description: 'Premium Plan - January 2024', amount: 29.99, status: 'paid' },
  { id: '2', date: '2023-12-15', description: 'Premium Plan - December 2023', amount: 29.99, status: 'paid' },
  { id: '3', date: '2023-11-15', description: 'Premium Plan - November 2023', amount: 29.99, status: 'paid' },
];

export function BillingSection({ }: BillingSectionProps) {
  const [form, setForm] = useState({
    billingAddress: {
      company: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Pakistan',
    },
    taxId: '',
    invoiceEmail: '',
  });

  const [paymentMethods, setPaymentMethods] = useState(PAYMENT_METHODS);
  const [billingHistory] = useState(BILLING_HISTORY);
  const [loading, setLoading] = useState(false);
  const [showTaxId, setShowTaxId] = useState(false);

  const setField = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const setBillingField = (field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      billingAddress: {
        ...prev.billingAddress,
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Implement billing settings update
      console.log('Billing settings updated:', form);

    } catch (error) {
      console.error('Error saving billing settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPaymentMethod = () => {
    // TODO: Implement add payment method
    console.log('Add payment method');
  };

  const handleRemovePaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
  };

  const handleSetDefaultPaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
  };

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'visa': return '💳';
      case 'mastercard': return '💳';
      case 'amex': return '💳';
      default: return '💳';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-amber-600 bg-amber-50';
      case 'failed': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <CreditCard className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Billing & Payments</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage your billing information and payment methods</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Payment Methods */}
        <Card>
          <CardHeader className="pb-4">
            <SubsectionHeader 
              title="Payment Methods"
              description="Manage your payment methods"
            />
          </CardHeader>
          <CardContent className="space-y-4">{paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getPaymentMethodIcon(method.type)}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground capitalize">
                            {method.type} •••• {method.last4}
                          </h4>
                          {method.isDefault && (
                            <Badge variant="outline" className="text-xs">Default</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">Expires {method.expiry}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!method.isDefault && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefaultPaymentMethod(method.id)}
                        >
                          Set Default
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePaymentMethod(method.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <Button
                  onClick={handleAddPaymentMethod}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Payment Method
                </Button>
          </CardContent>
        </Card>

        {/* Billing Information */}
        <Card>
          <CardHeader className="pb-4">
            <SubsectionHeader 
              title="Billing Information"
              description="Update your billing details"
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">{/* prettier-ignore */}
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    value={form.billingAddress.company}
                    onChange={(e) => setBillingField('company', e.target.value)}
                    placeholder="Enter company name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Billing Address</Label>
                  <Input
                    id="address"
                    value={form.billingAddress.address}
                    onChange={(e) => setBillingField('address', e.target.value)}
                    placeholder="Enter billing address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={form.billingAddress.city}
                      onChange={(e) => setBillingField('city', e.target.value)}
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      value={form.billingAddress.state}
                      onChange={(e) => setBillingField('state', e.target.value)}
                      placeholder="Enter state"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                    <Input
                      id="zipCode"
                      value={form.billingAddress.zipCode}
                      onChange={(e) => setBillingField('zipCode', e.target.value)}
                      placeholder="Enter ZIP code"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select value={form.billingAddress.country} onValueChange={(value) => setBillingField('country', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pakistan">Pakistan</SelectItem>
                        <SelectItem value="India">India</SelectItem>
                        <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                        <SelectItem value="United States">United States</SelectItem>
                        <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID / NTN</Label>
                  <div className="relative">
                    <Input
                      id="taxId"
                      type={showTaxId ? "text" : "password"}
                      value={form.taxId}
                      onChange={(e) => setField('taxId', e.target.value)}
                      placeholder="Enter tax ID"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                      onClick={() => setShowTaxId(!showTaxId)}
                    >
                      {showTaxId ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invoiceEmail">Invoice Email</Label>
                  <Input
                    id="invoiceEmail"
                    type="email"
                    value={form.invoiceEmail}
                    onChange={(e) => setField('invoiceEmail', e.target.value)}
                    placeholder="Enter email for invoices"
                  />
                </div>
          </CardContent>
        </Card>

        {/* Billing History */}
        <Card>
          <CardHeader className="pb-4">
            <SubsectionHeader 
              title="Billing History"
              description="View your transaction history"
            />
          </CardHeader>
          <CardContent className="space-y-3">
            {billingHistory.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{invoice.description}</h4>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">{invoice.date}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-foreground">${invoice.amount}</span>
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
          </CardContent>
        </Card>

        {/* Billing Tips */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <h4 className="font-medium text-primary mb-2">💳 Billing Tips</h4>
          <ul className="text-sm text-primary/80 space-y-1">
            <li>• Keep your billing information up to date for seamless payments</li>
            <li>• Set up automatic payments to avoid service interruptions</li>
            <li>• Download invoices for your tax records</li>
            <li>• Contact support if you have billing questions</li>
          </ul>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <Button
            onClick={handleSave}
            disabled={loading}
            size="lg"
            className="bg-primary hover:bg-primary/90"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
