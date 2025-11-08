'use client';

import { CheckIcon, Coins, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SectionHeading from "./SectionHeading";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getQCPackages } from "@/store/reducers/creditSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";

function Pricing() {

  /////////////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////// 
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { packages } = useAppSelector(state => state.credits)

  /////////////////////////////////////////////////////// STATES /////////////////////////////////////////////////////// 

  /////////////////////////////////////////////////////// EFFECTS /////////////////////////////////////////////////////// 
  useEffect(() => {
    dispatch(getQCPackages())
  }, [dispatch]);

  const handlePurchase = () => {
    router.push('/wallet');
  };

  /////////////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////// 
  return (
    <section className="bg-neutral py-24 !px-4">
      <div className="container mx-auto flex text-center justify-center items-center gap-4 flex-col">

        <SectionHeading
          title='CREDIT-BASED PRICING'
          topTitle='Pay only for what you use'
          description='Our revolutionary credit system ensures you only pay for the legal services you actually use. No monthly subscriptions, no hidden fees.'
        />

        <div className="grid text-left grid-cols-1 lg:grid-cols-3 w-full gap-8">
          {packages.map((plan) => (
            <Card
              key={plan.name}
              className={`w-full rounded-md ${plan.popular ? "shadow-2xl border-primary" : ""}`}
            >
              <CardHeader>
                <CardTitle>
                  <span className="flex flex-row gap-4 items-center font-normal">
                    <Coins className="h-5 w-5 text-primary" />
                    {plan.name}
                  </span>
                </CardTitle>
                <CardDescription>
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-8 justify-start">
                  <div className="flex flex-col gap-2">
                    <p className="flex flex-row items-center gap-2 text-xl">
                      <span className="text-4xl text-primary font-bold">{plan.qcAmount} QC</span>
                    </p>
                    <p className="flex flex-row items-center gap-2 text-lg">
                      <span className="text-2xl font-semibold">${plan.price}</span>
                      <span className="text-sm text-muted-foreground">one-time</span>
                    </p>
                    {plan.savings && (
                      <span className="text-sm text-green-600 font-medium">{plan.savings}</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-4 justify-start">
                    {plan.features.map((feature: string, idx: number) => (
                      <div className="flex flex-row gap-4" key={idx}>
                        <CheckIcon className="w-4 h-4 mt-1 text-primary" />
                        <p className="text-muted-foreground text-sm">{feature}</p>
                      </div>
                    ))}
                  </div>
                  <Button
                    className="gap-4"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={handlePurchase}
                  >
                    <Zap className="w-4 h-4" />
                    Purchase Credits
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center max-w-2xl">
          <div className="bg-primary/10 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">How Qanoon Credits Work</h3>
            <p className="text-muted-foreground">
              Purchase credits and use them as needed. Credits never expire and you can buy more anytime.
              Start with our Starter Package or buy credits individually as you need them.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export { Pricing };