import HeroSection from "./_components/Hero-Section"
import About from "./_components/About"
import Contact from "./_components/Contact"
import ChatBotButton from "./_components/ChatBotButton"
import LegalChatbotDemo from "./_components/LegalChatbotDemo"
import BlogNewsTeaser from "./_components/LegalBlogs"
import ConsultationMarketplace from "./_components/ConsultationMarketPlace"
import CoreFeatures from "./_components/CoreFeatures"
import CTA from "./_components/CTA"
import PricingPlans from "./_components/PricingPlan"
import LegalKnowledgeBase from "./_components/LegalKnowledgeBase"
import LegalDrafts from "./_components/LegalDrafts"
import LegalSummaries from "./_components/LegalSummaries"

export default function Home() {


  return (
    <main className="flex-1">

      <HeroSection />
      <About />
      <CoreFeatures />
      <LegalKnowledgeBase />
      <LegalChatbotDemo />
      <LegalDrafts />
      <LegalSummaries />
      <BlogNewsTeaser />
      <ConsultationMarketplace />
      <PricingPlans />
      <CTA />
      <Contact />

      <ChatBotButton />

    </main>
  )
}