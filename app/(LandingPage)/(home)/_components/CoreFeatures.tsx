import { CheckCircle } from 'lucide-react'
import React from 'react'

const CoreFeatures = () => {
    const features = [
        {
            title: 'Legal Knowledge Base',
            description: 'Access a comprehensive database of legal resources, including laws, case laws, and legal guides.',
        },
        {
            title: 'AI-Assisted Legal Chatbot',
            description: 'Get answers to your legal queries powered by AI, with sources and explanations.',
        },
        {
            title: 'Legal Document Templates',
            description: 'Pre-built templates for legal documents like contracts, agreements, and more.',
        },
        {
            title: 'AI-Generated Legal Summaries',
            description: 'Get AI-generated summaries of case laws, legal documents, or topics to simplify complex legal information.',
        },
        {
            title: 'Legal Blogs & News',
            description: 'Stay updated with the latest legal news, trends, and expert insights through our regularly updated blogs.',
        },
        {
            title: 'Consultations with Lawyers',
            description: 'Book consultations with verified lawyers based on hourly or fixed-rate pricing.',
        },
    ]

    return (
        <section className="bg-background">

            <div className="px-4 mx-auto max-w-7xl md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold">Core Features of LegalEase</h2>
                    <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                        LegalEase brings you a suite of smart legal tools, designed to empower individuals, professionals, and businesses at every stage of their legal journey.
                    </p>
                </div>


                <div className="grid md:grid-cols-3 gap-8 mx-auto">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-neutral shadow-lg rounded-lg p-6">
                            <div className="flex items-center mb-4">
                                <CheckCircle className="text-primary mr-2 w-6 h-6" />
                                <h3 className="text-xl font-semibold">{feature.title}</h3>
                            </div>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default CoreFeatures
