import { Button } from '@/components/ui/button'
import { MessageSquare } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import SectionHeading from './SectionHeading'
import { About } from '@/constants/images'
import Link from 'next/link'

const features = [
    {
        title: "Conversational AI",
        description: "Chat naturally with our AI trained on legal content and public law datasets.",
    },
    {
        title: "Source Linking",
        description: "Get references and legal citations alongside answers for verification.",
    },
    {
        title: "Tone Control",
        description: "Switch between formal legal tones and simplified explanations.",
    },
    {
        title: "Quick Actions",
        description: "Generate documents, request templates, or summarize responses with one click.",
    },
    {
        title: "Bilingual Support",
        description: "Ask and receive answers in English or Urdu—whichever suits you best.",
    },
];


const LegalChatbotDemo = () => {
    return (
        <section className="bg-surface">

            <div className="container px-4 mx-auto max-w-7xl md:px-6">

                {/* Header */}
                <SectionHeading
                    title='AI-Assisted Legal Chatbot'
                    topTitle='Get Instant Legal Answers – Powered by AI'
                    description='Meet your 24/7 legal assistant. Ask questions, explore sources, and receive contextual legal information in real-time. No waiting, no jargon—just answers.'
                />

                {/* Features & Image Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 items-center">
                    {/* Features */}
                    <div>
                        <ul className="space-y-4 text-muted-foreground">
                            {features.map((feature, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="text-primary mr-3 mt-1">
                                        <MessageSquare className="w-5 h-5" />
                                    </span>
                                    <div>
                                        <h4 className="font-semibold">{feature.title}</h4>
                                        <p className="text-sm">{feature.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Image */}
                    <div className="w-full relative rounded-lg overflow-hidden shadow-lg">
                        <Image
                            src={About}
                            alt="AI Chatbot Demo"
                            width={500}
                            height={500}
                            objectFit="cover"
                            className="rounded-lg w-fit h-[350px] md:h-[420px]"
                        />
                    </div>
                </div>

                {/* Chatbot Interaction Demo */}
                <div className="bg-neutral shadow-lg rounded-lg p-8 max-w-3xl mx-auto">
                    <div className="flex items-center mb-6">
                        <MessageSquare className="text-primary mr-2 w-6 h-6" />
                        <h3 className="text-xl font-semibold">Try the AI Chatbot</h3>
                    </div>
                    <div className="bg-background p-4 rounded-lg mb-4">
                        <textarea
                            className="w-full p-4 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                            rows={5}
                            placeholder="Type your legal question here..."
                        ></textarea>
                    </div>
                    <Link href="../chatbot" className="text-primary hover:underline">
                        <Button>Ask</Button>
                    </Link>
                    <p className="mt-4 text-muted-foreground text-sm">
                        <span className="text-foreground">Note:</span> This AI chatbot is for informational purposes only and does not constitute legal advice.
                    </p>
                </div>
            </div>
        </section>
    )
}

export default LegalChatbotDemo
