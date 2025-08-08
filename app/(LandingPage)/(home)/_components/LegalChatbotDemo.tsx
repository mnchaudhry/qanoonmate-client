"use client";

import { motion, Variants } from "framer-motion";
import { Play, Users, Zap, Brain, MessageSquare, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { About } from "@/constants/images";

const features = [
    {
        title: "Conversational AI",
        description: "Chat naturally with our AI trained on Pakistani legal content and public law datasets.",
        icon: Brain,
        color: "text-primary"
    },
    {
        title: "Source Linking",
        description: "Get references and legal citations alongside answers for verification.",
        icon: FileText,
        color: "text-primary-dark"
    },
    {
        title: "Tone Control",
        description: "Switch between formal legal tones and simplified explanations.",
        icon: MessageSquare,
        color: "text-secondary"
    },
    {
        title: "Quick Actions",
        description: "Generate documents, request templates, or summarize responses with one click.",
        icon: Zap,
        color: "text-accent"
    },
    {
        title: "Bilingual Support",
        description: "Ask and receive answers in English or Urdu—whichever suits you best.",
        icon: Users,
        color: "text-muted"
    },
];

function LegalChatbotDemo() {
    const fadeUpVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" },
        },
    };

    const staggerVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
        },
    };

    return (
        <section className="bg-surface py-24">
            <div className="container px-4 mx-auto max-w-7xl md:px-6">
                {/* Header */}
                <motion.div
                    variants={fadeUpVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="text-sm text-primary font-semibold uppercase mb-4 tracking-wider">
                        AI-Powered Legal Assistant
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-foreground">
                        Get Instant Legal Answers – Powered by AI
                    </h2>
                    <p className="mt-6 text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
                        Meet your 24/7 legal assistant. Ask questions, explore sources, and receive contextual legal information in real-time. No waiting, no jargon—just answers.
                    </p>
                </motion.div>

                {/* Features & Image Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 items-center">
                    {/* Features */}
                    <motion.div
                        variants={fadeUpVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <h3 className="text-2xl font-semibold mb-8 text-foreground">
                            Why Choose Our AI Chatbot?
                        </h3>
                        <ul className="space-y-6">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <motion.li
                                        key={index}
                                        variants={staggerVariants}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-start group"
                                    >
                                        <div className={`w-10 h-10 ${feature.color} mr-4 mt-1 group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className="w-full h-full" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-lg mb-2 text-foreground group-hover:text-primary transition-colors duration-300">
                                                {feature.title}
                                            </h4>
                                            <p className="text-muted-foreground leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </motion.li>
                                );
                            })}
                        </ul>
                    </motion.div>

                    {/* Image */}
                    <motion.div
                        variants={fadeUpVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="relative"
                    >
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src={About}
                                alt="AI Chatbot Demo"
                                width={500}
                                height={500}
                                className="w-full h-auto object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />

                            {/* Floating chat bubble */}
                            <div className="absolute bottom-6 left-6 bg-primary text-neutral p-4 rounded-2xl shadow-lg max-w-xs">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                    <span className="text-sm font-medium">AI Assistant</span>
                                </div>
                                <p className="text-sm">How can I help you with your legal question today?</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Chatbot Interaction Demo */}
                <motion.div
                    variants={fadeUpVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="bg-neutral rounded-2xl p-8 max-w-4xl mx-auto border border-border shadow-xl"
                >
                    <div className="flex items-center mb-6">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mr-4">
                            <MessageSquare className="w-5 h-5 text-neutral" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-foreground">Try the AI Chatbot</h3>
                            <p className="text-sm text-muted-foreground">Ask any legal question and get instant answers</p>
                        </div>
                    </div>

                    <div className="bg-background rounded-xl p-6 mb-6 border border-border">
                        <textarea
                            className="w-full p-4 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            rows={4}
                            placeholder="Type your legal question here... (e.g., 'What are the requirements for filing a property transfer deed?')"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Link href="/chatbot">
                            <Button size="lg" className="px-8 py-3 text-lg font-semibold">
                                <MessageSquare className="mr-2 h-5 w-5" />
                                Ask Question
                            </Button>
                        </Link>

                        <Button
                            variant="outline"
                            size="lg"
                            className="px-8 py-3 text-lg font-semibold"
                            onClick={() => {
                                const demoSection = document.getElementById("demo-section");
                                if (demoSection) {
                                    demoSection.scrollIntoView({ behavior: "smooth" });
                                }
                            }}
                        >
                            <Play className="mr-2 h-5 w-5" />
                            Watch Demo
                        </Button>
                    </div>

                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start gap-3">
                            <div className="w-5 h-5 text-yellow-600 mt-0.5">⚠️</div>
                            <div>
                                <p className="text-sm text-yellow-800 font-medium mb-1">Important Notice</p>
                                <p className="text-sm text-yellow-700">
                                    This AI chatbot is for informational purposes only and does not constitute legal advice.
                                    For complex legal matters, please consult with a qualified legal professional.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export { LegalChatbotDemo }
