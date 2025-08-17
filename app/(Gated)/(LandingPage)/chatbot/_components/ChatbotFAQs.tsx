import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import React from 'react'

const ChatbotFAQs = () => {

    const faqs = [
        {
            question: "Is this chatbot free to use?",
            answer: "Yes, the chatbot is available for free."
        },
        {
            question: "Can the chatbot provide legal advice?",
            answer: "No, it provides informational responses based on legal references."
        },
        {
            question: "What if the chatbot can't answer my question?",
            answer: "You can contact our legal team for further assistance."
        },
        {
            question: "How does the chatbot ensure data privacy?",
            answer: "We do not store personal data or conversation history."
        },
        {
            question: "Can I use the chatbot on mobile devices?",
            answer: "Yes, the chatbot is optimized for both desktop and mobile use."
        },
        {
            question: "What languages does the chatbot support?",
            answer: "Currently, it supports English and Spanish."
        }
    ]

    return (
        <section className="mt-16">

            <h3 className="text-3xl font-semibold text-center mb-6 text-foreground">Frequently Asked Questions</h3>
            <p className="text-base text-muted-foreground mb-6 max-w-2xl mx-auto text-center ">
                Have questions? We have answers! Check out our FAQs to learn more about how our chatbot can assist you with your legal inquiries.
            </p>

            <div className="space-y-2">
                {faqs.map((item, index) => (
                    <Accordion key={index} type="single" collapsible>
                        <AccordionItem value={`item-${index}`}>
                            <AccordionTrigger className="text-left text-lg text-foreground">{item.question}</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
                        </AccordionItem>
                    </Accordion>
                ))}
            </div>
        </section>
    )
}

export default ChatbotFAQs