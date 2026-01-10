"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { IQCPackage } from '@/store/types/credits.types';

interface CreditPackageCardProps {
  pkg: IQCPackage;
  onPurchase: (pkg: IQCPackage) => void;
  loading: boolean;
}

export const CreditPackageCard: React.FC<CreditPackageCardProps> = ({ pkg, onPurchase, loading }) => {
  return (
    <Card
      className={`relative hover:shadow-lg transition-shadow ${pkg.popular ? 'border-primary' : ''}`}
    >
      {pkg.popular && (
        <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
          Most Popular
        </Badge>
      )}
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-lg">{pkg.name}</CardTitle>
        <CardDescription className="text-xs">{pkg.description}</CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div>
          <div className="text-3xl font-bold text-primary mb-1">
            {pkg.qcAmount} QC
          </div>
          <div className="text-xl font-semibold text-foreground">
            ${pkg.price}
          </div>
        </div>

        {pkg.features && pkg.features.length > 0 && (
          <ul className="text-xs text-muted-foreground space-y-1.5 text-left">
            {pkg.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}

        <Button
          className="w-full"
          onClick={() => onPurchase(pkg)}
          disabled={loading}
          variant={pkg.popular ? "default" : "outline"}
        >
          {loading ? 'Processing...' : 'Purchase'}
        </Button>
      </CardContent>
    </Card>
  );
};
