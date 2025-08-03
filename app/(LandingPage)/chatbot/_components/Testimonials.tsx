'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

const testimonials = [
    {
        name: 'Sarah M.',
        title: 'Freelance Designer',
        message:
            "The chatbot helped me understand my rights when I was let go from my job. I was able to take the necessary legal steps!",
    },
    {
        name: 'Daniel R.',
        title: 'Startup Founder',
        message:
            'I used the chatbot for contract disputes and it saved me so much time and hassle. I highly recommend it!',
    },
    {
        name: 'Ayesha K.',
        title: 'Marketing Manager',
        message:
            'Super helpful for clarifying confusing legal terms in our vendor agreements. It’s like having a mini lawyer in your pocket.',
    },
    {
        name: 'Usman K.',
        title: 'HR Specialist',
        message:
            'It’s like having a legal assistant that works 24/7. No waiting, just straight answers.',
    },
]

const duplicateTestimonials = [...testimonials, ...testimonials]

const TestimonialsCarousel = () => {
    return (
        <section className="mt-20 px-4 overflow-hidden">

            <h3 className="text-3xl font-semibold text-center mb-6 text-foreground">Client Testimonials</h3>
            <p className="text-base text-muted-foreground mb-6 max-w-2xl mx-auto text-center ">
                Hear from our satisfied clients about their experiences with our legal services. We pride ourselves on delivering exceptional results and building lasting relationships.
            </p>

            {/* First Row - Left to Right */}
            <motion.div
                className="flex space-x-6 w-max mb-10"
                animate={{ x: ['-50%', '0%'] }}
                transition={{
                    repeat: Infinity,
                    duration: 25,
                    ease: 'linear',
                }}
            >
                {duplicateTestimonials.map((testimonial, index) => (
                    <TestimonialCard key={`top-${index}`} {...testimonial} />
                ))}
            </motion.div>

            {/* Second Row - Right to Left */}
            <motion.div
                className="flex space-x-6 w-max"
                animate={{ x: ['0%', '-50%'] }}
                transition={{
                    repeat: Infinity,
                    duration: 25,
                    ease: 'linear',
                }}
            >
                {duplicateTestimonials.map((testimonial, index) => (
                    <TestimonialCard key={`bottom-${index}`} {...testimonial} />
                ))}
            </motion.div>
        </section>
    )
}

const TestimonialCard = ({
    name,
    title,
    message,
}: {
    name: string
    title: string
    message: string
}) => (
    <div className="min-w-[300px] max-w-xs bg-white p-6 rounded-xl shadow-md border border-muted/30">
        <Quote className="w-5 h-5 text-primary-300 mb-2" />
        <p className="text-sm text-muted-foreground mb-4">“{message}”</p>
        <div className="text-sm border-t pt-3">
            <span className="font-semibold text-primary-700">{name}</span>
            <p className="text-muted-foreground">{title}</p>
        </div>
    </div>
)

export default TestimonialsCarousel
