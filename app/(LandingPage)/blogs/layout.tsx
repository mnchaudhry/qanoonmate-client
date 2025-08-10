import { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Legal Blog - Latest Legal News & Insights',
  description: 'Stay updated with the latest legal news, insights, and analysis from Pakistan\'s legal experts. Read articles on various areas of law, legal reforms, and case studies.',
  keywords: 'legal blog Pakistan, legal news, law insights, legal articles, Pakistan law updates, legal analysis, legal reforms, case studies',
  openGraph: {
    title: 'Legal Blog - Latest Legal News & Insights | QanoonMate',
    description: 'Stay updated with the latest legal news, insights, and analysis from Pakistan\'s legal experts.',
    type: 'website',
    url: 'https://qanoonmate.com/blogs',
    images: [
      {
        url: '/Pictures/blog-og.jpg',
        width: 1200,
        height: 630,
        alt: 'QanoonMate Legal Blog'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Legal Blog - Latest Legal News & Insights | QanoonMate',
    description: 'Stay updated with the latest legal news, insights, and analysis from Pakistan\'s legal experts.',
    images: ['/Pictures/blog-twitter.jpg']
  }
}

interface BlogLayoutProps {
  children: ReactNode
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  return children
}
