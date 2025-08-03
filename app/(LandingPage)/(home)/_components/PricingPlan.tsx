import Plan from '@/components/Plan'
import { pricingPlans } from '@/constants'
import React from 'react'
import SectionHeading from './SectionHeading'
import { Button } from '@/components/ui/button'

const PricingPlans = () => {


    return (
        <section className="bg-neutral">

            <div className="container px-4 mx-auto max-w-7xl md:px-6 flex flex-col">

                <SectionHeading
                    title='OUR PRICING'
                    topTitle='Choose the plan that works for you'
                    description='We offer flexible pricing options to meet your specific needs. All plans include access to our platform and basic legal resources.'
                />


                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {pricingPlans.slice(0, 3).map((plan, index) => (
                        <Plan plan={plan} key={index} />
                    ))}
                </div>

                <Button className='mt-8 w-fit mx-auto' >
                    View more plans
                </Button>

            </div>

        </section>
    )
}

export default PricingPlans
