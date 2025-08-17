import { Check } from 'lucide-react'
import React from 'react'

const HowItWorks = () => {
    return (
        <section className="">

            <h3 className="text-3xl font-semibold text-center mb-6 text-foreground">How It Works</h3>
            <p className="text-base text-muted-foreground mb-6 max-w-2xl mx-auto text-center ">
                Our chatbot is designed to make legal information accessible and easy to understand. Here’s how it works:
            </p>

            <div className="max-w-4xl mx-auto">
                <ol className="space-y-8">
                    <li className="flex items-start space-x-4 p-4 border-l-4 border-primary-600 hover:bg-primary-50 transition-all">
                        <div className="flex-shrink-0">
                            <Check className="h-8 w-8 text-primary-600" />
                        </div>
                        <div className="text-lg font-semibold text-foreground">
                            <p>Ask your legal question in simple terms.</p>
                            <p className="text-sm text-muted-foreground mt-2">Our chatbot understands everyday language, making it easy for you to ask questions without any legal jargon.</p>
                        </div>
                    </li>
                    <li className="flex items-start space-x-4 p-4 border-l-4 border-primary-600 hover:bg-primary-50 transition-all">
                        <div className="flex-shrink-0">
                            <Check className="h-8 w-8 text-primary-600" />
                        </div>
                        <div className="text-lg font-semibold text-foreground">
                            <p>Get an immediate response with relevant legal information.</p>
                            <p className="text-sm text-muted-foreground mt-2">The chatbot pulls from a vast database of legal knowledge to give you answers, citations, and references in real-time.</p>
                        </div>
                    </li>
                    <li className="flex items-start space-x-4 p-4 border-l-4 border-primary-600 hover:bg-primary-50 transition-all">
                        <div className="flex-shrink-0">
                            <Check className="h-8 w-8 text-primary-600" />
                        </div>
                        <div className="text-lg font-semibold text-foreground">
                            <p>Adjust the chatbot’s tone or language preference to suit your needs.</p>
                            <p className="text-sm text-muted-foreground mt-2">You can choose a casual or formal tone, or switch to a language that suits you best.</p>
                        </div>
                    </li>
                    <li className="flex items-start space-x-4 p-4 border-l-4 border-primary-600 hover:bg-primary-50 transition-all">
                        <div className="flex-shrink-0">
                            <Check className="h-8 w-8 text-primary-600" />
                        </div>
                        <div className="text-lg font-semibold text-foreground">
                            <p>Review laws, cases, or documentation referenced by the chatbot.</p>
                            <p className="text-sm text-muted-foreground mt-2">If you need more detailed information, the chatbot will link you to related laws or cases for further reading.</p>
                        </div>
                    </li>
                </ol>
            </div>
        </section>
    )
}

export default HowItWorks
