import { CheckIcon, MoveRight, PhoneCall } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SectionHeading from "./SectionHeading";
import { pricingPlans } from "@/constants";

function Pricing() {
  return (
    <section className="bg-neutral py-24 !px-4">
      <div className="container mx-auto flex text-center justify-center items-center gap-4 flex-col">

        <SectionHeading
          title='OUR PRICING'
          topTitle='Choose the plan that works for you'
          description='We offer flexible pricing options to meet your specific needs. All plans include access to our platform and basic legal resources.'
        />

        <div className="grid text-left grid-cols-1 lg:grid-cols-3 w-full gap-8">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`w-full rounded-md ${plan.popular ? "shadow-2xl" : ""}`}
            >
              <CardHeader>
                <CardTitle>
                  <span className="flex flex-row gap-4 items-center font-normal">
                    {plan.name}
                  </span>
                </CardTitle>
                <CardDescription>
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-8 justify-start">
                  <p className="flex flex-row items-center gap-2 text-xl">
                    <span className="text-4xl">Rs. {plan.price}</span>
                    <span className="text-sm text-muted-foreground">/ month</span>
                  </p>
                  <div className="flex flex-col gap-4 justify-start">
                    {plan.features.map((feature: string, idx: number) => (
                      <div className="flex flex-row gap-4" key={idx}>
                        <CheckIcon className="w-4 h-4 mt-1 text-primary" />
                        <p className="text-muted-foreground">{feature}</p>
                      </div>
                    ))}
                  </div>
                  {plan.name.includes("Organization") ? (
                    <Button variant="outline" className="gap-4">
                      Book a meeting <PhoneCall className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      className="gap-4"
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Sign up today <MoveRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export { Pricing };
