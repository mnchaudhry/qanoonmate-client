"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight, Clock, Users, Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { About } from "@/constants/images";



function CTA() {
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

    const benefits = [
        {
            icon: CheckCircle,
            text: "Free trial with no credit card required",
            color: "text-green-500"
        },
        {
            icon: Star,
            text: "Trusted by 10,000+ legal professionals",
            color: "text-yellow-500"
        },
        {
            icon: Users,
            text: "24/7 AI support and human assistance",
            color: "text-blue-500"
        },
        {
            icon: Clock,
            text: "Instant access to legal resources",
            color: "text-purple-500"
        }
    ];

    return (
        <section className="bg-gradient-to-br from-primary-dark via-primary to-primary-dark text-neutral py-24 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/50 to-primary/50" />
            <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

            <div className="container px-4 mx-auto md:px-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <motion.div
                        variants={fadeUpVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <div className="text-sm text-neutral/80 font-semibold uppercase mb-4 tracking-wider">
                            Ready to Transform Your Legal Experience?
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-neutral">
                            Empower Your Legal Journey with QanoonMate
                        </h2>

                        <p className="text-lg text-neutral/90 mb-8 leading-relaxed">
                            Whether you&apos;re seeking legal answers, drafting documents, or booking expert consultations —
                            QanoonMate brings the legal world to your fingertips. Trusted by professionals, accessible to everyone.
                        </p>

                        {/* Benefits */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            {benefits.map((benefit, index) => {
                                const Icon = benefit.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        variants={staggerVariants}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center gap-3"
                                    >
                                        <Icon className={`w-5 h-5 ${benefit.color}`} />
                                        <span className="text-neutral/90 text-sm">{benefit.text}</span>
                                    </motion.div>
                                );
                            })}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/auth/sign-up">
                                <Button
                                    size="lg"
                                    variant="secondary"
                                    className="bg-neutral text-primary hover:bg-neutral/90"
                                >
                                    Start Your Free Trial
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>

                            <Link href="/pricing">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-neutral text-neutral-foreground hover:bg-neutral hover:text-primary"
                                >
                                    View Pricing Plans
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Image or Illustration */}
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
                                alt="QanoonMate dashboard preview"
                                width={500}
                                height={500}
                                className="w-full h-auto object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/20 to-transparent" />

                            {/* Floating stats */}
                            <div className="absolute top-6 left-6 bg-neutral text-primary p-3 rounded-xl shadow-lg">
                                <div className="text-lg font-bold">10K+</div>
                                <div className="text-xs opacity-80">Documents</div>
                            </div>

                            <div className="absolute top-6 right-6 bg-neutral text-primary p-3 rounded-xl shadow-lg">
                                <div className="text-lg font-bold">24/7</div>
                                <div className="text-xs opacity-80">Support</div>
                            </div>

                            <div className="absolute bottom-6 left-6 bg-neutral text-primary p-3 rounded-xl shadow-lg">
                                <div className="text-lg font-bold">4.8★</div>
                                <div className="text-xs opacity-80">Rating</div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Trust indicators */}
                <motion.div
                    variants={fadeUpVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 text-center"
                >
                    <p className="text-neutral/70 text-sm mb-4">Trusted by leading law firms and professionals</p>
                    <div className="flex justify-center items-center gap-8 opacity-60">
                        <div className="w-20 h-8 bg-neutral/20 rounded"></div>
                        <div className="w-20 h-8 bg-neutral/20 rounded"></div>
                        <div className="w-20 h-8 bg-neutral/20 rounded"></div>
                        <div className="w-20 h-8 bg-neutral/20 rounded"></div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export { CTA }
