import { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Pricing Plans - Affordable Legal Services',
  description: 'Choose from our flexible pricing plans for legal consultations, document drafting, and premium legal services. Transparent pricing, no hidden fees. Start with our free plan.',
  keywords: 'legal services pricing, lawyer consultation fees, legal advice cost, affordable legal help Pakistan, legal services plans, legal consultation rates',
  openGraph: {
    title: 'Pricing Plans - Affordable Legal Services | QanoonMate',
    description: 'Choose from our flexible pricing plans for legal consultations, document drafting, and premium legal services.',
    type: 'website',
    url: 'https://qanoonmate.com/pricing',
    images: [
      {
        url: '/Pictures/pricing-og.jpg',
        width: 1200,
        height: 630,
        alt: 'QanoonMate Pricing Plans'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing Plans - Affordable Legal Services | QanoonMate',
    description: 'Choose from our flexible pricing plans for legal consultations and premium legal services.',
    images: ['/Pictures/pricing-twitter.jpg']
  }
}

interface PricingLayoutProps {
  children: ReactNode
}

export default function PricingLayout({ children }: PricingLayoutProps) {
  return children
}
