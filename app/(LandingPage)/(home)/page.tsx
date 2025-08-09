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

export default function Home() {

  // Pulse beam

  return (
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
  )
}