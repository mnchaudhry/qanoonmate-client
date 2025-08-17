import { PlusCircle, MinusCircle } from 'lucide-react'
import React, { useState } from 'react'

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)

    const faqs = [
        {
            question: 'What is QanoonMate?',
            answer:
                'QanoonMate is an AI-powered legal solution offering resources like legal guides, templates, summaries, and direct access to professional legal consultations.',
        },
        {
            question: 'How can I use AI-Assisted Legal Query Support?',
            answer:
                'Simply input your legal query into our AI chatbot. It will analyze your request and provide helpful insights or direct you to relevant legal resources.',
        },
        {
            question: 'What are the subscription plans?',
            answer:
                'We offer three plans: Basic (Free), Pro ($19.99/month), and Unlimited ($49.99/month). Each plan has different levels of access to our features and services.',
        },
        {
            question: 'Can I consult a lawyer on the platform?',
            answer:
                'Yes, you can book a consultation with verified lawyers through our platform. You can choose the mode (in-person, phone, video) and make secure payments.',
        },
    ]

    const toggleFAQ = (index: number) => {
        if (activeIndex === index) {
            setActiveIndex(null)
        } else {
            setActiveIndex(index)
        }
    }

    return (
        <section className="py-16 bg-gray-50">
            <div className="container px-4 mx-auto md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
                    <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
                        Find answers to some of the most common questions about QanoonMate and its services.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-neutral shadow-md rounded-lg">
                            <button
                                className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                                onClick={() => toggleFAQ(index)}
                            >
                                <h3 className="text-xl font-semibold text-gray-800">{faq.question}</h3>
                                {activeIndex === index ? (
                                    <MinusCircle className="text-primary w-6 h-6" />
                                ) : (
                                    <PlusCircle className="text-muted-foreground w-6 h-6" />
                                )}
                            </button>
                            {activeIndex === index && (
                                <div className="p-6 text-muted-foreground">
                                    <p>{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FAQ
