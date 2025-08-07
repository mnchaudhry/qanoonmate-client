import { BadgeCheck } from 'lucide-react'
import React from 'react'

const consultationOptions = [
    {
        title: "Hourly Consultation",
        description: "Discuss your legal matter and pay based on the lawyer’s hourly rate.",
        points: [
            "Lawyers set their own hourly rates",
            "Pay upfront — transparent pricing",
            "Consultation held via chat, call or video"
        ]
    },
    {
        title: "Fixed-Price Projects",
        description: "Have a legal draft or case review? Hire lawyers at a fixed project rate.",
        points: [
            "Discuss your needs and get a quote",
            "Pay after agreement on deliverables",
            "Lawyer begins work — easy tracking"
        ]
    }
]

const ConsultationService = () => {
    return (
        <section className="py-16 bg-muted/50">
            <div className="container px-4 mx-auto md:px-6">
                <div className="text-center mb-12">
                    <p className="text-primary font-medium mb-2">CONSULTATION PRICING</p>
                    <h2 className="text-3xl font-bold">Pay-as-you-go Legal Consultations</h2>
                    <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
                        QanoonMate connects you with verified lawyers across Pakistan.
                        You choose who to consult — just like hiring a freelancer on platforms like Upwork.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {consultationOptions.map((option, index) => (
                        <div key={index} className={`relative p-8 rounded-lg border shadow-sm hover:shadow-xl bg-neutral border-gray-200 `}>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2">{option.title}</h3>
                                <p className="text-muted-foreground mb-4">{option.description}</p>
                                <ul className="space-y-4 mb-6">
                                    {option.points.map((point, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <BadgeCheck className="text-primary h-5 w-5 mr-2 mt-0.5" />
                                            <span className="text-muted-foreground">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                <p className="mt-10 text-center text-muted-foreground max-w-2xl mx-auto">
                    QanoonMate does not charge commissions on lawyer consultations. All payments are handled securely through our platform.
                </p>
            </div>
        </section>
    )
}

export default ConsultationService
