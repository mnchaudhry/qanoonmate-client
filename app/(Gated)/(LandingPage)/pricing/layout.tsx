import { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Credit-Based Pricing - Pay Only for What You Use',
  description: 'Revolutionary credit-based pricing for legal services. Pay only for what you use with Qanoon Credits (QC). No monthly subscriptions, no hidden fees. Transparent pricing for AI chatbot, document summarization, and legal consultations.',
  keywords: 'credit-based pricing, Qanoon Credits, legal services pricing, pay per use, legal AI pricing, document summarization cost, lawyer consultation credits, transparent legal pricing',
  openGraph: {
    title: 'Credit-Based Pricing - Pay Only for What You Use | QanoonMate',
    description: 'Revolutionary credit-based pricing for legal services. Pay only for what you use with Qanoon Credits (QC). No monthly subscriptions, no hidden fees.',
    type: 'website',
    url: 'https://qanoonmate.com/pricing',
    images: [
      {
        url: '/Pictures/pricing-og.jpg',
        width: 1200,
        height: 630,
        alt: 'QanoonMate Credit-Based Pricing'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Credit-Based Pricing - Pay Only for What You Use | QanoonMate',
    description: 'Revolutionary credit-based pricing for legal services. Pay only for what you use with Qanoon Credits (QC).',
    images: ['/Pictures/pricing-twitter.jpg']
  }
}

interface PricingLayoutProps {
  children: ReactNode
}

export default function PricingLayout({ children }: PricingLayoutProps) {
  return children
}
