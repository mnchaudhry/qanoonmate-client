'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { servicePricing } from '@/constants';
import { creditsAPI } from '@/store/api/credits';

const ServicePricing: React.FC = () => {
  const [pricing, setPricing] = useState(servicePricing);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServicePricing = async () => {
      try {
        const apiPricing = await creditsAPI.getServicePricing();
        setPricing(apiPricing);
      } catch (error) {
        console.error('Failed to fetch service pricing:', error);
        // Fallback to static pricing
        setPricing(servicePricing);
      } finally {
        setLoading(false);
      }
    };

    fetchServicePricing();
  }, []);
  return (
    <div className="py-16 bg-neutral">
      <div className="container px-4 mx-auto md:px-6">
        <div className="text-center mb-12">
          <div className="text-primary font-medium mb-2">SERVICE PRICING</div>
          <h2 className="text-3xl font-bold mb-4">Pay only for what you use</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our credit-based system ensures you only pay for the services you actually use. 
            No monthly subscriptions, no hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pricing.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">{service.icon}</div>
                <CardTitle className="text-lg">{service.service}</CardTitle>
                <CardDescription className="text-primary font-semibold text-xl">
                  {service.price}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center text-sm">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-primary/10 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-2">How it works</h3>
            <p className="text-muted-foreground">
              Purchase Qanoon Credits (QC) and use them as needed. Credits never expire, 
              and you can buy more anytime. Start with our Starter Package or buy credits 
              individually as you need them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePricing;
