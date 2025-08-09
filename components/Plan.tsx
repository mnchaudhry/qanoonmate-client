import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import React from 'react'

const Plan = ({ plan }: { plan: any }) => {
    return (
        <div className={`relative p-8 rounded-lg border shadow-sm hover:shadow-xl ${plan.popular ? "bg-primary/5 border-primary shadow-md" : "bg-neutral !border-border"}`}>
            {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary text-neutral text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                    POPULAR
                </div>
            )}
            <div className="text-center mb-6">
                <h3 className="font-bold text-xl mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold mb-2">
                    Rs. {plan.price}
                    <span className="text-lg text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
            </div>
            <ul className="space-y-4 mb-6">
                {plan.features.map((feature: string, idx: number) => (
                    <li className="flex items-start" key={idx}>
                        <Check className="text-primary h-5 w-5 mr-2 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                    </li>
                ))}
            </ul>
            <Button className="w-full py-2.5 ">Get Started</Button>
        </div>
    )
}

export default Plan