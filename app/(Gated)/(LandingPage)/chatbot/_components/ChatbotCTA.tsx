'use client'

import { Button } from '@/components/ui/button'
import React from 'react'

const ChatbotCTA = () => {
    return (
        <section className="mt-24 bg-primary/5 py-16 rounded-2xl shadow-md text-center px-6">
            <h3 className="text-3xl font-bold text-primary-900 mb-4">
                Ready to Ask Your First Question?
            </h3>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8 text-base">
                Get instant legal insights with zero hassle. Our AI assistant is always available — no signup, no waiting.
            </p>
            <Button className="text-lg px-10 py-5" size="lg">
                Open Chatbot
            </Button>
            <p className="text-muted-foreground text-sm mt-4">Available 24/7 — Your privacy is protected</p>
        </section>
    )
}

export default ChatbotCTA
