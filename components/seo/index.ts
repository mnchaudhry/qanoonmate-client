// SEO Components Export
export { default as StructuredData } from '@/components/StructuredData'
export * from '@/components/StructuredData'

export { default as Breadcrumb } from '@/components/Breadcrumb'
export * from '@/components/Breadcrumb'

export * from './SemanticStructure'
export * from './InternalLinks'

// Re-export utility functions
export { generateSEOMetadata, commonPageMetadata, generateDynamicMetadata } from '../../lib/seo'
