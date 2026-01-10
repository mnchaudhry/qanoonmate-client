'use client';

import PricingFAQs from "./_components/PricingFAQs";
import ConsultationService from "./_components/ConsultationService";
import ServicePricing from "./_components/ServicePricing";
import Plan from "@/components/Plan";
import LandingPageHeader from "../_components/LandingPageHeader";
import { Coins, Zap, Shield, Clock } from "lucide-react";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { getQCPackages } from "@/store/reducers/creditSlice";

export default function PricingPage() {

  const dispatch = useAppDispatch();
  const { packages } = useAppSelector(state => state.credits)

  useEffect(() => {
    dispatch(getQCPackages());
  }, [dispatch]);

  return (
    <section className="relative bg-background antialiased min-h-screen !pt-0 ">

      <LandingPageHeader
        title="Credit-Based Pricing"
        description="Pay only for what you use with our flexible credit system"
      />

      {/* Credit System Introduction */}
      <div className="py-16 bg-primary/5">
        <div className="container px-4 mx-auto md:px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Coins className="h-12 w-12 text-primary mr-3" />
              <h2 className="text-3xl font-bold">Qanoon Credits (QC)</h2>
            </div>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              Our revolutionary credit-based system lets you pay only for the legal services you actually use.
              No monthly subscriptions, no hidden fees, no waste.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <Zap className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Pay Per Use</h3>
              <p className="text-muted-foreground text-sm">
                Only pay when you use our services. No monthly commitments or unused subscriptions.
              </p>
            </div>
            <div className="text-center">
              <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Credits Never Expire</h3>
              <p className="text-muted-foreground text-sm">
                Your Qanoon Credits never expire. Use them whenever you need legal assistance.
              </p>
            </div>
            <div className="text-center">
              <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Instant Access</h3>
              <p className="text-muted-foreground text-sm">
                Get immediate access to all services as soon as you purchase credits.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Packages */}
      <div className="py-16">
        <div className="container px-4 mx-auto md:px-6">
          <div className="text-center mb-12">
            <div className="text-primary font-medium mb-2">CREDIT PACKAGES</div>
            <h2 className="text-3xl font-bold">Choose your credit package</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Select a package that fits your needs. Larger packages offer better value and savings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {packages.map((plan, index) => (
              <Plan plan={plan} key={index} />
            ))}
          </div>

        </div>
      </div>

      {/* Service Pricing */}
      <ServicePricing />

      {/* Additional Services */}
      <ConsultationService />

      {/* FAQ Section */}
      <PricingFAQs />
    </section>
  )
}

