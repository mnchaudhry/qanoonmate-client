import PricingFAQs from "./_components/PricingFAQs";
import ConsultationService from "./_components/ConsultationService";
import Plan from "@/components/Plan";
import { pricingPlans } from "@/constants";
import LandingPageHeader from "../_components/LandingPageHeader";

export default function PricingPage() {

  return (
    <section className="relative bg-background antialiased min-h-screen !pt-0 ">

      <LandingPageHeader
        title="Pricing Plans"
        description="Transparent pricing for all your legal needs"
      />

      {/* Pricing Plans */}
      <div className="py-16">
        <div className="container px-4 mx-auto md:px-6">
          <div className="text-center mb-12">
            <div className="text-primary font-medium mb-2">OUR PRICING</div>
            <h2 className="text-3xl font-bold">Choose the plan that works for you</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              We offer flexible pricing options to meet your specific needs. All plans include access to our platform
              and basic legal resources.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {pricingPlans.map((plan, index) => (
              <Plan plan={plan} key={index} />
            ))}
          </div>

        </div>
      </div>

      {/* Additional Services */}
      <ConsultationService />

      {/* FAQ Section */}
      <PricingFAQs />
    </section>
  )
}

