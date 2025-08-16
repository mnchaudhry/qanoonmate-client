import React from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"


const faqs = [
    {
        question: "Can I cancel my QanoonMate plan anytime?",
        answer:
            "Yes. You're free to cancel at any time — no hidden charges. Your plan will remain active until the end of the billing cycle."
    },
    {
        question: "Are there any hidden charges or setup fees?",
        answer:
            "None at all. What you see is what you pay. All pricing is transparent and inclusive of platform access."
    },
    {
        question: "Is the Free Plan really free?",
        answer:
            "Absolutely. The Free Plan gives you limited access to explore QanoonMate, including basic AI queries and access to legal resources."
    },
    {
        question: "Can I upgrade or downgrade my plan later?",
        answer:
            "Yes, you can switch plans at any time through your dashboard — your billing will adjust accordingly from the next cycle."
    },
    {
        question: "Do you offer student or nonprofit discounts?",
        answer:
            "Yes! We have a dedicated Student Plan, and nonprofits can contact us for customized pricing."
    },
    {
        question: "What payment methods do you accept?",
        answer:
            "We currently accept payments via credit/debit card, JazzCash, and bank transfer. More options will be added soon."
    }
]

const PricingFAQs = () => {
    return (
        <section className="py-16 bg-neutral">
            <div className="container px-4 mx-auto md:px-6">
                <div className="text-center mb-12">
                    <div className="text-primary font-medium mb-2">FREQUENTLY ASKED QUESTIONS</div>
                    <h2 className="text-3xl font-bold">Pricing Questions — Answered</h2>
                    <p className="text-muted-foreground mt-2 max-w-xl mx-auto">Here’s what you need to know before choosing a plan on QanoonMate.</p>
                </div>
                <div className="max-w-3xl mx-auto">
                    <div className="space-y-6">
                        {faqs.map((faq, index) => (
                            <Accordion key={index} type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className='font-semibold text-lg mb-2' >{faq.question}</AccordionTrigger>
                                    <AccordionContent className='text-muted-foreground' >
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PricingFAQs
