import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// SEO-optimized internal link component
interface SEOLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  title?: string
  'aria-label'?: string
  prefetch?: boolean
}

export const SEOLink: React.FC<SEOLinkProps> = ({
  href,
  children,
  className = '',
  title,
  'aria-label': ariaLabel,
  prefetch = true,
}) => {
  return (
    <Link
      href={href}
      className={cn('text-primary hover:text-primary/80 transition-colors', className)}
      title={title}
      aria-label={ariaLabel}
      prefetch={prefetch}
    >
      {children}
    </Link>
  )
}

// Related content suggestions
interface RelatedLink {
  href: string
  title: string
  description?: string
  category?: string
}

interface RelatedLinksProps {
  links: RelatedLink[]
  title?: string
  className?: string
}

export const RelatedLinks: React.FC<RelatedLinksProps> = ({
  links,
  title = 'Related Content',
  className = '',
}) => {
  if (links.length === 0) return null

  return (
    <aside className={cn('bg-muted/50 rounded-lg p-6 mt-8', className)}>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <nav aria-label="Related content">
        <ul className="space-y-3">
          {links.map((link, index) => (
            <li key={index}>
              <SEOLink
                href={link.href}
                className="block hover:bg-background rounded-md p-3 transition-colors"
                title={`Read more about ${link.title}`}
              >
                <div className="font-medium text-foreground">{link.title}</div>
                {link.description && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {link.description}
                  </div>
                )}
                {link.category && (
                  <div className="text-xs text-primary font-medium mt-2">
                    {link.category}
                  </div>
                )}
              </SEOLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

// Contextual navigation for legal content
interface LegalNavigation {
  acts?: RelatedLink[]
  caseLaws?: RelatedLink[]
  guides?: RelatedLink[]
  faqs?: RelatedLink[]
}

export const LegalContentNavigation: React.FC<LegalNavigation> = ({
  acts = [],
  caseLaws = [],
  guides = [],
  faqs = [],
}) => {
  const sections = [
    { title: 'Related Acts', links: acts, href: '/knowledgebase/acts' },
    { title: 'Related Case Laws', links: caseLaws, href: '/knowledgebase/case-laws' },
    { title: 'Helpful Guides', links: guides, href: '/knowledgebase/guides' },
    { title: 'Common Questions', links: faqs, href: '/knowledgebase/faqs' },
  ].filter(section => section.links.length > 0)

  if (sections.length === 0) return null

  return (
    <nav className="mt-12 space-y-8" aria-label="Legal content navigation">
      {sections.map((section, index) => (
        <section key={index} className="border-t pt-8 first:border-t-0 first:pt-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{section.title}</h3>
            <SEOLink
              href={section.href}
              className="text-sm font-medium"
              title={`View all ${section.title.toLowerCase()}`}
            >
              View All →
            </SEOLink>
          </div>
          <ul className="grid gap-3 md:grid-cols-2">
            {section.links.slice(0, 4).map((link, linkIndex) => (
              <li key={linkIndex}>
                <SEOLink
                  href={link.href}
                  className="block p-3 border rounded-md hover:border-primary/50 transition-colors"
                  title={`Learn about ${link.title}`}
                >
                  <div className="font-medium">{link.title}</div>
                  {link.description && (
                    <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {link.description}
                    </div>
                  )}
                </SEOLink>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </nav>
  )
}

// Breadcrumb-style navigation
interface BreadcrumbStep {
  href: string
  label: string
  current?: boolean
}

interface BreadcrumbNavProps {
  steps: BreadcrumbStep[]
  className?: string
}

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({
  steps,
  className = '',
}) => {
  return (
    <nav 
      className={cn('flex items-center space-x-2 text-sm text-muted-foreground mb-6', className)}
      aria-label="Breadcrumb navigation"
    >
      {steps.map((step, index) => (
        <React.Fragment key={step.href}>
          {index > 0 && <span>/</span>}
          {step.current ? (
            <span className="font-medium text-foreground" aria-current="page">
              {step.label}
            </span>
          ) : (
            <SEOLink
              href={step.href}
              className="hover:text-foreground"
              title={`Go to ${step.label}`}
            >
              {step.label}
            </SEOLink>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

// Call-to-action links for conversions
interface CTALinkProps {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const CTALink: React.FC<CTALinkProps> = ({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-primary-foreground',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </Link>
  )
}

// Quick navigation for legal sections
export const QuickNavigation: React.FC = () => {
  const quickLinks = [
    {
      href: '/lawyers',
      title: 'Find Lawyers',
      description: 'Connect with qualified legal professionals',
    },
    {
      href: '/chatbot',
      title: 'AI Assistant',
      description: 'Get instant legal guidance',
    },
    {
      href: '/knowledgebase',
      title: 'Legal Database',
      description: 'Access laws, cases, and documents',
    },
    {
      href: '/blogs',
      title: 'Legal Blog',
      description: 'Latest news and insights',
    },
  ]

  return (
    <nav className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8" aria-label="Quick navigation">
      {quickLinks.map((link, index) => (
        <SEOLink
          key={index}
          href={link.href}
          className="block p-4 border rounded-lg hover:border-primary/50 hover:shadow-md transition-all"
          title={link.description}
        >
          <div className="font-medium text-foreground">{link.title}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {link.description}
          </div>
        </SEOLink>
      ))}
    </nav>
  )
}
