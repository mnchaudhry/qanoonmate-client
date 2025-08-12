import React, { JSX } from 'react'

// Semantic heading component that ensures proper hierarchy
interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: React.ReactNode
  className?: string
  id?: string
}

export const Heading: React.FC<HeadingProps> = ({ level, children, className = '', id }) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements
  
  // Default styling based on semantic importance
  const defaultStyles = {
    1: 'text-4xl font-bold mb-6',
    2: 'text-3xl font-semibold mb-5',
    3: 'text-2xl font-semibold mb-4',
    4: 'text-xl font-medium mb-3',
    5: 'text-lg font-medium mb-2',
    6: 'text-base font-medium mb-2',
  }

  const combinedClassName = `${defaultStyles[level]} ${className}`.trim()

  return (
    <Tag className={combinedClassName} id={id}>
      {children}
    </Tag>
  )
}

// Page structure component for consistent layout
interface PageStructureProps {
  children: React.ReactNode
  className?: string
}

export const PageMain: React.FC<PageStructureProps> = ({ children, className = '' }) => (
  <main className={`min-h-screen ${className}`} role="main">
    {children}
  </main>
)

export const PageSection: React.FC<PageStructureProps & { 'aria-label'?: string }> = ({ 
  children, 
  className = '',
  'aria-label': ariaLabel 
}) => (
  <section className={className} aria-label={ariaLabel}>
    {children}
  </section>
)

export const PageArticle: React.FC<PageStructureProps> = ({ children, className = '' }) => (
  <article className={className}>
    {children}
  </article>
)

export const PageAside: React.FC<PageStructureProps> = ({ children, className = '' }) => (
  <aside className={className}>
    {children}
  </aside>
)

export const PageNav: React.FC<PageStructureProps & { 'aria-label': string }> = ({ 
  children, 
  className = '',
  'aria-label': ariaLabel 
}) => (
  <nav className={className} aria-label={ariaLabel}>
    {children}
  </nav>
)

// Skip link for accessibility
export const SkipLink: React.FC = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
  >
    Skip to main content
  </a>
)

// Semantic list components
interface ListProps {
  children: React.ReactNode
  className?: string
}

export const OrderedList: React.FC<ListProps> = ({ children, className = '' }) => (
  <ol className={`list-decimal list-inside space-y-2 ${className}`}>
    {children}
  </ol>
)

export const UnorderedList: React.FC<ListProps> = ({ children, className = '' }) => (
  <ul className={`list-disc list-inside space-y-2 ${className}`}>
    {children}
  </ul>
)

export const ListItem: React.FC<ListProps> = ({ children, className = '' }) => (
  <li className={className}>
    {children}
  </li>
)

// Semantic text components
interface TextProps {
  children: React.ReactNode
  className?: string
}

export const Paragraph: React.FC<TextProps> = ({ children, className = '' }) => (
  <p className={`mb-4 leading-relaxed ${className}`}>
    {children}
  </p>
)

export const Blockquote: React.FC<TextProps> = ({ children, className = '' }) => (
  <blockquote className={`border-l-4 border-primary pl-4 italic text-muted-foreground my-4 ${className}`}>
    {children}
  </blockquote>
)

// Landmark regions for better accessibility
export const ContentWrapper: React.FC<PageStructureProps> = ({ children, className = '' }) => (
  <div className={`container mx-auto px-4 ${className}`}>
    {children}
  </div>
)

// Helper component for proper heading hierarchy validation in development
export const HeadingHierarchyChecker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (process.env.NODE_ENV === 'development') {
    // In development, you could add logic to check heading hierarchy
    // This would warn developers about improper heading nesting
  }
  return <>{children}</>
}
