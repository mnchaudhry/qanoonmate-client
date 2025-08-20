'use client'

import React from 'react'
import LandingPageHeader from '../_components/LandingPageHeader'
import ChatDemo from './_components/ChatDemo'
import ChatFeatures from './_components/ChatFeatures'
import UseCases from './_components/UseCases'
import Testimonials from './_components/Testimonials'
import ChatbotFAQs from './_components/ChatbotFAQs'
import ChatbotCTA from './_components/ChatbotCTA'
import SecurityAndPrivacy from './_components/SecurityAndPrivacy'
import HowItWorks from './_components/HowItWorks'

export default function ChatbotPage() {
  return (
    <section className="relative bg-background antialiased min-h-screen !pt-0">
      <LandingPageHeader
        title="Your Legal Chatbot"
        description="Ask questions, get citations, and receive real-time legal insights with our AI-powered assistant."
      />

      <div className="container mx-auto mt-8">
        {/* Existing Sections */}
        <div className="grid grid-cols-1 md:grid-cols-10 gap-4 sm:gap-6 px-4 sm:px-6 py-6 sm:py-8">
          <div className="md:col-span-4 order-2 md:order-1">
            <ChatFeatures />
          </div>
          <div className="md:col-span-6 order-1 md:order-2">
            <ChatDemo />
          </div>
        </div>

        <HowItWorks />
        <UseCases />
        <Testimonials />
        <SecurityAndPrivacy />
        <ChatbotFAQs />
        <ChatbotCTA />

      </div>
    </section>

  )
}
