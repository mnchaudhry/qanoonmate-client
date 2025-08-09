"use client";

import Image from "next/image";
import React from "react";
import { MessageSquare, BookOpen, FileText, Users, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";
import SectionHeading from "./SectionHeading";

export function FeaturesLine() {
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

    const features = [
        {
            icon: MessageSquare,
            title: "AI Legal Chatbot",
            description: "Ask legal questions in Urdu or English and get cited, reliable responses powered by advanced AI. Our chatbot understands context and provides accurate legal information.",
            highlights: [
                "Bilingual support (Urdu & English)",
                "Cited legal references",
                "Context-aware responses",
                "24/7 availability"
            ],
            images: ["/general/bot-green.png", "/general/bot-white.png"],
            isEven: true
        },
        {
            icon: BookOpen,
            title: "Legal Knowledge Base",
            description: "Access Pakistan's complete legal framework including Acts, Ordinances, and Regulations. Search semantically and find relevant legal provisions instantly.",
            highlights: [
                "Complete Pakistani legal database",
                "Semantic search capabilities",
                "Cross-referenced citations",
                "Regular updates"
            ],
            images: ["/Pictures/docanalysis.jpg", "/general/pdf.png"],
            isEven: false
        },
        {
            icon: FileText,
            title: "Legal Drafts & Summaries",
            description: "Generate professional legal drafts and get AI-powered summaries of complex documents. Upload, analyze, and export with ease.",
            highlights: [
                "AI-powered document generation",
                "Intelligent summarization",
                "Multiple export formats",
                "Template library"
            ],
            images: ["/Pictures/aipow.jpg", "/general/bot-white.png"],
            isEven: true
        },
        {
            icon: Users,
            title: "Consultation Marketplace",
            description: "Find verified lawyers, book consultations, and manage your legal cases. Chat securely and track progress in real-time.",
            highlights: [
                "Verified lawyer profiles",
                "Secure communication",
                "Case management tools",
                "Real-time updates"
            ],
            images: ["/test/lawyer1.jpeg", "/Pictures/about.jpg"],
            isEven: false
        }
    ];

    return (
        <section className="bg-surface py-24">
            <div className="container px-4 mx-auto max-w-7xl md:px-6">
                <motion.div
                    variants={fadeUpVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <SectionHeading
                        title="DETAILED FEATURES"
                        topTitle="What QanoonMate Offers in Detail"
                        description="Discover our comprehensive suite of AI-powered legal tools designed to make Pakistani law accessible to everyone."
                    />
                </motion.div>

                <div className="space-y-32">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        
                        return (
                            <motion.div
                                key={index}
                                variants={staggerVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
                            >
                                {/* Text Content */}
                                <div className={`${feature.isEven ? 'md:order-1' : 'md:order-2'}`}>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                                            <Icon className="w-8 h-8 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-bold text-foreground">
                                                {feature.title}
                                            </h3>
                                        </div>
                                    </div>
                                    
                                    <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                                        {feature.description}
                                    </p>

                                    <div className="space-y-4 mb-8">
                                        {feature.highlights.map((highlight, idx) => (
                                            <div key={idx} className="flex items-center gap-3">
                                                <CheckCircle className="w-5 h-5 text-primary" />
                                                <span className="text-foreground">{highlight}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <Button className="group">
                                        Try {feature.title}
                                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </div>

                                {/* Images */}
                                <div className={`${feature.isEven ? 'md:order-2' : 'md:order-1'} relative`}>
                                    <div className="grid grid-cols-2 gap-4">
                                        {feature.images.map((image, idx) => (
                                            <motion.div
                                                key={idx}
                                                variants={fadeUpVariants}
                                                transition={{ delay: 0.3 + idx * 0.1 }}
                                                className="relative rounded-2xl overflow-hidden shadow-2xl"
                                            >
                                                <Image
                                                    src={image}
                                                    alt={`${feature.title} ${idx + 1}`}
                                                    width={400}
                                                    height={300}
                                                    className="w-full h-48 md:h-56 object-cover"
                                                    priority={index === 0}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Floating stats */}
                                    {index === 0 && (
                                        <div className="absolute -bottom-6 -left-6 bg-primary text-neutral p-4 rounded-xl shadow-lg">
                                            <div className="text-2xl font-bold">99%</div>
                                            <div className="text-sm opacity-90">Accuracy</div>
                                        </div>
                                    )}
                                    
                                    {index === 1 && (
                                        <div className="absolute -top-6 -right-6 bg-primary-dark text-neutral p-4 rounded-xl shadow-lg">
                                            <div className="text-2xl font-bold">10K+</div>
                                            <div className="text-sm opacity-90">Documents</div>
                                        </div>
                                    )}

                                    {index === 2 && (
                                        <div className="absolute -bottom-6 -right-6 bg-primary text-neutral p-4 rounded-xl shadow-lg">
                                            <div className="text-2xl font-bold">5K+</div>
                                            <div className="text-sm opacity-90">Templates</div>
                                        </div>
                                    )}

                                    {index === 3 && (
                                        <div className="absolute -top-6 -left-6 bg-primary-dark text-neutral p-4 rounded-xl shadow-lg">
                                            <div className="text-2xl font-bold">500+</div>
                                            <div className="text-sm opacity-90">Lawyers</div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Bottom CTA - matching the About section pattern */}
                <motion.div
                    variants={fadeUpVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-32"
                >
                    <div className="bg-background rounded-2xl p-12 shadow-2xl border border-border">
                        <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                            Ready to Experience QanoonMate?
                        </h3>
                        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
                            Join thousands of users who trust QanoonMate for their legal needs. Start with our free plan today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="group">
                                Get Started Free
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Button>
                            <Button variant="outline" size="lg">
                                View Pricing
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
