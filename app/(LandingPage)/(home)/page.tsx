import { Metadata } from 'next'
import About from "./_components/About"
import Contact from "./_components/Contact"
import ChatBotButton from "./_components/ChatBotButton"
import { LegalChatbotDemo } from "./_components/LegalChatbotDemo"
import BlogNewsTeaser from "./_components/LegalBlogs"
import ConsultationMarketplace from "./_components/ConsultationMarketPlace"
import CoreFeatures from "./_components/CoreFeatures"
import { CTA } from "./_components/CTA"
import LegalKnowledgeBase from "./_components/LegalKnowledgeBase"
import LegalSummaries from "./_components/LegalSummaries"
import { HeroGeometric } from "./_components/shape-landing-hero"
import { Pricing } from "./_components/Pricing"
import StructuredData, { 
  organizationStructuredData, 
  websiteStructuredData, 
  legalServiceStructuredData 
} from "@/components/StructuredData"

export const metadata: Metadata = {
  title: 'QanoonMate - AI-Powered Legal Platform for Pakistan',
  description: 'Get instant legal advice, connect with qualified lawyers, and access Pakistan\'s largest legal database. QanoonMate simplifies legal access with AI-driven solutions, case law research, and expert legal consultations.',
  keywords: 'legal advice Pakistan, lawyer consultation, Pakistan law, legal database, AI legal assistant, case law, legal documents, law firm Pakistan, legal tech, Islamic law, Pakistani constitution',
  openGraph: {
    title: 'QanoonMate - AI-Powered Legal Platform for Pakistan',
    description: 'Get instant legal advice, connect with qualified lawyers, and access Pakistan\'s largest legal database with AI-driven solutions.',
    type: 'website',
    url: 'https://qanoonmate.com',
    images: [
      {
        url: '/Pictures/qanoonmate-hero-og.jpg',
        width: 1200,
        height: 630,
        alt: 'QanoonMate - Legal Tech Platform for Pakistan'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QanoonMate - AI-Powered Legal Platform for Pakistan',
    description: 'Get instant legal advice, connect with qualified lawyers, and access Pakistan\'s largest legal database.',
    images: ['/Pictures/qanoonmate-hero-twitter.jpg']
  }
}

export default function Home() {

  // Pulse beam

  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredData data={organizationStructuredData} />
      <StructuredData data={websiteStructuredData} />
      <StructuredData data={legalServiceStructuredData} />
      
      <main className="flex-1">
        <HeroGeometric />
        <About />
        <CoreFeatures />
        <LegalChatbotDemo />
        <LegalKnowledgeBase />
        <LegalSummaries />
        <ConsultationMarketplace />
        <BlogNewsTeaser />
        <Pricing />
        <CTA />
        <Contact />
        <ChatBotButton />
      </main>
    </>
  )
}