import React from 'react'

interface Organization {
  '@type': 'Organization'
  name: string
  url: string
  logo: string
  description: string
  contactPoint: {
    '@type': 'ContactPoint'
    telephone: string
    contactType: string
    availableLanguage: string[]
  }
  address: {
    '@type': 'PostalAddress'
    addressCountry: string
    addressLocality: string
  }
  sameAs: string[]
}

interface WebSite {
  '@type': 'WebSite'
  name: string
  url: string
  description: string
  potentialAction: {
    '@type': 'SearchAction'
    target: string
    'query-input': string
  }
}

interface LegalService {
  '@type': 'LegalService'
  name: string
  description: string
  provider: {
    '@type': 'Organization'
    name: string
  }
  areaServed: string
  serviceType: string[]
}

interface Article {
  '@type': 'Article'
  headline: string
  description: string
  author: {
    '@type': 'Person' | 'Organization'
    name: string
  }
  publisher: {
    '@type': 'Organization'
    name: string
    logo: {
      '@type': 'ImageObject'
      url: string
    }
  }
  datePublished: string
  dateModified: string
  mainEntityOfPage: string
  image: string
}

interface Lawyer {
  '@type': 'Person'
  name: string
  jobTitle: string
  description: string
  image: string
  url: string
  knowsAbout: string[]
  memberOf: {
    '@type': 'Organization'
    name: string
  }
  address: {
    '@type': 'PostalAddress'
    addressCountry: string
    addressLocality: string
  }
}

interface StructuredDataProps {
  data: Organization | WebSite | LegalService | Article | Lawyer | any
}

const StructuredData: React.FC<StructuredDataProps> = ({ data }) => {
  const structuredData = {
    '@context': 'https://schema.org',
    ...data,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

// Predefined structured data for common pages
export const organizationStructuredData: Organization = {
  '@type': 'Organization',
  name: 'QanoonMate',
  url: 'https://qanoonmate.com',
  logo: 'https://qanoonmate.com/Pictures/qanoonmate-logo.png',
  description: 'Pakistan\'s leading legal tech platform providing AI-driven legal solutions, lawyer consultations, and comprehensive legal database access.',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+92-XXX-XXXXXXX',
    contactType: 'customer service',
    availableLanguage: ['English', 'Urdu'],
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'Pakistan',
    addressLocality: 'Karachi',
  },
  sameAs: [
    'https://facebook.com/qanoonmate',
    'https://twitter.com/qanoonmate',
    'https://linkedin.com/company/qanoonmate',
  ],
}

export const websiteStructuredData: WebSite = {
  '@type': 'WebSite',
  name: 'QanoonMate',
  url: 'https://qanoonmate.com',
  description: 'AI-powered legal platform for Pakistan providing instant legal advice, lawyer consultations, and comprehensive legal database.',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://qanoonmate.com/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
}

export const legalServiceStructuredData: LegalService = {
  '@type': 'LegalService',
  name: 'QanoonMate Legal Services',
  description: 'Comprehensive legal services including AI legal assistance, lawyer consultations, document drafting, and legal research.',
  provider: {
    '@type': 'Organization',
    name: 'QanoonMate',
  },
  areaServed: 'Pakistan',
  serviceType: [
    'Legal Consultation',
    'Document Drafting',
    'Legal Research',
    'AI Legal Assistance',
    'Case Law Analysis',
  ],
}

export default StructuredData
