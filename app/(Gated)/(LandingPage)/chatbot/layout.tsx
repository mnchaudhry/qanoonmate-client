import { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'AI Legal Assistant - Get Instant Legal Advice',
  description: 'Chat with our AI-powered legal assistant for instant answers to your legal questions. Get preliminary legal guidance 24/7 from QanoonMate\'s advanced AI trained on Pakistani law.',
  keywords: 'AI legal assistant, legal chatbot, instant legal advice, automated legal help, legal AI Pakistan, 24/7 legal support, Pakistani law AI',
  openGraph: {
    title: 'AI Legal Assistant - Get Instant Legal Advice | QanoonMate',
    description: 'Chat with our AI-powered legal assistant for instant answers to your legal questions. Get preliminary legal guidance 24/7.',
    type: 'website',
    url: 'https://qanoonmate.com/chatbot',
    images: [
      {
        url: '/Pictures/chatbot-og.jpg',
        width: 1200,
        height: 630,
        alt: 'QanoonMate AI Legal Assistant'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Legal Assistant - Get Instant Legal Advice | QanoonMate',
    description: 'Chat with our AI-powered legal assistant for instant answers to your legal questions.',
    images: ['/Pictures/chatbot-twitter.jpg']
  }
}

interface ChatbotLayoutProps {
  children: ReactNode
}

export default function ChatbotLayout({ children }: ChatbotLayoutProps) {
  return children
}
