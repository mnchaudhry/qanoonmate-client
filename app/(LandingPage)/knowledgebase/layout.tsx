import { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Legal Knowledge Base - Laws, Cases & Documents',
  description: 'Access Pakistan\'s comprehensive legal database including acts, case laws, legal dictionary, drafts, FAQs, and guides. Your complete legal research resource.',
  keywords: 'Pakistan legal database, case law, legal acts, legal dictionary, legal documents, law reference, Pakistani constitution, Islamic law, legal research',
  openGraph: {
    title: 'Legal Knowledge Base - Laws, Cases & Documents | QanoonMate',
    description: 'Access Pakistan\'s comprehensive legal database including acts, case laws, legal dictionary, drafts, FAQs, and guides.',
    type: 'website',
    url: 'https://qanoonmate.com/knowledgebase',
    images: [
      {
        url: '/Pictures/knowledgebase-og.jpg',
        width: 1200,
        height: 630,
        alt: 'QanoonMate Legal Knowledge Base'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Legal Knowledge Base - Laws, Cases & Documents | QanoonMate',
    description: 'Access Pakistan\'s comprehensive legal database including acts, case laws, and more.',
    images: ['/Pictures/knowledgebase-twitter.jpg']
  }
}

interface KnowledgebaseLayoutProps {
  children: ReactNode
}

export default function KnowledgebaseLayout({ children }: KnowledgebaseLayoutProps) {
  return children
}
