import { Metadata } from 'next'
import { ReactNode } from 'react'

// Define the blog structure for type safety
interface BlogMeta {
  title: string
  summary?: string
  featuredImage?: string
  author?: { name: string }
  createdAt: string
  category?: string
}

// This would typically fetch from your API
async function getBlogMeta(slug: string): Promise<BlogMeta | null> {
  try {
    // In a real implementation, you would fetch from your API here
    // For now, return a default structure
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://qanoonmate.com'
    const response = await fetch(`${baseUrl}/api/blogs/${slug}`, {
      next: { revalidate: 3600 } // Revalidate every hour
    })
    
    if (!response.ok) return null
    
    const data = await response.json()
    return data.data || data
  } catch (error) {
    console.error('Failed to fetch blog metadata:', error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const blog = await getBlogMeta(params.slug)
  
  if (!blog) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    }
  }

  const title = `${blog.title} | QanoonMate Blog`
  const description = blog.summary || `Read ${blog.title} on QanoonMate's legal blog. Stay updated with the latest legal insights and news from Pakistan.`
  const publishedTime = new Date(blog.createdAt).toISOString()
  const image = blog.featuredImage || '/Pictures/blog-default-og.jpg'

  return {
    title,
    description,
    keywords: `${blog.title}, legal blog, Pakistan law, ${blog.category || 'legal news'}, legal insights`,
    authors: blog.author ? [{ name: blog.author.name }] : [{ name: 'QanoonMate Team' }],
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://qanoonmate.com/blogs/${params.slug}`,
      publishedTime,
      authors: blog.author ? [blog.author.name] : ['QanoonMate Team'],
      section: blog.category || 'Legal',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

interface BlogPostLayoutProps {
  children: ReactNode
  params: { slug: string }
}

export default function BlogPostLayout({ children }: BlogPostLayoutProps) {
  return children
}
