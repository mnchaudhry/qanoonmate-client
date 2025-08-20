"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight, Brain, FileText, BookOpen, MessageSquare, Users, Calendar, Star, Phone, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BentoCard, BentoGrid } from "./bento";

function CoreFeatures() {
    const staggerVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
        },
    };

    const features = [
        {
            Icon: Brain,
            name: "AI-Powered Legal Chatbot",
            description: "Get instant answers to legal queries with our advanced AI trained on Pakistani law. Ask questions in natural language and receive accurate, cited responses.",
            href: "/chatbot",
            cta: "Try Chatbot",
            background: (
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
                    {/* Floating AI elements */}
                    <div className="absolute top-6 right-6 w-16 h-16 bg-primary/20 rounded-full animate-pulse" />
                    <div className="absolute bottom-8 left-8 w-12 h-12 bg-primary/30 rounded-full animate-pulse delay-1000" />
                    <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-primary/40 rounded-full animate-pulse delay-500" />
                    {/* Chat bubbles */}
                    <div className="absolute bottom-28 md:bottom-16 right-12 bg-neutral p-3 rounded-2xl shadow-lg max-w-xs">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span className="text-xs font-medium text-primary">AI Assistant</span>
                        </div>
                        <p className="text-xs text-muted-foreground">How can I help with your legal question?</p>
                    </div>
                </div>
            ),
            // Encompasses first row, three columns
            className: "lg:col-start-1 lg:col-end-4 lg:row-start-1 lg:row-end-2",
        },
        {
            Icon: BookOpen,
            name: "Comprehensive Legal Database",
            description: "Access a vast collection of acts, case laws, legal guides, and documents. Everything you need for legal research in one place.",
            href: "/knowledgebase",
            cta: "Explore Database",
            background: (
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/10 via-primary-dark/5 to-transparent" />
                    {/* Document stack effect */}
                    <div className="absolute top-8 right-8 w-20 h-24 bg-neutral/80 rounded-lg shadow-lg transform rotate-12" />
                    <div className="absolute top-6 right-6 w-20 h-24 bg-neutral/60 rounded-lg shadow-lg transform rotate-6" />
                    <div className="absolute top-4 right-4 w-20 h-24 bg-neutral/40 rounded-lg shadow-lg" />
                    {/* Stats */}
                    <div className="absolute top-6 left-6 bg-primary text-neutral p-2 rounded-lg">
                        <div className="text-sm font-bold">10K+</div>
                        <div className="text-xs opacity-80">Documents</div>
                    </div>
                </div>
            ),
            // Encompasses first column, two rows (second and third row, first col)
            className: "lg:col-start-1 lg:col-end-2 lg:row-start-2 lg:row-end-4",
        },
        {
            Icon: FileText,
            name: "Document Templates & Drafts",
            description: "Professional legal document templates and drafts. From contracts to agreements, get the right format for your legal needs.",
            href: "/knowledgebase/drafts",
            cta: "Browse Templates",
            background: (
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-secondary/5 to-transparent" />
                    {/* Template cards */}
                    <div className="absolute top-6 left-6 w-16 h-20 bg-neutral/80 rounded-lg shadow-md transform -rotate-6" />
                    <div className="absolute top-8 left-8 w-16 h-20 bg-neutral/60 rounded-lg shadow-md transform rotate-3" />
                    <div className="absolute top-10 left-10 w-16 h-20 bg-neutral/40 rounded-lg shadow-md transform rotate-12" />
                    {/* Categories */}
                    <div className="absolute bottom-28 md:bottom-6 right-6 flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">Contracts</span>
                        <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">Agreements</span>
                        <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">Forms</span>
                    </div>
                    {/* Download icon */}
                    <div className="absolute top-1/2 right-8 w-10 h-10 bg-secondary/30 rounded-full flex items-center justify-center">
                        <ArrowRight className="w-5 h-5 text-secondary" />
                    </div>
                </div>
            ),
            // One row, two columns (second row, col 2-4)
            className: "lg:col-start-2 lg:col-end-4 lg:row-start-2 lg:row-end-3",
        },
        {
            Icon: MessageSquare,
            name: "AI-Generated Summaries",
            description: "Transform complex legal documents into clear, concise summaries. Save time and understand legal content quickly.",
            href: "/summarizers",
            cta: "Create Summary",
            background: (
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent" />
                    {/* Summary visualization */}
                    <div className="absolute top-6 left-6 w-32 h-24 bg-neutral/80 rounded-lg p-3">
                        <div className="w-full h-2 bg-muted-foreground/30 rounded mb-2" />
                        <div className="w-3/4 h-2 bg-muted-foreground/30 rounded mb-2" />
                        <div className="w-1/2 h-2 bg-muted-foreground/30 rounded" />
                    </div>
                    {/* AI processing indicator */}
                    <div className="absolute top-6 right-6 flex items-center gap-2">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-150" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-300" />
                        <span className="text-xs text-muted-foreground font-medium">AI Processing</span>
                    </div>
                </div>
            ),
            // One by one (third row, col 2)
            className: "lg:col-start-2 lg:col-end-3 lg:row-start-3 lg:row-end-4",
        },
        {
            Icon: Users,
            name: "Lawyer Consultations",
            description: "Connect with verified legal professionals for personalized advice. Book consultations via phone, video, or in-person.",
            href: "/lawyers",
            cta: "Find Lawyers",
            background: (
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-muted/10 via-muted/5 to-transparent" />
                    {/* Lawyer profiles */}
                    <div className="absolute top-6 left-6 flex -space-x-2">
                        <div className="w-8 h-8 bg-primary/30 rounded-full border-2 border-neutral" />
                        <div className="w-8 h-8 bg-primary/40 rounded-full border-2 border-neutral" />
                        <div className="w-8 h-8 bg-primary/50 rounded-full border-2 border-neutral" />
                        <div className="w-8 h-8 bg-primary/60 rounded-full border-2 border-neutral" />
                    </div>
                    {/* Rating stars */}
                    <div className="absolute top-6 right-6 flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="w-3 h-3 text-yellow-500 fill-current" />
                        ))}
                    </div>
                
                    {/* Consultation types */}
                    <div className="absolute bottom-6 right-6 flex gap-2">
                        <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                            <Phone className="w-3 h-3 text-primary" />
                        </div>
                        <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                            <Video className="w-3 h-3 text-primary" />
                        </div>
                        <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                            <Calendar className="w-3 h-3 text-primary" />
                        </div>
                    </div>
                </div>
            ),
            // One by one (third row, col 3)
            className: "lg:col-start-3 lg:col-end-4 lg:row-start-3 lg:row-end-4",
        },
    ];

    const fadeUpVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 1, delay: 0.5, ease: "easeOut", },
        },
    };

    return (
        <section id="core-features" className="bg-background py-24">
            <div className="container px-4 mx-auto max-w-7xl md:px-6">
                <motion.div
                    variants={fadeUpVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="text-sm text-primary font-semibold uppercase mb-4 tracking-wider">
                        Core Features
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-foreground">
                        Everything You Need for Legal Success
                    </h2>
                    <p className="mt-6 text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
                        QanoonMate brings you a suite of smart legal tools, designed to empower individuals, professionals, and businesses at every stage of their legal journey.
                    </p>
                </motion.div>

                <motion.div
                    variants={staggerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    <BentoGrid className="lg:grid-rows-3">
                        {features.map((feature) => (
                            <BentoCard key={feature.name} {...feature} className={`${feature.className} border border-primary min-h-[22rem]`} />
                        ))}
                    </BentoGrid>
                </motion.div>

                <motion.div
                    variants={fadeUpVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-16"
                >
                    <Link href="/auth/sign-up">
                        <Button size="lg" className="">
                            Start Your Free Trial
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}

export default CoreFeatures
