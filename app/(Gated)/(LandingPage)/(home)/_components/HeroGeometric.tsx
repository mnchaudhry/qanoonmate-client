"use client";

import { motion, Variants } from "framer-motion";
import { Circle, ArrowRight, Scale, FileText, Gavel, BookOpen, ShieldCheck, User, Briefcase, Globe, } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ElegantShape from "@/components/ui/elegant-shape";
import { FloatingIcon } from "@/components/floating-icon";
import { useEffect, useMemo, useState } from "react";



function HeroGeometric() {

    ///////////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////////////
    const titles = useMemo(() => ["powerful", "reliable", "dynamic", "secure", "modern"], []);

    ///////////////////////////////////////////////////// STATES /////////////////////////////////////////////////////////////
    const [titleNumber, setTitleNumber] = useState(0);
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setTitleNumber((prev) => (prev === titles.length - 1 ? 0 : prev + 1));
        }, 2000);
        return () => clearTimeout(timeoutId);
    }, [titleNumber, titles]);

    const fadeUpVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 1, delay: 0.5, ease: "easeOut", },
        },
    };


    const fadeUpVariants3: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 1, delay: 0.9, ease: "easeOut", },
        },
    };

    const fadeUpVariants4: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 1, delay: 1.1, ease: "easeOut", },
        },
    };

    return (
        <>
            {/* <SplashCursor /> */}

            <div className="relative md:min-h-screen min-h-[80vh] w-full flex items-center justify-center overflow-hidden bg-background">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.05] via-transparent to-primary-dark/[0.05] blur-3xl" />

                <FloatingIcon Icon={Scale} delay={0} x={10} y={10} />
                <FloatingIcon Icon={FileText} delay={2} x={90} y={15} />
                <FloatingIcon Icon={Gavel} delay={4} x={20} y={40} />
                <FloatingIcon Icon={BookOpen} delay={6} x={15} y={85} />
                <FloatingIcon Icon={ShieldCheck} delay={8} x={50} y={95} />
                <FloatingIcon Icon={User} delay={10} x={90} y={95} />
                <FloatingIcon Icon={Briefcase} delay={12} x={70} y={30} />
                <FloatingIcon Icon={Globe} delay={14} x={80} y={70} />

                <div className="absolute inset-0 overflow-hidden">
                    <ElegantShape
                        delay={0.3}
                        width={600}
                        height={140}
                        rotate={12}
                        gradient="from-primary/[0.15]"
                        className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
                    />

                    <ElegantShape
                        delay={0.5}
                        width={500}
                        height={120}
                        rotate={-15}
                        gradient="from-primary-dark/[0.15]"
                        className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
                    />

                    <ElegantShape
                        delay={0.4}
                        width={300}
                        height={80}
                        rotate={-8}
                        gradient="from-secondary/[0.15]"
                        className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
                    />

                    <ElegantShape
                        delay={0.6}
                        width={200}
                        height={60}
                        rotate={20}
                        gradient="from-accent/[0.15]"
                        className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
                    />

                    <ElegantShape
                        delay={0.7}
                        width={150}
                        height={40}
                        rotate={-25}
                        gradient="from-muted/[0.15]"
                        className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
                    />
                </div>

                <div className="relative z-10 container mx-auto px-4 md:px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            variants={fadeUpVariants}
                            initial="hidden"
                            animate="visible"
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/[0.03] border border-primary/[0.08] mb-8 md:mb-12"
                        >
                            <Circle className="h-2 w-2 fill-primary/80" />
                            <span className="text-sm text-primary/60 tracking-wide">
                                QanoonMate
                            </span>
                        </motion.div>

                        <motion.h1
                            className="flex flex-col items-center text-center text-6xl md:text-8xl font-semibold tracking-tighter leading-tight md:leading-[1.1]"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                        >
                            <div className="flex gap-5">
                                <span className="text-primary">Your</span>
                                <span className="relative h-[1.2em] w-[6.5ch]"> {/* more width */}
                                    {titles.map((title, index) => (
                                        <motion.span
                                            key={index}
                                            className="absolute inset-0 font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark text-left"
                                            initial={{ opacity: 0, y: "-100%" }}
                                            animate={
                                                titleNumber === index
                                                    ? { y: 0, opacity: 1 }
                                                    : { y: titleNumber > index ? "-150%" : "150%", opacity: 0 }
                                            }
                                            transition={{ type: "spring", stiffness: 60 }}
                                        >
                                            {title}
                                        </motion.span>
                                    ))}
                                </span>
                            </div>
                            <span>Legal Companion</span>
                        </motion.h1>

                        <motion.div
                            variants={fadeUpVariants3}
                            initial="hidden"
                            animate="visible"
                            className='mt-6'
                        >
                            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
                                From instant legal insights to custom document generation and lawyer consultations —
                                QanoonMate is your smart legal companion, accessible anywhere, anytime.
                            </p>
                        </motion.div>

                        <motion.div
                            variants={fadeUpVariants4}
                            initial="hidden"
                            animate="visible"
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                        >
                            {/* Primary CTA - Get Started */}
                            <Button size="lg" asChild className="cursor-pointer">
                                <Link href="/auth/sign-up">
                                    Get Started Free
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>

                            {/* Secondary CTA - Try AI Chatbot */}
                            <Button variant="outline" size="lg" asChild className="cursor-pointer">
                                <Link href="/chat">
                                    Try AI Chatbot
                                </Link>
                            </Button>

                            {/* Tertiary CTA - Watch Demo */}
                            {/* <Button
                            variant="ghost"
                            size="lg"
                            className="px-8 py-3 text-lg cursor-pointer text-muted-foreground hover:text-foreground"
                            onClick={() => {
                                // Scroll to demo section or open video modal
                                const demoSection = document.getElementById("demo-section");
                                if (demoSection) {
                                    demoSection.scrollIntoView({ behavior: "smooth" });
                                }
                            }}
                        >
                            <Play className="mr-2 h-5 w-5" />
                            Watch Demo
                        </Button> */}
                        </motion.div>

                        {/* Social Proof */}
                        <motion.div
                            variants={fadeUpVariants4}
                            initial="hidden"
                            animate="visible"
                            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground"
                        >
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background"
                                        />
                                    ))}
                                </div>
                                <span>10,000+ legal professionals</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div
                                            key={i}
                                            className="w-3 h-3 rounded-full bg-yellow-500"
                                        />
                                    ))}
                                </div>
                                <span>4.8/5 rating</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span>24/7 AI Support</span>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/80 pointer-events-none" />
            </div>
        </>
    );
}

export { HeroGeometric }
