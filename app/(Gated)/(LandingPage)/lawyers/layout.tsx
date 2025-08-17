import { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Find Qualified Lawyers in Pakistan',
  description: 'Connect with experienced lawyers across Pakistan. Browse profiles, read reviews, and book consultations with legal experts in various practice areas including civil law, criminal law, family law, corporate law, and more.',
  keywords: 'lawyers Pakistan, legal consultation, find lawyer, law firm, legal expert, lawyer directory Pakistan, advocate Pakistan, barrister Pakistan, solicitor Pakistan, legal services',
  openGraph: {
    title: 'Find Qualified Lawyers in Pakistan | QanoonMate',
    description: 'Connect with experienced lawyers across Pakistan. Browse profiles, read reviews, and book consultations with legal experts.',
    type: 'website',
    url: 'https://qanoonmate.com/lawyers',
    images: [
      {
        url: '/Pictures/lawyers-directory-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Find Qualified Lawyers in Pakistan - QanoonMate'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Qualified Lawyers in Pakistan | QanoonMate',
    description: 'Connect with experienced lawyers across Pakistan. Browse profiles and book consultations.',
    images: ['/Pictures/lawyers-directory-twitter.jpg']
  }
}

interface LawyersLayoutProps {
  children: ReactNode
}

export default function LawyersLayout({ children }: LawyersLayoutProps) {
  return children
}
