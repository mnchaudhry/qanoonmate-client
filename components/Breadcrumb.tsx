import React from 'react'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import StructuredData from './StructuredData'

interface BreadcrumbItem {
  label: string
  href: string
  current?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  // Generate structured data for breadcrumbs
  const breadcrumbStructuredData = {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href === '/' ? undefined : `https://qanoonmate.com${item.href}`,
    })),
  }

  return (
    <>
      <StructuredData data={breadcrumbStructuredData} />
      <nav 
        className={`flex items-center space-x-1 text-sm text-muted-foreground ${className}`}
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center space-x-1">
          {items.map((item, index) => (
            <li key={item.href} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground/60" />
              )}
              {item.current ? (
                <span 
                  className="font-medium text-foreground"
                  aria-current="page"
                >
                  {index === 0 && <Home className="h-4 w-4 inline mr-1" />}
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-foreground transition-colors"
                >
                  {index === 0 && <Home className="h-4 w-4 inline mr-1" />}
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}

export default Breadcrumb

// Utility function to generate breadcrumb items from pathname
export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const pathSegments = pathname.split('/').filter(Boolean)
  
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' }
  ]

  let currentPath = ''
  
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    
    // Convert segment to readable label
    const label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    
    breadcrumbs.push({
      label,
      href: currentPath,
      current: index === pathSegments.length - 1
    })
  })

  return breadcrumbs
}

// Predefined breadcrumbs for common sections
export const commonBreadcrumbs = {
  lawyers: [
    { label: 'Home', href: '/' },
    { label: 'Lawyers', href: '/lawyers', current: true }
  ],
  
  knowledgebase: [
    { label: 'Home', href: '/' },
    { label: 'Knowledge Base', href: '/knowledgebase', current: true }
  ],
  
  acts: [
    { label: 'Home', href: '/' },
    { label: 'Knowledge Base', href: '/knowledgebase' },
    { label: 'Acts', href: '/knowledgebase/acts', current: true }
  ],
  
  caseLaws: [
    { label: 'Home', href: '/' },
    { label: 'Knowledge Base', href: '/knowledgebase' },
    { label: 'Case Laws', href: '/knowledgebase/case-laws', current: true }
  ],
  
  blogs: [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blogs', current: true }
  ],
  
  chatbot: [
    { label: 'Home', href: '/' },
    { label: 'AI Legal Assistant', href: '/chatbot', current: true }
  ],
  
  contact: [
    { label: 'Home', href: '/' },
    { label: 'Contact', href: '/contact', current: true }
  ]
}
