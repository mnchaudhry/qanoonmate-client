"use client";

import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ChatFeatures from "../../chatbot/_components/ChatFeatures";

function LegalChatbotDemo() {
    const router = useRouter();
    const [inputValue, setInputValue] = useState("");
    
    const fadeUpVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" },
        },
    };

    const exampleQuestions = [
        "What are my rights if I get fired without notice?",
        "How do I file a property dispute case?",
        "What is the process for getting a divorce in Pakistan?",
        "Can I sue for medical negligence?",
        "How do I protect my intellectual property?",
        "What are the requirements for starting a business?"
    ];

    const handleSendMessage = () => {
        if (inputValue.trim()) {
            const searchParams = new URLSearchParams();
            searchParams.set('message', encodeURIComponent(inputValue.trim()));
            router.push(`/chat?${searchParams.toString()}`);
        }
    };

    const handleExampleClick = (example: string) => {
        const searchParams = new URLSearchParams();
        searchParams.set('message', encodeURIComponent(example));
        router.push(`/chat?${searchParams.toString()}`);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <section className="bg-surface py-24 !px-4">
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
                {/* Chat Demo and Features */}
                <div className="grid grid-cols-1 md:grid-cols-10 gap-4 md:gap-2 px-0 md:px-6 py-4 md:py-8">
                    <div className="md:col-span-6 order-1">
                        {/* Chat Demo with Functional Input */}
                        <div className="relative bg-surface flex flex-col justify-between h-full py-6 px-4 sm:px-6 rounded-xl max-w-3xl mx-auto shadow-inner mb-20">
                            <div className="flex flex-col gap-4">
                                <h2 className="text-xl font-semibold text-center mb-8">
                                    Preview a Typical Interaction
                                </h2>

                                <div className="space-y-4">
                                    {/* Message 1 - User */}
                                    <div className="flex items-start gap-2">
                                        <div className="bg-muted rounded-full p-2">
                                            <span className="text-xs font-medium">You</span>
                                        </div>
                                        <div className="bg-muted px-4 py-3 rounded-lg w-fit max-w-[80%]">
                                            <p>What are my rights if I get fired without notice?</p>
                                        </div>
                                    </div>

                                    {/* Message 2 - AI */}
                                    <div className="flex items-start justify-end gap-2">
                                        <div className="bg-primary/10 px-4 py-3 rounded-lg w-fit max-w-[80%]">
                                            <p>
                                                Under the <span className="font-semibold">Employment Act 2021</span>, an employer must provide valid notice or severance.
                                                Please refer to <span className="underline">Section 17</span> of the Act.
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-2">Tone: Formal · Source: Employment Act</p>
                                        </div>
                                        <div className="bg-primary text-background rounded-full p-2 w-9 h-9 flex items-center justify-center">
                                            <span className="text-xs font-medium">AI</span>
                                        </div>
                                    </div>

                                    {/* Message 3 - User */}
                                    <div className="flex items-start gap-2">
                                        <div className="bg-muted rounded-full p-2">
                                            <span className="text-xs font-medium">You</span>
                                        </div>
                                        <div className="bg-muted px-4 py-3 rounded-lg w-fit max-w-[80%]">
                                            <p>Can I take any legal action against them?</p>
                                        </div>
                                    </div>

                                    {/* Message 4 - AI */}
                                    <div className="flex items-start justify-end gap-2">
                                        <div className="bg-primary/10 px-4 py-3 rounded-lg w-fit max-w-[80%]">
                                            <p>
                                                Yes, you may file a complaint with the <span className="font-semibold">Labour Department</span> or pursue civil litigation if your rights were violated.
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-2">Quick Action: <span className="underline cursor-pointer">Book Consultation</span></p>
                                        </div>
                                        <div className="bg-primary text-background rounded-full p-2 w-9 h-9 flex items-center justify-center">
                                            <span className="text-xs font-medium">AI</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Functional Input field */}
                            <div className="mt-10">
                                <div className="flex items-center gap-2 bg-background border !border-border rounded-lg px-4 py-2">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="bg-transparent w-full outline-none placeholder:text-muted-foreground"
                                        placeholder="Type your question here..."
                                    />
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={handleSendMessage}
                                        disabled={!inputValue.trim()}
                                        className="hover:bg-primary/10 hover:text-primary transition-colors"
                                    >
                                        <SendHorizonal className="w-5 h-5" />
                                    </Button>
                                </div>
                                <p className="text-center text-muted-foreground text-sm mt-4">
                                    Type your question and press Enter or click Send to start chatting
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="md:col-span-4 order-2">
                        <ChatFeatures />
                    </div>
                </div>
            </div>
        </section>
    );
}

export { LegalChatbotDemo }
