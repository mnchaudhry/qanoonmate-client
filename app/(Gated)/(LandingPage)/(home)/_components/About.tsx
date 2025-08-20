"use client";

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { About as AboutImage } from '@/constants/images'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { ArrowRight, CheckCircle } from 'lucide-react'

const About: React.FC = () => {
  const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" }, },
  };

  return (
    <section className="bg-neutral py-24">
      <div className="container px-4 mx-auto max-w-7xl md:px-6">
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="text-sm text-primary font-semibold uppercase mb-4 tracking-wider">
            Your Legal Partner
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-foreground">
            Simplifying Legal Access for Everyone
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Text Content */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-6 leading-snug text-foreground">
              The QanoonMate Solution
            </h3>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              At <span className="font-medium text-foreground">QanoonMate</span>, we&apos;re reimagining how people interact with the legal world. Our AI-powered platform offers instant legal insights, document analysis, and seamless access to verified legal professionals — all at your fingertips.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-foreground">Instant AI-powered legal answers</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-foreground">Access to comprehensive legal database</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-foreground">Direct consultation with verified lawyers</span>
              </div>
            </div>

            <Button
              onClick={() => {
                const el = document.getElementById("Contact")
                if (el) el.scrollIntoView({ behavior: "smooth" })
              }}
            >
              Get in Touch
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
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
                src={AboutImage}
                alt="About QanoonMate"
                height={500}
                width={500}
                className="w-full h-auto object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>

            {/* Floating stats */}
            <div className="absolute -bottom-6 -left-6 bg-primary text-neutral p-4 rounded-xl shadow-lg">
              <div className="text-2xl font-bold">10K+</div>
              <div className="text-sm opacity-90">Legal Documents</div>
            </div>

            <div className="absolute -top-6 -right-6 bg-primary-dark text-neutral p-4 rounded-xl shadow-lg">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm opacity-90">AI Support</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About
