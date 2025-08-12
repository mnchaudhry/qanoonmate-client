import { Metadata } from 'next'

interface SEOConfig {
  title: string
  description: string
  keywords?: string
  path?: string
  image?: string
  type?: 'website' | 'article' | 'profile'
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  section?: string
}

const defaultConfig = {
  siteName: 'QanoonMate',
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://qanoonmate.com',
  defaultImage: '/Pictures/qanoonmate-og-image.jpg',
  twitterHandle: '@qanoonmate',
}

export function generateSEOMetadata({
  title,
  description,
  keywords,
  path = '',
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
  section,
}: SEOConfig): Metadata {
  const fullTitle = title.includes('QanoonMate') ? title : `${title} | QanoonMate`
  const url = `${defaultConfig.baseUrl}${path}`
  const ogImage = image || defaultConfig.defaultImage

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords,
    authors: authors ? authors.map(name => ({ name })) : [{ name: 'QanoonMate Team' }],
    creator: 'QanoonMate',
    publisher: 'QanoonMate',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(defaultConfig.baseUrl),
    alternates: {
      canonical: url,
      languages: {
        'en-US': url,
        'ur-PK': url.replace('/en/', '/ur/'), // If you plan to add Urdu support
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: defaultConfig.siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      creator: defaultConfig.twitterHandle,
      site: defaultConfig.twitterHandle,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
    },
  }

  // Add article-specific metadata
  if (type === 'article') {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime,
      modifiedTime,
      authors: authors,
      section,
    }
  }

  return metadata
}

// Predefined metadata for common pages
export const commonPageMetadata = {
  home: generateSEOMetadata({
    title: 'QanoonMate - AI-Powered Legal Platform for Pakistan',
    description: 'Get instant legal advice, connect with qualified lawyers, and access Pakistan\'s largest legal database. QanoonMate simplifies legal access with AI-driven solutions.',
    keywords: 'legal advice Pakistan, lawyer consultation, Pakistan law, legal database, AI legal assistant, case law, legal documents, law firm Pakistan',
    path: '/',
  }),
  
  lawyers: generateSEOMetadata({
    title: 'Find Qualified Lawyers in Pakistan',
    description: 'Connect with experienced lawyers across Pakistan. Browse profiles, read reviews, and book consultations with legal experts in various practice areas.',
    keywords: 'lawyers Pakistan, legal consultation, find lawyer, law firm, legal expert, lawyer directory Pakistan',
    path: '/lawyers',
  }),

  chatbot: generateSEOMetadata({
    title: 'AI Legal Assistant - Get Instant Legal Advice',
    description: 'Chat with our AI-powered legal assistant for instant answers to your legal questions. Get preliminary legal guidance 24/7.',
    keywords: 'AI legal assistant, legal chatbot, instant legal advice, automated legal help, legal AI Pakistan',
    path: '/chatbot',
  }),

  knowledgebase: generateSEOMetadata({
    title: 'Legal Knowledge Base - Laws, Cases & Documents',
    description: 'Access Pakistan\'s comprehensive legal database including acts, case laws, legal dictionary, drafts, FAQs, and guides.',
    keywords: 'Pakistan legal database, case law, legal acts, legal dictionary, legal documents, law reference',
    path: '/knowledgebase',
  }),

  blogs: generateSEOMetadata({
    title: 'Legal Blog - Latest Legal News & Insights',
    description: 'Stay updated with the latest legal news, insights, and analysis from Pakistan\'s legal experts. Read articles on various areas of law.',
    keywords: 'legal blog Pakistan, legal news, law insights, legal articles, Pakistan law updates',
    path: '/blogs',
  }),

  pricing: generateSEOMetadata({
    title: 'Pricing Plans - Affordable Legal Services',
    description: 'Choose from our flexible pricing plans for legal consultations, document drafting, and premium legal services. Transparent pricing, no hidden fees.',
    keywords: 'legal services pricing, lawyer consultation fees, legal advice cost, affordable legal help Pakistan',
    path: '/pricing',
  }),
}

// Utility for dynamic page metadata
export function generateDynamicMetadata(
  baseTitle: string,
  baseDescription: string,
  path: string,
  additionalKeywords?: string
): Metadata {
  return generateSEOMetadata({
    title: baseTitle,
    description: baseDescription,
    keywords: additionalKeywords,
    path,
  })
}
