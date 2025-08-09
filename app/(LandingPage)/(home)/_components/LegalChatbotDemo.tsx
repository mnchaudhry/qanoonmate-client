"use client";

import { motion, Variants } from "framer-motion";
import ChatFeatures from "../../chatbot/_components/ChatFeatures";
import ChatDemo from "../../chatbot/_components/ChatDemo";

function LegalChatbotDemo() {
    const fadeUpVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" },
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
