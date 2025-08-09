"use client";

import { motion, Variants } from "framer-motion";
import { Play, Users, Zap, Brain, MessageSquare, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { About } from "@/constants/images";
import ChatFeatures from "../../chatbot/_components/ChatFeatures";
import ChatDemo from "../../chatbot/_components/ChatDemo";

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
            <div className="container px-4 mx-auto max-w-7xl md:px-6">
                {/* Existing Sections */}
                <div className="grid grid-cols-10 gap-2 px-6 py-8">
                    <div className="col-span-4">
                        <ChatFeatures />
                    </div>
                    <div className="col-span-6">
                        <ChatDemo />
                    </div>
                </div>
            </div>
        </section>
    );
}

export { LegalChatbotDemo }
